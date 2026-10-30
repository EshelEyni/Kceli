export interface FoodScanItem {
  name: string;
  quantity: number;
  unit: "g";
  calories: number;
}
export interface FoodScanResult {
  items: FoodScanItem[];
  assumptions: string;
}
