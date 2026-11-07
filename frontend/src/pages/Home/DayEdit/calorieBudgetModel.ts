export function getCalorieBudget(consumed: number, target: number) {
  const valid = Number.isFinite(target) && target > 0;
  const eaten = Number.isFinite(consumed) ? Math.max(0, consumed) : 0;
  const ratio = valid ? eaten / target : 0;
  return {
    state: !valid ? "unavailable" : ratio >= 1 ? "red" : ratio >= 0.8 ? "yellow" : "green",
    percentage: Math.min(100, ratio * 100),
    remaining: valid ? target - eaten : null,
    eaten,
  };
}

// Today's guidance follows profile changes; previous days keep their recorded target.
export function getBudgetTarget(
  date: Date | string | undefined,
  saved: number | undefined,
  current: number | undefined
) {
  const isToday = date != null && new Date(date).toDateString() === new Date().toDateString();
  return (isToday ? current ?? saved : saved) ?? 0;
}
