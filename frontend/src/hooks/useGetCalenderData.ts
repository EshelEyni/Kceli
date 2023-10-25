import { useQuery } from "@tanstack/react-query";
import { DayData } from "../../../shared/types/dayData";
import dayDataApiService from "../services/dayData/dayDataApiService";
import { getDaysInMonth, isSameDay } from "../services/util/utilService";
import { useAuth } from "./useAuth";
import { User } from "../../../shared/types/user";
import calorieUtilService from "../services/calorieUtil/calorieUtilService";
import { CalenderDay, UserOrNull } from "../types/app";

interface CalendarQueryParams {
  date: Date;
  data: DayData[] | undefined;
  loggedInUser: User | null;
}

type useDaysResult = {
  days: CalenderDay[];
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
};

export function useGetCalenderData(currDate: Date): useDaysResult {
  const { loggedInUser } = useAuth();

  const { data, error, isLoading, isSuccess, isError } = useQuery({
    queryKey: [`calenderData`, currDate],
    queryFn: () => {
      const month = currDate.getMonth() + 1;
      const year = currDate.getFullYear();
      return dayDataApiService.getCalenderData(month, year);
    },
  });

  const isEmpty = !!data && data.length === 0;

  const days = getCalenderDays({ date: currDate, data, loggedInUser });

  return { days, error, isLoading, isSuccess, isError, isEmpty };
}

function getCalenderDays({ date, data, loggedInUser }: CalendarQueryParams): CalenderDay[] {
  return getCalendarDays(date).map(d => setDataToDay({ date: d, data, loggedInUser }));
}

function getCalendarDays(currDate: Date): Date[] {
  const daysInMonth = getDaysInMonth(currDate.getMonth() + 1, currDate.getFullYear());

  const currentMonthDates = Array.from({ length: daysInMonth - 1 }, (_, i) => {
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

function setDataToDay({ date, data, loggedInUser }: CalendarQueryParams) {
  const defaultDayData = getDefaultDayData(date);
  if (!data) return defaultDayData;

  const dayData = data.find(day => isSameDay(new Date(day.date), date));

  if (!dayData) return defaultDayData;

  const consumedCalories = calorieUtilService.getTotalCalories(dayData);

  const backgroundColor = getBackgroundColor(dayData, loggedInUser, consumedCalories);

  return {
    ...defaultDayData,
    id: dayData.id,
    data: dayData,
    backgroundColor,
  };
}

function getDefaultDayData(date: Date): CalenderDay {
  return {
    id: null,
    data: null,
    backgroundColor: "",
    date: date,
    day: date.getDate(),
    consumedCalories: 0,
  };
}

function getBackgroundColor(
  dayData: DayData,
  loggedInUser: UserOrNull,
  consumedCalories: number
): string {
  if (dayData && loggedInUser) {
    return calorieUtilService.getBcgByCosumedCalories({
      consumedCalories,
      targetCalorie: loggedInUser.targetCaloricIntakePerDay,
    });
  }
  return "";
}
