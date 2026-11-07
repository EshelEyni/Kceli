export type DailyMotivationResult = {
  localDate: string;
  status: "disabled" | "pending" | "ready" | "failed";
  text: string | null;
};
