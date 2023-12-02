import { FC } from "react";
import "./MonthReport.scss";
import { useSchedule } from "./ScheduleContext";
import { DayData } from "../../../../shared/types/dayData";
import { ReportTable } from "./ReportTable";
import { Header } from "../../components/App/Header/Header";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import { Goals } from "./Goals";
import { CaloriesBar } from "./CaloriesBar";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { CalenderDay, Goal, ReportDayData } from "../../types/app";
import { MonthReportWeekDisplay } from "./MonthReportWeekDisplay";

type WeekData = {
  weekDays: CalenderDay[];
  goals: Goal[];
};

export const MonthReport: FC = () => {
  const { currDays, data, monthWeekGoals } = useSchedule();

  if (currDays.every(d => !d.data) || !data)
    return (
      <section className="report month-report">
        <p>No data for this month</p>
      </section>
    );

  const secondaryTitle = getTitle();
  const currData = currDays.map(d => d.data).filter(d => !!d) as DayData[];
  const prevData = getPrevMonthData();
  const weightWaistData = getWeightWaistData();
  const calorieData = getCalorieData();

  const weeks = currDays.reduce((acc, curr, i, arr) => {
    const dayOfWeek = new Date(curr.date).getDay();
    if (i === 0 || dayOfWeek === 0) return [...acc, { weekDays: [curr], goals: [] }];
    const lastWeek = acc[acc.length - 1];
    const data = [
      ...acc.slice(0, acc.length - 1),
      {
        ...lastWeek,
        weekDays: [...lastWeek.weekDays, curr],
        goals: [],
      },
    ];

    if ((dayOfWeek === 6 || i === arr.length - 1) && monthWeekGoals) {
      const weekData = data[data.length - 1];
      const weekGoals = monthWeekGoals.filter(g => {
        const goalDate = new Date(g.date);
        const firstDayDate = weekData.weekDays[0].date;
        firstDayDate.setHours(0, 0, 0, 0);
        const lastDayDate = weekData.weekDays[weekData.weekDays.length - 1].date;
        lastDayDate.setHours(23, 59, 59, 999);
        return goalDate >= firstDayDate && goalDate <= lastDayDate;
      });
      data[data.length - 1].goals = weekGoals;
    }
    return data;
  }, [] as WeekData[]);

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

  function getPrevMonthData() {
    if (!currDays.length || !data) return [];
    const firstCurrMonthDayDate = currDays[0].date;
    firstCurrMonthDayDate.setHours(0, 0, 0, 0);
    const prevMonth = firstCurrMonthDayDate.getMonth() - 1;
    const prevMonthYear = firstCurrMonthDayDate.getFullYear();
    const prevMonthFirstDayDate = new Date(prevMonthYear, prevMonth, 1);
    const prevMonthData = data.filter(d => {
      const dDate = new Date(d.date);
      return dDate >= prevMonthFirstDayDate && dDate < firstCurrMonthDayDate;
    });
    return prevMonthData;
  }

  function getWeightWaistData() {
    if (!currData) return null;
    const weightWaistData = currData.reduce((acc, curr) => {
      if (!curr.weight || !curr.waist) return acc;
      return [...acc, { date: curr.date, weight: curr.weight, waist: curr.waist }];
    }, [] as ReportDayData[]);
    return weightWaistData;
  }

  function getCalorieData() {
    if (!currData) return null;
    const calorieData = currData.map(d => {
      const remainingCalories = calorieUtilService.calcRemainingCaloriesFromDayData(d);
      const excessCalories = remainingCalories < 0 ? Math.abs(remainingCalories) : 0;
      const calories = calorieUtilService.getTotalCalories(d);
      const caloriesWithoutExcess = calories - excessCalories;

      const name = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit" }).format(
        new Date(d.date)
      );
      return { name, calories, excessCalories, caloriesWithoutExcess };
    });

    return calorieData;
  }

  return (
    <section className="report month-report">
      <Header className="month-report__header">
        <h1>monthly report</h1>
        <h3>{secondaryTitle}</h3>
      </Header>
      <ReportTable type="month" currData={currData} prevData={prevData} goals={monthWeekGoals} />
      <Goals type="month" />
      {weightWaistData && <WeightWaistChart data={weightWaistData} />}
      {calorieData && <CaloriesBar data={calorieData} />}
      {weeks.map((week, i) => (
        <MonthReportWeekDisplay key={i} weekDays={week.weekDays} goals={week.goals} />
      ))}
    </section>
  );
};
