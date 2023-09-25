function getMonthDays(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default { getMonthDays };
