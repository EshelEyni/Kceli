import { FC, useEffect, useRef, useState } from "react";
import "./ScheduleGrid.scss";
import { useGetCalenderData } from "../../../hooks/useGetCalenderData";
import { days as dayNames, isSameDay } from "../../../services/util/utilService";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { CalenderDay } from "../../../types/app";
import { DayInfo } from "./DayInfo";
import classnames from "classnames";

export const ScheduleGrid: FC = () => {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [currDay, setCurrDay] = useState<CalenderDay | null>(null);
  const { days, isLoading, isSuccess, isError } = useGetCalenderData(currDate);

  const gridRef = useRef<HTMLUListElement>(null);
  const startX = useRef(0);

  function handleDayClick(day: CalenderDay) {
    setCurrDay(day);
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

  return (
    <section className="schedule-grid-wrapper">
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {isSuccess && (
        <>
          <ul className="schedule-grid" ref={gridRef}>
            {dayNames.map(day => (
              <li className="schedule-grid__item" key={day.short}>
                <h3 className="schedule-grid__item__title">{day.short}</h3>
              </li>
            ))}
            {days.map(d => {
              const { backgroundColor, date } = d;
              const color = d.backgroundColor ? "white" : "";
              return (
                <li
                  className={classnames("schedule-grid__item", {
                    active: currDay && isSameDay(d.date, currDay.date),
                  })}
                  onClick={() => handleDayClick(d)}
                  style={{ backgroundColor, color }}
                  key={date.toISOString()}
                >
                  <h3 className="schedule-grid__item__title">{d.day}</h3>
                </li>
              );
            })}
          </ul>
          {currDay && <DayInfo day={currDay} />}
        </>
      )}
    </section>
  );
};
