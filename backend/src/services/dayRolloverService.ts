import { DailyDataModel } from "../models/day/dailyDataModel";
import { AppError } from "./error/errorService";

export function getLocalDate(timeZone: string, now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const part = (type: string) => parts.find(p => p.type === type)!.value;
    return [part("year"), part("month"), part("day")].join("-");
  } catch {
    throw new AppError("Please provide a valid IANA time zone", 400);
  }
}

// Explicitly build this additive index before writes, including with autoIndex disabled.
// Cache failures only until the next request so a transient DB error can recover.
let indexReady: Promise<unknown> | undefined;
function ensureIndex() {
  if (!indexReady) {
    indexReady = DailyDataModel.collection
      .createIndex(
        { userId: 1, localDate: 1 },
        {
          unique: true,
          partialFilterExpression: { localDate: { $type: "string" } },
          name: "unique_user_local_date",
        }
      )
      .catch(error => {
        indexReady = undefined;
        throw error;
      });
  }
  return indexReady;
}

export async function ensureToday(userId: string, timeZone: string, now = new Date()) {
  const localDate = getLocalDate(timeZone, now);
  await ensureIndex();
  const key = { userId, localDate };
  const existing = await DailyDataModel.findOne(key);
  if (existing) return { doc: existing, created: false };

  // Reuse unkeyed history without rewriting its date or journal contents.
  const legacy = await DailyDataModel.findOne({
    userId,
    localDate: { $exists: false },
    $expr: {
      $eq: [
        { $dateToString: { date: "$date", format: "%Y-%m-%d", timezone: timeZone } },
        localDate,
      ],
    },
  }).sort({ date: -1 });
  try {
    if (legacy) {
      await DailyDataModel.updateOne(
        { _id: legacy._id, localDate: { $exists: false } },
        { $set: { localDate, timeZone } },
        { timestamps: false }
      );
      const doc = await DailyDataModel.findOne(key);
      if (!doc) throw new Error("Unable to claim existing daily record");
      return { doc, created: false };
    }
    // create() deliberately retains calorie/workout initialization save middleware.
    const doc = await DailyDataModel.create({ userId, localDate, timeZone, date: now });
    return { doc, created: true };
  } catch (error) {
    if (error.code !== 11000) throw error;
    const doc = await DailyDataModel.findOne(key);
    if (!doc) throw error;
    return { doc, created: false };
  }
}
