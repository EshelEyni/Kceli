import { FoodScanResult } from "../../../../shared/types/foodScan";

export async function scanFoodPhoto(image: string, context: string, signal: AbortSignal): Promise<FoodScanResult> {
  const base = "/api/";
  const response = await fetch(base + "nutrition/scan-food", {
    method: "POST", credentials: "include", cache: "no-store", signal,
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image, context }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.message || "Could not analyze the photo. Please try again.");
  return body.data;
}
