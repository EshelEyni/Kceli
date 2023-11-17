import { useQuery } from "@tanstack/react-query";
import { DayData } from "../../../shared/types/dayData";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { getDaysInMonth, isSameDay } from "../services/util/utilService";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { CalenderDay } from "../types/app";

interface CalendarQueryParams {
  date: Date;
  data: DayData[] | undefined;
}

type useDaysResult = {
  calenderDays: CalenderDay[];
  data: DayData[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
};

export function useGetCalenderData(currDate: Date): useDaysResult {
  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: [`calenderData`, currDate],
    queryFn: () => {
      const month = currDate.getMonth() + 1;
      const year = currDate.getFullYear();
      return dayDataApiService.getCalenderData(month, year);
    },
  });
  const isEmpty = !!data && data.length === 0;
  const calenderDays = setDataToDays({ date: currDate, data });
  return { calenderDays, data, error, isLoading, isSuccess, isError, isEmpty };
}

function setDataToDays({ date, data }: CalendarQueryParams): CalenderDay[] {
  const callenderDays = getCalenderDays(date);
  return callenderDays.map(d => setDataToDay({ date: d, data }));
}

function getCalenderDays(currDate: Date): Date[] {
  const daysInMonth = getDaysInMonth({
    month: currDate.getMonth(),
    year: currDate.getFullYear(),
  });

  const currentMonthDates = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(currDate.getFullYear(), currDate.getMonth(), i + 1);
  });

  const firstDay = currentMonthDates[0].getDay();
  const lastDay = currentMonthDates[currentMonthDates.length - 1].getDay();

  const prevMonthDates = Array.from({ length: firstDay }, (_, i) => {
    return new Date(currDate.getFullYear(), currDate.getMonth(), i - firstDay + 1);
  });

  const nextMonthDates = Array.from({ length: 6 - lastDay }, (_, i) => {
    return new Date(currDate.getFullYear(), currDate.getMonth() + 1, i + 1);
  });
  return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
}

function setDataToDay({ date, data }: CalendarQueryParams) {
  const defaultDayData = getDefaultDayData(date);
  if (!data) return defaultDayData;

  const dayData = data.find(day => isSameDay(new Date(day.date), date));

  if (!dayData) return defaultDayData;

  const consumedCalories = calorieUtilService.getTotalCalories(dayData);
  const targetCalorie = getDayCaloriesIntake({
    currDayData: dayData,
    data,
  });
  const backgroundColor = calorieUtilService.getBcgByCosumedCalories({
    consumedCalories,
    targetCalorie,
  });
  const isBorder = dayData.workouts.some(workout => workout.items.some(item => item.isCompleted));

  return {
    ...defaultDayData,
    id: dayData.id,
    data: dayData,
    targetCalorie,
    backgroundColor,
    isBorder,
  };
}

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

function getDayCaloriesIntake({
  currDayData,
  data,
}: {
  currDayData: DayData;
  data: DayData[] | undefined;
}) {
  if (!data) return 0;
  if (currDayData.targetCaloricIntake) return currDayData.targetCaloricIntake;
  const avgDayTargetCalories = Math.round(
    data.reduce((acc, day) => {
      if (!day.targetCaloricIntake) return acc;
      return acc + day.targetCaloricIntake;
    }, 0) / data.filter(day => day.targetCaloricIntake).length
  );

  return avgDayTargetCalories;
}
