import { createContext, useContext, useState, useCallback } from "react";
import { useGetCalenderData } from "../../hooks/useGetCalenderData";
import { CalenderDay, Goal, ScheduleGridFilter } from "../../types/app";
import { DayData } from "../../../../shared/types/dayData";
import { useGetGoals } from "../../hooks/useGetWeekGoals";
import { useAddGoal } from "../../hooks/useAddGoal";
import { useUpdateGoal } from "../../hooks/useUpdateGoal";
import { UseMutateFunction } from "@tanstack/react-query";

type ScheduleContextType = {
  currDate: Date;
  currDay: CalenderDay | null;
  setCurrDay: React.Dispatch<React.SetStateAction<CalenderDay | null>>;
  currDays: CalenderDay[];
  setCurrDays: React.Dispatch<React.SetStateAction<CalenderDay[]>>;
  filterBy: ScheduleGridFilter;
  setFilterBy: React.Dispatch<React.SetStateAction<ScheduleGridFilter>>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  calenderDays: CalenderDay[];
  data: DayData[] | undefined;
  moveToMonth: (i: number) => void;
  getWeekDays: (currDay: CalenderDay) => CalenderDay[];
  getMonthDays: (currDay: CalenderDay) => CalenderDay[];
  weekGoals: Goal[] | undefined;
  isWeekGoalsLoading: boolean;
  isWeekGoalsSuccess: boolean;
  isWeekGoalsError: boolean;
  isWeekGoalsEmpty: boolean;
  monthGoals: Goal[] | undefined;
  isMonthGoalsLoading: boolean;
  isMonthGoalsSuccess: boolean;
  isMonthGoalsError: boolean;
  isMonthGoalsEmpty: boolean;
  addGoal: UseMutateFunction<Goal, unknown, Partial<Goal>, unknown>;
  isAddGoalLoading: boolean;
  updateGoal: UseMutateFunction<Goal, unknown, Partial<Goal>, unknown>;
  isUpdateGoalLoading: boolean;
  isWeekGoalsEditEnabled: boolean;
  isMonthGoalsEditEnabled: boolean;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [currDay, setCurrDay] = useState<CalenderDay | null>(null);
  const [currDays, setCurrDays] = useState<CalenderDay[]>([]);
  const [filterBy, setFilterBy] = useState<ScheduleGridFilter>(ScheduleGridFilter.Day);
  const { calenderDays, data, isLoading, isSuccess, isError } = useGetCalenderData(currDate);
  const {
    goals: weekGoals,
    isLoading: isWeekGoalsLoading,
    isSuccess: isWeekGoalsSuccess,
    isError: isWeekGoalsError,
    isEmpty: isWeekGoalsEmpty,
  } = useGetGoals(getWeekGoalQueryStr());

  const {
    goals: monthGoals,
    isLoading: isMonthGoalsLoading,
    isSuccess: isMonthGoalsSuccess,
    isError: isMonthGoalsError,
    isEmpty: isMonthGoalsEmpty,
  } = useGetGoals(getMonthGoalQueryStr());

  const { isLoading: isAddGoalLoading, addGoal } = useAddGoal();
  const { isLoading: isUpdateGoalLoading, updateGoal } = useUpdateGoal();
  const isWeekGoalsEditEnabled = checkWeekGoalsEditEnabled();
  const isMonthGoalsEditEnabled = checkMonthGoalsEditEnabled();

  function getWeekGoalQueryStr() {
    if (!currDays.length || filterBy !== ScheduleGridFilter.Week) return "";
    const { date: firstDayDate } = currDays[0];
    firstDayDate.setHours(0, 0, 0, 0);
    const { date: lastDayDate } = currDays[currDays.length - 1];
    lastDayDate.setHours(23, 59, 59, 999);
    const queryStr = `?type=week&date[gte]=${firstDayDate.toISOString()}&date[lte]=${lastDayDate.toISOString()}`;
    return queryStr;
  }

  function getMonthGoalQueryStr() {
    if (!currDays.length || filterBy !== ScheduleGridFilter.Month) return "";
    const { date: firstDayDate } = currDays[0];
    firstDayDate.setHours(0, 0, 0, 0);
    const { date: lastDayDate } = currDays[currDays.length - 1];
    lastDayDate.setHours(23, 59, 59, 999);
    const queryStr = `?type=month&date[gte]=${firstDayDate.toISOString()}&date[lte]=${lastDayDate.toISOString()}`;
    return queryStr;
  }

  function checkWeekGoalsEditEnabled() {
    if (!currDays.length || filterBy !== ScheduleGridFilter.Week) return false;
    const firstDate = new Date(currDays[0].date);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(currDays[currDays.length - 1].date);
    lastDate.setHours(23, 59, 59, 999);
    const currDate = new Date();
    return currDate >= firstDate && currDate <= lastDate;
  }

  function checkMonthGoalsEditEnabled() {
    if (!currDays.length || filterBy !== ScheduleGridFilter.Month) return false;
    const firstDate = new Date(currDays[0].date);
    firstDate.setHours(0, 0, 0, 0);
    const lastDate = new Date(currDays[currDays.length - 1].date);
    lastDate.setHours(23, 59, 59, 999);
    const currDate = new Date();
    return currDate >= firstDate && currDate <= lastDate;
  }

  const moveToMonth = useCallback(
    (i: number) => {
      const newDate = new Date(currDate);
      newDate.setMonth(currDate.getMonth() + i);
      setCurrDate(newDate);
    },
    [currDate]
  );

  function getWeekDays(currDay: CalenderDay) {
    if (!Array.isArray(calenderDays)) return [];

    const startOfWeek = new Date(currDay.date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekDays = calenderDays.filter(d => {
      if (!d || !d.date) return false;
      const dDate = new Date(d.date);
      return dDate >= startOfWeek && dDate <= endOfWeek;
    });
    return weekDays;
  }

  function getMonthDays(currDay: CalenderDay) {
    if (!Array.isArray(calenderDays)) return [];

    const startOfMonth = new Date(currDay.date);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(currDay.date);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthDays = calenderDays.filter(d => {
      if (!d || !d.date) return false;
      const dDate = new Date(d.date);
      return dDate >= startOfMonth && dDate <= endOfMonth;
    });
    return monthDays;
  }

  const value = {
    currDate,
    currDay,
    setCurrDay,
    currDays,
    setCurrDays,
    filterBy,
    setFilterBy,
    isLoading,
    isSuccess,
    isError,
    calenderDays,
    data,
    moveToMonth,
    getWeekDays,
    getMonthDays,
    weekGoals,
    isWeekGoalsLoading,
    isWeekGoalsSuccess,
    isWeekGoalsError,
    isWeekGoalsEmpty,
    monthGoals,
    isMonthGoalsLoading,
    isMonthGoalsSuccess,
    isMonthGoalsError,
    isMonthGoalsEmpty,
    addGoal,
    isAddGoalLoading,
    updateGoal,
    isUpdateGoalLoading,
    isWeekGoalsEditEnabled,
    isMonthGoalsEditEnabled,
  };
  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
}

export { ScheduleProvider, useSchedule };
