import { createContext, useContext, useState, useCallback } from "react";
import { useGetCalenderData } from "../../hooks/useGetCalenderData";
import { CalenderDay, ScheduleGridFilter } from "../../types/app";
import { DayData } from "../../../../shared/types/dayData";

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
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [currDay, setCurrDay] = useState<CalenderDay | null>(null);
  const [currDays, setCurrDays] = useState<CalenderDay[]>([]);
  const [filterBy, setFilterBy] = useState<ScheduleGridFilter>(ScheduleGridFilter.Day);
  const { calenderDays, data, isLoading, isSuccess, isError } = useGetCalenderData(currDate);

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
