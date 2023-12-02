import { FC, useEffect } from "react";
import { isSameDay } from "../../services/util/utilService";
import "./Schedule.scss";
import { CalenderDay, ScheduleGridFilter } from "../../types/app";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { DayReport } from "./DayReport";
import { Button } from "../../components/App/Button/Button";
import { IoChevronBackCircleSharp, IoChevronForwardCircleSharp } from "react-icons/io5";
import { Header } from "../../components/App/Header/Header";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import { DaysReport } from "./DaysReport";
import { ScheduleFilter } from "./ScheduleFilter";
import { useSchedule } from "./ScheduleContext";
import { Calender } from "./Calender";
import { WeekReport } from "./WeekReport";
import { MonthReport } from "./MonthReport";

const SchedulePage: FC = () => {
  usePageLoaded({ title: "Schedule / Kceli" });
  const {
    currDate,
    currDay,
    setCurrDay,
    currDays,
    setCurrDays,
    filterBy,
    calenderDays,
    isLoading,
    isSuccess,
    isError,
    moveToMonth,
    getWeekDays,
    getMonthDays,
  } = useSchedule();

  const isDayReportShown = !!currDay && filterBy === ScheduleGridFilter.Day;
  const isDaysReportShown = currDays.length > 0 && filterBy === ScheduleGridFilter.Day;

  useEffect(() => {
    if (!isSuccess || !!currDay) return;
    const today = currDate;
    const todayDay = calenderDays.find(d => isSameDay(d.date, today));
    if (!todayDay) return;
    setCurrDay(todayDay);
    if (filterBy === ScheduleGridFilter.Day) return;
    if (filterBy === ScheduleGridFilter.Week) {
      const weekDays = getWeekDays(todayDay);
      if (!weekDays) return;
      setCurrDays(weekDays);
      return;
    }

    if (filterBy === ScheduleGridFilter.Month) {
      const monthDays = getMonthDays(todayDay);
      if (!monthDays) return;
      setCurrDays(monthDays);
      return;
    }
  }, [
    calenderDays,
    isSuccess,
    currDay,
    currDays,
    setCurrDay,
    currDate,
    filterBy,
    setCurrDays,
    getWeekDays,
    getMonthDays,
  ]);

  return (
    <main className="page schedule-page">
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {isSuccess && (
        <>
          <Header className="schedule-page__header">
            <h2 className="schedule-page__header__title">
              {currDate.toLocaleString("en-GB", { month: "long" })} {currDate.getFullYear()}
            </h2>
            <div className="schedule-page__header__btns-container">
              <Button onClickFn={() => moveToMonth(-1)}>
                <IoChevronBackCircleSharp className="schedule-page__header__btns-container__btn__icon" />
              </Button>
              <Button onClickFn={() => moveToMonth(1)}>
                <IoChevronForwardCircleSharp className="schedule-page__header__btns-container__btn__icon" />
              </Button>
            </div>
          </Header>

          <Calender />
          <ScheduleFilter />
          {isDayReportShown && <DayReport day={currDay as CalenderDay} />}
          {isDaysReportShown && <DaysReport days={currDays} />}
          {filterBy === ScheduleGridFilter.Week && <WeekReport />}
          {filterBy === ScheduleGridFilter.Month && <MonthReport />}
        </>
      )}
    </main>
  );
};

export default SchedulePage;
