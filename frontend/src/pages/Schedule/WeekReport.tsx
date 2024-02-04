import { FC } from "react";
import { useSchedule } from "./ScheduleContext";
import { DayData } from "../../../../shared/types/dayData";
import { ReportTable } from "./ReportTable";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { WeekReportDayDisplay } from "./WeekReportDayDisplay";
import "./WeekReport.scss";
import { CaloriesBar } from "./CaloriesBar";
import { Goals } from "./Goals";
import { Header } from "../../components/App/Header/Header";
import { ReportDayData } from "../../types/app";
import { Empty } from "../../components/App/Empty/Empty";

export const WeekReport: FC = () => {
  const { currDays, data, currDay } = useSchedule();
  const secondaryTitle = getTitle();
  const currWeekData = currDays.reduce((acc, curr) => {
    if (!curr.data) return acc;
    return [...acc, curr.data];
  }, [] as DayData[]);

  const prevWeekData = getPrevWeekData();
  const weightWaistData = getWeightWaistData();
  const calorieData = getCalorieData();
  const isWeeklyDataEmpty = currDays.every(d => !d.data) || !data;

  function getTitle() {
    if (currDays.length === 0) return "";
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
    if (!currWeekData.length) return null;
    const weightWaistData = currWeekData.reduce((acc, curr) => {
      if (!curr.weight || !curr.waist) return acc;
      return [...acc, { weight: curr.weight, waist: curr.waist, date: curr.date }];
    }, [] as ReportDayData[]);
    return weightWaistData;
  }

  function getCalorieData() {
    if (!currWeekData.length) return null;
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
      <Goals type="week" currDate={currDay?.date} />
      {weightWaistData && <WeightWaistChart data={weightWaistData} />}
      {calorieData && <CaloriesBar data={calorieData} />}
      {isWeeklyDataEmpty ? (
        <Empty entityName="data for this week" />
      ) : (
        <div className="week-report-day-display-container">
          {currDays.map((d, i) => (
            <WeekReportDayDisplay key={d.id || i} calenderDay={d} />
          ))}
        </div>
      )}
    </section>
  );
};
