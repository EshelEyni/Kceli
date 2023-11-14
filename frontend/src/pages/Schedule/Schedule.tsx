import { FC, useEffect, useRef, useState } from "react";
import { days as dayNames, isSameDay } from "../../services/util/utilService";
import "./Schedule.scss";
import { useGetCalenderData } from "../../hooks/useGetCalenderData";
import { CalenderDay } from "../../types/app";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { DayReport } from "./DayReport";
import classnames from "classnames";
import { Button } from "../../components/App/Button/Button";
import { IoChevronBackCircleSharp, IoChevronForwardCircleSharp } from "react-icons/io5";
import { Header } from "../../components/App/Header/Header";

const SchedulePage: FC = () => {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [currDay, setCurrDay] = useState<CalenderDay | null>(null);
  const { days, isLoading, isSuccess, isError } = useGetCalenderData(currDate);
  const gridRef = useRef<HTMLUListElement>(null);
  const startX = useRef(0);

  function handleDayClick(day: CalenderDay) {
    setCurrDay(day);
  }

  function moveToMonth(i: number) {
    const newDate = new Date(currDate);
    newDate.setMonth(currDate.getMonth() + i);
    setCurrDate(newDate);
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const moveToMonth = (i: number) => {
        const newDate = new Date(currDate);
        newDate.setMonth(currDate.getMonth() + i);
        setCurrDate(newDate);
      };
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const threshold = 50;

      if (endX - startX.current > threshold) moveToMonth(-1);
      if (startX.current - endX > threshold) moveToMonth(1);
    };

    const gridElement = gridRef.current;

    if (!gridElement) return;
    gridElement.addEventListener("touchstart", handleTouchStart, false);
    gridElement.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      if (!gridElement) return;
      gridElement.removeEventListener("touchstart", handleTouchStart);
      gridElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currDate, isSuccess]);

  useEffect(() => {
    if (!isSuccess || !!currDay) return;
    const today = new Date();
    const todayDay = days.find(d => isSameDay(d.date, today));
    if (todayDay) setCurrDay(todayDay);
  }, [days, isSuccess, currDay]);

  return (
    <main className="page schedule-page">
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {isSuccess && (
        <>
          <Header className="schedule-page__header">
            <h2 className="schedule-page__header__title">
              {currDate.toLocaleString("en-US", { month: "long" })} {currDate.getFullYear()}
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

          <ul className="schedule-grid" ref={gridRef}>
            {dayNames.map(day => (
              <li className="schedule-grid__item weekday-item" key={day.short}>
                <h3 className="schedule-grid__item__title">{day.short}</h3>
              </li>
            ))}
            {days.map(d => {
              const { backgroundColor, date } = d;
              const color = d.backgroundColor ? "white" : "";
              const border = d.isBorder ? "4px solid var(--color-success)" : "none";
              return (
                <li
                  className={classnames("schedule-grid__item", {
                    active: currDay && isSameDay(d.date, currDay.date),
                  })}
                  onClick={() => handleDayClick(d)}
                  style={{ backgroundColor, color }}
                  key={date.toISOString()}
                >
                  <div className="schedule-grid__item__wrapper" style={{ border }}>
                    <h3>{d.day}</h3>
                  </div>
                </li>
              );
            })}
          </ul>
          {currDay && <DayReport day={currDay} />}
        </>
      )}
    </main>
  );
};

export default SchedulePage;
