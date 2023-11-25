import { FC } from "react";
import "./MonthReport.scss";
import { useSchedule } from "./ScheduleContext";
import { DayData } from "../../../../shared/types/dayData";
import { ReportTable } from "./ReportTable";
import { Header } from "../../components/App/Header/Header";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import { Goals } from "./Goals";

export const MonthReport: FC = () => {
  const { currDays, data } = useSchedule();

  if (currDays.every(d => !d.data) || !data)
    return (
      <section className="report month-report">
        <p>No data for this week</p>
      </section>
    );

  const secondaryTitle = getTitle();
  const currData = currDays.map(d => d.data).filter(d => !!d) as DayData[];
  const prevData = getPrevMonthData();
  const weightWaistData = getWeightWaistData();

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
    const weightWaistData = currData.map(d => ({
      date: d.date,
      weight: d.weight,
      waist: d.waist,
    }));

    return weightWaistData;
  }

  return (
    <section className="report month-report">
      <Header className="month-report__header">
        <h1>weekly report</h1>
        <h3>{secondaryTitle}</h3>
      </Header>
      <ReportTable type="month" currData={currData} prevData={prevData} />
      <Goals type="month" />
      {weightWaistData && <WeightWaistChart data={weightWaistData} />}
    </section>
  );
};
