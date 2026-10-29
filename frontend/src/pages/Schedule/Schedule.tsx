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
import { PageIntro } from "../../components/App/PageIntro/PageIntro";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiActivity, FiFeather } from "react-icons/fi";

const SchedulePage: FC = () => {
  const { loggedInUser } = useAuth();
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
      <PageIntro
        eyebrow="Make room for yourself"
        title="A little planning. A lot of progress."
        description="Your workouts, daily logs and goals, in one place."
        action={
          <Link to="/workouts" className="ui-button">
            Plan your workouts ↗
          </Link>
        }
      />
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {isSuccess && (
        <div className="ui-schedule-grid">
          <div className="ui-stack">
            <section className="ui-card ui-calendar-card" aria-label="Calendar">
              <Header className="schedule-page__header">
                <h2 className="schedule-page__header__title">
                  {currDate.toLocaleString("en-GB", { month: "long" })} {currDate.getFullYear()}
                </h2>
                <div className="schedule-page__header__btns-container">
                  <Button onClickFn={() => moveToMonth(-1)} aria-label="Previous month">
                    <IoChevronBackCircleSharp className="schedule-page__header__btns-container__btn__icon" />
                  </Button>
                  <Button onClickFn={() => moveToMonth(1)} aria-label="Next month">
                    <IoChevronForwardCircleSharp className="schedule-page__header__btns-container__btn__icon" />
                  </Button>
                </div>
              </Header>

              <Calender />
              <div className="ui-calendar-legend">
                <span>
                  <i /> Daily log
                </span>
                <span>Dark green · selected dates</span>
                <span>Outline · completed workout</span>
              </div>
            </section>
            <section className="ui-card ui-reports" aria-label="Daily, weekly and monthly reports">
              <div className="ui-card-heading">
                <h2>Your report</h2>
                <ScheduleFilter />
              </div>
              {isDayReportShown && <DayReport day={currDay as CalenderDay} />}
              {isDaysReportShown && <DaysReport days={currDays} />}
              {filterBy === ScheduleGridFilter.Week && <WeekReport />}
              {filterBy === ScheduleGridFilter.Month && <MonthReport />}
            </section>
          </div>
          <aside className="ui-stack">
            <section className="ui-card">
              <div className="ui-card-heading">
                <h2>
                  {(currDay?.date || currDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h2>
                <FiActivity />
              </div>
              <p className="ui-eyebrow">Your recurring plan</p>
              {(
                loggedInUser?.workoutSchedule.find(
                  day => day.value === (currDay?.date || currDate).getDay()
                )?.workouts || []
              ).map(workout => (
                <div className="ui-agenda-item" key={workout.id}>
                  <h3>{workout.description || "Your routine"}</h3>
                  <p>
                    {workout.type === "aerobic" ? "Cardio" : "Strength"} · {workout.items.length}{" "}
                    exercises
                  </p>
                  <Link className="ui-text-link" to={`/workouts/details/${workout.id}`}>
                    View workout ↗
                  </Link>
                </div>
              ))}
              {!loggedInUser?.workoutSchedule.find(
                day => day.value === (currDay?.date || currDate).getDay()
              )?.workouts.length && (
                <p className="ui-empty">No routines planned. A little breathing room.</p>
              )}
              <Link to="/workouts" className="ui-button ui-button-secondary">
                Edit weekly plan ↗
              </Link>
            </section>
            <section className="ui-card ui-intention">
              <FiFeather />
              <h2>See the bigger picture.</h2>
              <p>
                Switch between daily details, weekly patterns and monthly progress. Your goals are
                right alongside your reports.
              </p>
              <Link
                to={loggedInUser ? `/profile/${loggedInUser.id}` : "/login"}
                className="ui-text-link"
              >
                View your progress ↗
              </Link>
            </section>
          </aside>
        </div>
      )}
    </main>
  );
};

export default SchedulePage;
