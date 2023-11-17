import { FC, useRef, useEffect, useState } from "react";
import { days as dayNames, isSameDay } from "../../services/util/utilService";
import classnames from "classnames";
import { useSchedule } from "./ScheduleContext";
import { CalenderDay, ScheduleGridFilter } from "../../types/app";
import "./Calender.scss";

export const Calender: FC = () => {
  const {
    currDate,
    currDay,
    setCurrDay,
    currDays,
    setCurrDays,
    filterBy,
    calenderDays,
    isSuccess,
    moveToMonth,
    getWeekDays,
    getMonthDays,
  } = useSchedule();
  const [isShiftClicked, setIsShiftClicked] = useState<boolean>(false);

  const gridRef = useRef<HTMLUListElement>(null);
  const startX = useRef(0);

  function handleDayClick(day: CalenderDay) {
    switch (filterBy) {
      case ScheduleGridFilter.Day: {
        if (!isShiftClicked) {
          setCurrDay(day);
          setCurrDays([]);
          return;
        }
        if (!currDay) return;
        const updatedCurrDays = [];
        const currDayIndex = calenderDays.findIndex(d => isSameDay(d.date, currDay?.date));
        const dayIndex = calenderDays.findIndex(d => isSameDay(d.date, day.date));
        const startIndex = Math.min(currDayIndex, dayIndex);
        const endIndex = Math.max(currDayIndex, dayIndex);
        for (let i = startIndex; i <= endIndex; i++) updatedCurrDays.push(calenderDays[i]);
        setCurrDays(updatedCurrDays);
        setCurrDay(day);
        break;
      }
      case ScheduleGridFilter.Week: {
        const weekDays = getWeekDays(day);
        if (!weekDays) return;
        setCurrDays(weekDays);
        setCurrDay(day);
        break;
      }
      case ScheduleGridFilter.Month: {
        const monthDays = getMonthDays(day);
        if (!monthDays) return;
        setCurrDays(monthDays);
        setCurrDay(day);
        break;
      }
      default:
        break;
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
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
  }, [currDate, isSuccess, moveToMonth]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftClicked(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setIsShiftClicked(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <ul className="calender" ref={gridRef}>
      {dayNames.map(day => (
        <li className="calender__item weekday-item" key={day.short}>
          <h3 className="calender__item__title">{day.short}</h3>
        </li>
      ))}
      {calenderDays.map(d => {
        const { backgroundColor, date } = d;
        const color = d.backgroundColor ? "white" : "";
        const border = d.isBorder ? "4px solid var(--color-success)" : "none";
        return (
          <li
            className={classnames("calender__item", {
              active:
                (currDay && isSameDay(d.date, currDay.date)) ||
                currDays.some(day => isSameDay(d.date, day.date)),
            })}
            onClick={() => handleDayClick(d)}
            style={{ backgroundColor, color }}
            key={date.toISOString()}
          >
            <div className="calender__item__wrapper" style={{ border }}>
              <h3>{d.day}</h3>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
