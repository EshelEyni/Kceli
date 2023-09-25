import { FC, useState } from "react";
import "./ScheduleGrid.scss";
import { getDaysInMonth } from "../../../services/util/utilService";
import { useGetDays } from "../../../hooks/useGetDays";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/app";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { days as dayNames } from "../../../services/util/utilService";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { Link } from "react-router-dom";

export const ScheduleGrid: FC = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { allDays, startDate, endDate } = getGridDays();
  const { days, isLoading, isSuccess, isError } = useGetDays({ startDate, endDate });

  const daysToRender = days
    ? allDays.map(currDay => {
        const dayData = days.find(day => {
          const dayDataDate = new Date(day.date);
          return (
            dayDataDate.getDate() === currDay.getDate() &&
            dayDataDate.getMonth() === currDay.getMonth()
          );
        });

        const consumedCalories = calorieUtilService.getTotalCalories(dayData);
        const backgroundColor =
          dayData && loggedInUser
            ? calorieUtilService.getBcgByCosumedCalories({
                consumedCalories,
                targetCalorie: loggedInUser?.targetCaloricIntakePerDay,
              })
            : "";
        return {
          id: dayData?.id,
          backgroundColor,
          date: currDay.toISOString().split("T")[0],
          day: currDay.getDate(),
          consumedCalories,
        };
      })
    : [];

  function getGridDays() {
    const daysInMonth = getDaysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear());

    const currentMonthDates = Array.from({ length: daysInMonth - 1 }, (_, i) => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
    });

    const firstDay = currentMonthDates[0].getDay();
    const lastDay = currentMonthDates[currentMonthDates.length - 1].getDay();

    const prevMonthDates = Array.from({ length: firstDay }, (_, i) => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), i - firstDay + 1);
    });

    const nextMonthDates = Array.from({ length: 6 - lastDay }, (_, i) => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1);
    });

    const daysToRender = [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];

    return {
      allDays: daysToRender,
      startDate: daysToRender[0],
      endDate: daysToRender[daysToRender.length - 1],
    };
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const date = new Date(value);
    setCurrentDate(date);
  }

  return (
    <section className="schedule-grid-wrapper">
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {isSuccess && (
        <>
          <input
            type="date"
            className="schedule-grid__date-input"
            name="date"
            value={currentDate.toISOString().split("T")[0]}
            onChange={handleInputChange}
          />
          <ul className="schedule-grid">
            {daysToRender.map((currDay, i) => {
              const { id, backgroundColor, date } = currDay;
              const color = currDay.backgroundColor ? "white" : "";
              const isFirstRow = i < 7;
              return (
                <li className="schedule-grid__item" key={date} style={{ backgroundColor, color }}>
                  <Link to={`/day/${id}`} className="schedule-grid__item__link">
                    {isFirstRow && (
                      <h3 className="schedule-grid__item__title">{dayNames[i].short}</h3>
                    )}
                    <h3 className="schedule-grid__item__title">{currDay.day}</h3>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};
