import { CalenderDay } from "../../types/app";

function getDefaultDayData(date: Date): CalenderDay {
  return {
    id: null,
    data: null,
    targetCalorie: 0,
    backgroundColor: "",
    isBorder: false,
    date: date,
    day: date.getDate(),
    consumedCalories: 0,
  };
}

export default {
  getDefaultDayData,
};
