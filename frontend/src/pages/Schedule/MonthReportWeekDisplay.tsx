import { FC } from "react";
import { CalenderDay, Goal } from "../../types/app";
import { Header } from "../../components/App/Header/Header";
import { DayData } from "../../../../shared/types/dayData";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { GoalDisplay } from "./GoalDisplay";
import "./MonthReportWeekDisplay.scss";
import { Empty } from "../../components/App/Empty/Empty";

type MonthReportWeekDisplayProps = {
  weekDays: CalenderDay[];
  goals: Goal[];
};

export const MonthReportWeekDisplay: FC<MonthReportWeekDisplayProps> = ({ weekDays, goals }) => {
  const weekData = weekDays.reduce((acc, curr) => {
    if (!curr.data) return acc;
    return [...acc, curr.data];
  }, [] as DayData[]);

  const title = getTitle();
  const tableData = getTableData();

  function getTitle() {
    const firstDayDate = weekDays[0].date.toLocaleString("en-GB", {
      day: "numeric",
    });
    const lastDayDate = weekDays[weekDays.length - 1].date.toLocaleString("en-GB", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
    return `${firstDayDate} - ${lastDayDate}`;
  }

  function getTableData() {
    const tableData = {
      documentedDay: {
        label: "documented days",
        value: 0,
      },
      totalCalories: {
        label: "total calories",
        value: 0,
      },
      averageCaloriesPerDay: {
        label: "average calories per day",
        value: 0,
      },
      averageIntakesPerDay: {
        label: "average intakes per day",
        value: 0,
      },
      totalWorkouts: {
        label: "total workouts",
        value: 0,
      },
      excessCalories: {
        label: "excess calories",
        value: 0,
      },
      exceededDays: {
        label: "exceeded days",
        value: 0,
      },
      excessPercentage: {
        label: "excess percentage (days)",
        value: 0,
      },
    };

    tableData.documentedDay.value = weekData.length;
    tableData.totalCalories.value = calorieUtilService.getTotalCalories(weekData);
    tableData.averageCaloriesPerDay.value = Math.round(
      tableData.totalCalories.value / tableData.documentedDay.value
    );
    tableData.averageIntakesPerDay.value = Math.round(
      weekData.reduce((acc, curr) => {
        const intakesLength = curr.intakes.filter(i => i.type === "food").length;
        return acc + intakesLength;
      }, 0) / weekData.length
    );
    tableData.totalWorkouts.value = workoutUtilService.getTotalWorkouts(weekData);
    tableData.excessCalories.value = calorieUtilService.getWeeklyExcessRateCalories(weekData);

    tableData.excessCalories.value = weekData.filter(d => {
      const targetIntake = calorieUtilService.getDayCaloriesIntake({
        currDayData: d,
        data: weekData,
      });
      const consumedCalories = calorieUtilService.getTotalCaloriesFromDailyData({
        dailyData: d,
      });
      const remainingCalories = targetIntake - consumedCalories;
      return remainingCalories < 0;
    }).length;

    tableData.excessPercentage.value = Math.round(
      (tableData.exceededDays.value / weekData.length) * 100
    );

    return Object.values(tableData);
  }

  return (
    <article className="month-report-week-display">
      <Header className="month-report-week-display__header">
        <h3 className="month-report-week-display__header__title">{title}</h3>
      </Header>

      <div className="month-report-week-display__content-container">
        <div className="month-report-week-display__table-container ">
          <table>
            <thead>
              <tr>
                <th>label</th>
                <th>value</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((d, i) => {
                const isPerc = d.label === "excess percentage (days)";
                return (
                  <tr key={i}>
                    <td>{d.label}</td>
                    <td>
                      {d.value}
                      {isPerc ? "%" : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <section className="month-report-week-display__goals-container">
          <h3>goals</h3>
          {goals.length === 0 ? (
            <Empty entityName="week goals" />
          ) : (
            <ul>
              {goals.map((g, i) => (
                <GoalDisplay key={i} goal={g} isEditEnabled={false} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
};
