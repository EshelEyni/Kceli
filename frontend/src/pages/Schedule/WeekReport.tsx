import { FC } from "react";
import { useSchedule } from "./ScheduleContext";
import { DayData } from "../../../../shared/types/dayData";
import { ReportTable } from "./ReportTable";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { WeekReportDayDisplay } from "./WeekReportDayDisplay";
import "./WeekReport.scss";
import { WeekCaloriesBar } from "./WeekCaloriesBar";
import { Goals } from "./Goals";
import { Header } from "../../components/App/Header/Header";

export const WeekReport: FC = () => {
  const { currDays, data } = useSchedule();

  if (currDays.every(d => !d.data) || !data)
    return (
      <section className="report week-report">
        <p>No data for this week</p>
      </section>
    );

  const secondaryTitle = getTitle();
  const currWeekData = currDays.map(d => d.data).filter(d => !!d) as DayData[];
  const prevWeekData = getPrevWeekData();
  const weightWaistData = getWeightWaistData();
  const calorieData = getCalorieData();

  function getTitle() {
    const firstDayDate = currDays[0].date.toLocaleString("en-GB", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
    const lastDayDate = currDays[currDays.length - 1].date.toLocaleString("en-GB", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
    return `${firstDayDate} - ${lastDayDate}`;
  }

  function getWeightWaistData() {
    if (!currWeekData) return null;
    const weightWaistData = currWeekData.map(d => ({
      date: d.date,
      weight: d.weight,
      waist: d.waist,
    }));

    return weightWaistData;
  }

  function getCalorieData() {
    if (!currWeekData) return null;
    const calorieData = currWeekData.map(d => {
      const remainingCalories = calorieUtilService.calcRemainingCaloriesFromDayData(d);
      const excessCalories = remainingCalories < 0 ? Math.abs(remainingCalories) : 0;
      const calories = calorieUtilService.getTotalCalories(d);
      const caloriesWithoutExcess = calories - excessCalories;

      const name = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(d.date));
      return { name, calories, excessCalories, caloriesWithoutExcess };
    });

    return calorieData;
  }

  function getPrevWeekData() {
    if (!currDays.length || !data) return [];
    const firstCurrWeekDayDate = currDays[0].date;
    firstCurrWeekDayDate.setHours(0, 0, 0, 0);
    const firstPrevWeekDayDate = new Date(firstCurrWeekDayDate);
    firstPrevWeekDayDate.setDate(firstPrevWeekDayDate.getDate() - 7);
    firstPrevWeekDayDate.setHours(0, 0, 0, 0);
    const prevWeekData = data.filter(d => {
      const dDate = new Date(d.date);
      return dDate >= firstPrevWeekDayDate && dDate < firstCurrWeekDayDate;
    });

    return prevWeekData;
  }

  return (
    <section className="report week-report">
      <Header className="week-report__header">
        <h1>weekly report</h1>
        <h3>{secondaryTitle}</h3>
      </Header>
      <ReportTable type="week" currData={currWeekData} prevData={prevWeekData} />
      <Goals type="week" />
      {weightWaistData && <WeightWaistChart data={weightWaistData} />}
      {calorieData && <WeekCaloriesBar data={calorieData} />}
      <div className="week-report-day-display-container">
        {currDays.map((d, i) => (
          <WeekReportDayDisplay key={d.id || i} calenderDay={d} />
        ))}
      </div>
    </section>
  );
};
