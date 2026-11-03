import { FoodEstimate } from "../../../../shared/types/foodEstimate";

export async function estimateMeal(description: string, signal: AbortSignal): Promise<FoodEstimate> {
  const response = await fetch("/api/nutrition/estimate-food", {
    method: "POST", credentials: "include", cache: "no-store", signal,
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description }),
  });
  let body;
  try { body = await response.json(); }
  catch { throw new Error("Could not read the calorie estimate. Please try again or enter calories."); }
  if (!response.ok) throw new Error(body.message || "Could not estimate calories. Try again or enter calories.");
  if (body.status !== "success" || !Number.isInteger(body.data?.calories) ||
      body.data.calories < 0 || body.data.calories > 20000 || typeof body.data.assumptions !== "string")
    throw new Error("Could not read the calorie estimate. Please try again or enter calories.");
  return body.data;
}
