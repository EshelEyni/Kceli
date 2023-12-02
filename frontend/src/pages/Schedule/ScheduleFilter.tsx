import { FC } from "react";
import { ScheduleGridFilter } from "../../types/app";
import { Button } from "../../components/App/Button/Button";
import classnames from "classnames";
import "./ScheduleFilter.scss";
import { useSchedule } from "./ScheduleContext";

export const ScheduleFilter: FC = () => {
  const {
    isSuccess,
    filterBy,
    setFilterBy,
    currDay,
    setCurrDays,
    getWeekDays,
    getMonthDays,
    setQueryParams,
  } = useSchedule();

  function onSetFilter(filterBy: ScheduleGridFilter) {
    if (!isSuccess) return;
    switch (filterBy) {
      case ScheduleGridFilter.Day:
        setCurrDays([]);
        break;
      case ScheduleGridFilter.Week: {
        if (!currDay) return;
        const weekDays = getWeekDays(currDay);
        if (!weekDays) return;
        setCurrDays(weekDays);
        break;
      }
      case ScheduleGridFilter.Month: {
        if (!currDay) return;
        const monthDays = getMonthDays(currDay);
        if (!monthDays) return;
        setCurrDays(monthDays);
        break;
      }
      default:
        break;
    }
    setFilterBy(filterBy);
    setQueryParams({ key: "filterBy", value: filterBy });
  }

  return (
    <section className="schedule-filter">
      {Object.values(ScheduleGridFilter).map(filter => (
        <Button
          key={filter}
          onClickFn={() => onSetFilter(filter)}
          className={classnames("schedule-filter__btn", {
            active: filterBy === filter,
          })}
        >
          <span>{filter}</span>
        </Button>
      ))}
    </section>
  );
};
