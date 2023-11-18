import { FC } from "react";
import { useSchedule } from "./ScheduleContext";
import { DayData } from "../../../../shared/types/dayData";
import { WeekReportTable } from "./WeekReportTable";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { WeekReportDayDisplay } from "./WeekReportDayDisplay";
import "./WeekReport.scss";
import { WeekCaloriesBar } from "./WeekCaloriesBar";

export const WeekReport: FC = () => {
  const { currDays, data } = useSchedule();

  if (!currDays.length || !data)
    return (
      <section className="report week-report">
        <p>No data for this week</p>
      </section>
    );

  const currWeekData = currDays.map(d => d.data).filter(d => !!d) as DayData[];
  const prevWeekData = getPrevWeekData();
  const weightWaistData = getWeightWaistData();
  const calorieData = getCalorieData();

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
    const firstCurrWeekDay = currDays[0];
    const firstPrevWeekDayDate = new Date(firstCurrWeekDay.date);
    firstPrevWeekDayDate.setDate(firstPrevWeekDayDate.getDate() - 7);
    firstPrevWeekDayDate.setHours(0, 0, 0, 0);
    const prevWeekData = data.filter(d => {
      const dDate = new Date(d.date);
      return dDate >= firstPrevWeekDayDate && dDate < firstCurrWeekDay.date;
    });

    return prevWeekData;
  }

  return (
    <div className="report week-report">
      <div className="week-report-day-display-container">
        {currDays.map(d => (
          <WeekReportDayDisplay key={d.id} calenderDay={d} />
        ))}
      </div>
      {weightWaistData && <WeightWaistChart data={weightWaistData} />}
      {calorieData && <WeekCaloriesBar data={calorieData} />}
      <WeekReportTable currWeekData={currWeekData} prevWeekData={prevWeekData} />
    </div>
  );
};
