import { getLocale } from "../../i18n";
import { t } from "../../i18n";
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
    setQueryParams,
  } = useSchedule();
  const [isShiftClicked, setIsShiftClicked] = useState<boolean>(false);

  const gridRef = useRef<HTMLUListElement>(null);
  const startX = useRef(0);

  function handleDayClick(day: CalenderDay) {
    switch (filterBy) {
      case ScheduleGridFilter.Day: {
        if (!isShiftClicked) {
          setCurrDay(day);
          setQueryParams({ key: "date", value: day.date });
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
        setQueryParams({ key: "date", value: day.date });
        break;
      }
      case ScheduleGridFilter.Week: {
        const weekDays = getWeekDays(day);
        if (!weekDays) return;
        setCurrDays(weekDays);
        setCurrDay(day);
        setQueryParams({ key: "date", value: day.date });
        break;
      }
      case ScheduleGridFilter.Month: {
        const monthDays = getMonthDays(day);
        if (!monthDays) return;
        setCurrDays(monthDays);
        setCurrDay(day);
        setQueryParams({ key: "date", value: day.date });
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
          <h3 className="calender__item__title">{t(day.short)}</h3>
        </li>
      ))}
      {calenderDays.map(d => {
        const { date } = d;
        const selected = !!(
          (currDay && isSameDay(d.date, currDay.date)) ||
          currDays.some(day => isSameDay(d.date, day.date))
        );
        return (
          <li
            className={classnames("calender__item", {
              active: selected,
              "has-log": !!d.data,
              "has-goal": d.isBorder,
              "outside-month": d.date.getMonth() !== currDate.getMonth(),
            })}
            key={date.toISOString()}
          >
            <button
              className="calender__item__wrapper"
              onClick={() => handleDayClick(d)}
              aria-pressed={selected}
              aria-label={`${date.toLocaleDateString(getLocale(), { dateStyle: "full" })}${
                d.data ? t(", daily log") : ""
              }${d.isBorder ? t(", completed workout") : ""}`}
            >
              <span>{d.day}</span>
              {d.data && <i className="ui-calendar-dot" aria-hidden="true" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
