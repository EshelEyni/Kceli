import { FC } from "react";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { DayData } from "../../../../shared/types/dayData";
import "./WeekReportTable.scss";

type WeekReportTableProps = {
  currWeekData: DayData[];
  prevWeekData: DayData[];
};

export const WeekReportTable: FC<WeekReportTableProps> = ({ currWeekData, prevWeekData }) => {
  const tableData = getTableData();

  function getTableData() {
    const defaultData = {
      documentedDay: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
      totalCalories: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
      averageCaloriesPerDay: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
      averageIntakesPerDay: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
      totalWorkouts: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
      excessCalories: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
      exceededDays: {
        currWeek: 0,
        prevWeek: 0,
        trend: 0,
      },
    };

    if (!currWeekData.length || !prevWeekData?.length) return;
    defaultData.documentedDay.currWeek = currWeekData.length;
    defaultData.documentedDay.prevWeek = prevWeekData.length;
    defaultData.documentedDay.trend =
      defaultData.documentedDay.currWeek - defaultData.documentedDay.prevWeek;

    defaultData.totalCalories.currWeek = calorieUtilService.getTotalCalories(currWeekData);
    defaultData.totalCalories.prevWeek = calorieUtilService.getTotalCalories(prevWeekData);
    defaultData.totalCalories.trend =
      defaultData.totalCalories.currWeek - defaultData.totalCalories.prevWeek;

    defaultData.averageCaloriesPerDay.currWeek = Math.round(
      defaultData.totalCalories.currWeek / currWeekData.length
    );
    defaultData.averageCaloriesPerDay.prevWeek = Math.round(
      defaultData.totalCalories.prevWeek / prevWeekData.length
    );

    defaultData.averageCaloriesPerDay.trend =
      defaultData.averageCaloriesPerDay.currWeek - defaultData.averageCaloriesPerDay.prevWeek;

    defaultData.totalWorkouts.currWeek = workoutUtilService.getTotalWorkouts(currWeekData);
    defaultData.totalWorkouts.prevWeek = workoutUtilService.getTotalWorkouts(prevWeekData);
    defaultData.totalWorkouts.trend =
      defaultData.totalWorkouts.currWeek - defaultData.totalWorkouts.prevWeek;

    defaultData.excessCalories.currWeek =
      calorieUtilService.getWeeklyExcessRateCalories(currWeekData);
    defaultData.excessCalories.prevWeek =
      calorieUtilService.getWeeklyExcessRateCalories(prevWeekData);
    defaultData.excessCalories.trend =
      defaultData.excessCalories.currWeek - defaultData.excessCalories.prevWeek;

    defaultData.exceededDays.currWeek = currWeekData.filter(d => {
      const targetIntake = calorieUtilService.getDayCaloriesIntake({
        currDayData: d,
        data: currWeekData,
      });
      const consumedCalories = calorieUtilService.getTotalCaloriesFromDailyData({
        dailyData: d,
      });
      const remainingCalories = targetIntake - consumedCalories;
      return remainingCalories < 0;
    }).length;

    defaultData.exceededDays.prevWeek = prevWeekData.filter(d => {
      const targetIntake = calorieUtilService.getDayCaloriesIntake({
        currDayData: d,
        data: prevWeekData,
      });
      const consumedCalories = calorieUtilService.getTotalCaloriesFromDailyData({
        dailyData: d,
      });
      const remainingCalories = targetIntake - consumedCalories;
      return remainingCalories < 0;
    }).length;

    defaultData.exceededDays.trend =
      defaultData.exceededDays.currWeek - defaultData.exceededDays.prevWeek;

    defaultData.averageIntakesPerDay.currWeek = Math.round(
      currWeekData.reduce((acc, curr) => {
        const intakesLength = curr.intakes.filter(i => i.type === "food").length;
        return acc + intakesLength;
      }, 0) / currWeekData.length
    );

    defaultData.averageIntakesPerDay.prevWeek = Math.round(
      prevWeekData.reduce((acc, curr) => {
        const intakesLength = curr.intakes.filter(i => i.type === "food").length;
        return acc + intakesLength;
      }, 0) / prevWeekData.length
    );

    return defaultData;
  }

  function renderTrend({ trend, positive }: { trend: number; positive: "up" | "down" }) {
    if (!trend) return;
    const size = 20;
    return trend > 0 ? (
      <FaArrowTrendUp size={size} color={positive === "up" ? "green" : "red"} />
    ) : (
      <FaArrowTrendDown size={size} color={positive === "down" ? "green" : "red"} />
    );
  }

  if (!tableData) return null;
  return (
    <div className="week-report-table">
      <table>
        <thead>
          <tr>
            <th>value</th>
            <th>current week</th>
            <th>previous week</th>
            <th>trend</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>documented days</td>
            <td>{tableData.documentedDay.currWeek}</td>
            <td>{tableData.documentedDay.prevWeek}</td>
            <td>{renderTrend({ trend: tableData.documentedDay.trend, positive: "up" })}</td>
          </tr>
          <tr>
            <td>total calories</td>
            <td>{tableData.totalCalories.currWeek}</td>
            <td>{tableData.totalCalories.prevWeek}</td>
            <td>{renderTrend({ trend: tableData.totalCalories.trend, positive: "down" })}</td>
          </tr>
          <tr>
            <td>average calories per day</td>
            <td>{tableData.averageCaloriesPerDay.currWeek}</td>
            <td>{tableData.averageCaloriesPerDay.prevWeek}</td>
            <td>
              {renderTrend({
                trend: tableData.averageCaloriesPerDay.trend,
                positive: "down",
              })}
            </td>
          </tr>
          <tr>
            <td>total workouts</td>
            <td>{tableData.totalWorkouts.currWeek}</td>
            <td>{tableData.totalWorkouts.prevWeek}</td>
            <td>{renderTrend({ trend: tableData.totalWorkouts.trend, positive: "up" })}</td>
          </tr>
          <tr>
            <td>excess calories</td>
            <td>{tableData.excessCalories.currWeek}</td>
            <td>{tableData.excessCalories.prevWeek}</td>
            <td>{renderTrend({ trend: tableData.excessCalories.trend, positive: "down" })}</td>
          </tr>

          <tr>
            <td>exceeded days</td>
            <td>{tableData.exceededDays.currWeek}</td>
            <td>{tableData.exceededDays.prevWeek}</td>
            <td>{renderTrend({ trend: tableData.exceededDays.trend, positive: "down" })}</td>
          </tr>

          <tr>
            <td>average intakes per day</td>
            <td>{tableData.averageIntakesPerDay.currWeek}</td>
            <td>{tableData.averageIntakesPerDay.prevWeek}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
