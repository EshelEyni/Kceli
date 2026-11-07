import { Types } from "mongoose";
import { FoodEstimate } from "../../../../shared/types/foodEstimate";
import { AppError } from "../error/errorService";
import { estimateFood, validateFoodDescription } from "../openAI/foodEstimateService";

const HISTORY_DAYS = 90;
const MAX_DAYS = 100;

// Only typographic differences are equivalent. Never remove quantities, units,
// ingredient words, decimal separators, or reorder/fuzzy-match tokens.
export function normalizeFoodDescription(value: string): string {
  return value.normalize("NFKC").toLowerCase()
    .replace(/[\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7]/g, "")
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '\"')
    .replace(/\s+/g, " ").trim().replace(/[.!?]+$/, "").trim();
}

export async function findFoodInHistory(
  description: string, userId: string,
  portion: { unit: string; quantity: number } = { unit: "unit", quantity: 1 },
  signal?: AbortSignal
): Promise<FoodEstimate | null> {
  // Background/model validation without authenticated context must never query
  // another user's history. It can still use the existing AI fallback.
  if (!Types.ObjectId.isValid(userId)) return null;
  const now = new Date();
  const since = new Date(now.getTime() - HISTORY_DAYS * 86400000);
  let days;
  try {
    // Scope before reading embedded food. Use the user/date index and only fetch
    // the fields needed for matching; do not hydrate documents or run save hooks.
    // Lazy import avoids a cycle: daily model -> intake schema -> this service.
    const { DailyDataModel } = await import("../../models/day/dailyDataModel");
    days = await DailyDataModel.find({ userId: new Types.ObjectId(userId), date: { $gte: since, $lte: now } })
      .select({ _id: 0, "intakes.isRecorded": 1, "intakes.recordedAt": 1, "intakes.items": 1 })
      .sort({ date: -1 }).limit(MAX_DAYS + 1).maxTimeMS(1500).lean().exec();
  } catch {
    // History is an optimization; database lookup failure must not disable AI.
    days = null;
  }
  if (signal?.aborted) throw new AppError("Food estimation cancelled", 499);
  const key = normalizeFoodDescription(description);
  const matches: { calories: number; recordedAt: number }[] = [];
  let unreliable = false;
  if (key && days && days.length <= MAX_DAYS) {
    for (const day of days) for (const intake of day.intakes || []) {
      const recordedAt = intake.recordedAt ? new Date(intake.recordedAt).getTime() : NaN;
      if (!intake.isRecorded || !Number.isFinite(recordedAt) || recordedAt < since.getTime() || recordedAt > now.getTime()) continue;
      for (const item of intake.items || []) {
        // Only reuse the exact saved portion; never infer serving size or scale
        // an ambiguous description. Quick logging requests one unit.
        if (item.unit !== portion.unit || item.quantity !== portion.quantity || typeof item.name !== "string" ||
            normalizeFoodDescription(item.name) !== key) continue;
        if (typeof item.calories !== "number" || !Number.isFinite(item.calories) || item.calories < 0 || item.calories > 20000) {
          unreliable = true; continue;
        }
        matches.push({ calories: Math.round(item.calories), recordedAt });
      }
    }
  }
  // Conflicting saved estimates are ambiguous; ask AI rather than guessing which
  // portion/recipe the user intended. Explicit zero-calorie records remain valid.
  if (!unreliable && matches.length && matches.every(item => item.calories === matches[0].calories)) {
    matches.sort((a, b) => b.recordedAt - a.recordedAt);
    return { calories: matches[0].calories, assumptions: /[\u0590-\u05ff]/.test(description)
      ? "הקלוריות נלקחו מרישום קודם שלך עם אותו תיאור. יש לבדוק שהכמות והמרכיבים זהים ולעדכן במידת הצורך."
      : "Calories reused from your saved entry with the same description. Review that portions and ingredients are unchanged and adjust if needed." };
  }
  return null;
}

export async function estimateFoodWithHistory(
  description: string, userId: string, signal?: AbortSignal
): Promise<FoodEstimate> {
  validateFoodDescription(description);
  if (!Types.ObjectId.isValid(userId)) throw new AppError("User not logged in", 401);
  const saved = await findFoodInHistory(description, userId, { unit: "unit", quantity: 1 }, signal);
  return saved ?? estimateFood(description, signal);
}
