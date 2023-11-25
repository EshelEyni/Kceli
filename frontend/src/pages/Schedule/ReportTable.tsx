import { FC } from "react";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { DayData } from "../../../../shared/types/dayData";
import "./ReportTable.scss";

type ReportTableProps = {
  type: "week" | "month";
  currData: DayData[];
  prevData: DayData[];
};

export const ReportTable: FC<ReportTableProps> = ({ type, currData, prevData }) => {
  const tableData = getTableData();

  function getTableData() {
    if (!currData.length || !prevData?.length) return;

    const tableData: {
      [key: string]: {
        label: string;
        curr: number;
        prev: number;
        trend: {
          value: number;
          positive: "up" | "down";
        };
      };
    } = {
      documentedDay: {
        label: "documented days",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "up",
        },
      },
      totalCalories: {
        label: "total calories",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "down",
        },
      },
      averageCaloriesPerDay: {
        label: "average calories per day",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "down",
        },
      },
      averageIntakesPerDay: {
        label: "average intakes per day",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "down",
        },
      },
      totalWorkouts: {
        label: "total workouts",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "up",
        },
      },
      excessCalories: {
        label: "excess calories",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "down",
        },
      },
      exceededDays: {
        label: "exceeded days",
        curr: 0,
        prev: 0,
        trend: {
          value: 0,
          positive: "down",
        },
      },
    };

    tableData.documentedDay.curr = currData.length;
    tableData.documentedDay.prev = prevData.length;
    tableData.documentedDay.trend.value =
      tableData.documentedDay.curr - tableData.documentedDay.prev;

    tableData.totalCalories.curr = calorieUtilService.getTotalCalories(currData);
    tableData.totalCalories.prev = calorieUtilService.getTotalCalories(prevData);
    tableData.totalCalories.trend.value =
      tableData.totalCalories.curr - tableData.totalCalories.prev;

    tableData.averageCaloriesPerDay.curr = Math.round(
      tableData.totalCalories.curr / currData.length
    );
    tableData.averageCaloriesPerDay.prev = Math.round(
      tableData.totalCalories.prev / prevData.length
    );

    tableData.averageCaloriesPerDay.trend.value =
      tableData.averageCaloriesPerDay.curr - tableData.averageCaloriesPerDay.prev;

    tableData.totalWorkouts.curr = workoutUtilService.getTotalWorkouts(currData);
    tableData.totalWorkouts.prev = workoutUtilService.getTotalWorkouts(prevData);
    tableData.totalWorkouts.trend.value =
      tableData.totalWorkouts.curr - tableData.totalWorkouts.prev;

    tableData.excessCalories.curr = calorieUtilService.getWeeklyExcessRateCalories(currData);
    tableData.excessCalories.prev = calorieUtilService.getWeeklyExcessRateCalories(prevData);
    tableData.excessCalories.trend.value =
      tableData.excessCalories.curr - tableData.excessCalories.prev;

    tableData.exceededDays.curr = currData.filter(d => {
      const targetIntake = calorieUtilService.getDayCaloriesIntake({
        currDayData: d,
        data: currData,
      });
      const consumedCalories = calorieUtilService.getTotalCaloriesFromDailyData({
        dailyData: d,
      });
      const remainingCalories = targetIntake - consumedCalories;
      return remainingCalories < 0;
    }).length;

    tableData.exceededDays.prev = prevData.filter(d => {
      const targetIntake = calorieUtilService.getDayCaloriesIntake({
        currDayData: d,
        data: prevData,
      });
      const consumedCalories = calorieUtilService.getTotalCaloriesFromDailyData({
        dailyData: d,
      });
      const remainingCalories = targetIntake - consumedCalories;
      return remainingCalories < 0;
    }).length;

    tableData.exceededDays.trend.value = tableData.exceededDays.curr - tableData.exceededDays.prev;

    tableData.averageIntakesPerDay.curr = Math.round(
      currData.reduce((acc, curr) => {
        const intakesLength = curr.intakes.filter(i => i.type === "food").length;
        return acc + intakesLength;
      }, 0) / currData.length
    );

    tableData.averageIntakesPerDay.prev = Math.round(
      prevData.reduce((acc, curr) => {
        const intakesLength = curr.intakes.filter(i => i.type === "food").length;
        return acc + intakesLength;
      }, 0) / prevData.length
    );

    return Object.values(tableData);
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
    <div className="schedule-report-table">
      <table>
        <thead>
          <tr>
            <th>value</th>
            <th>previous {type}</th>
            <th>current {type}</th>
            <th>trend</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((d, i) => (
            <tr key={i}>
              <td>{d.label}</td>
              <td>{d.prev}</td>
              <td>{d.curr}</td>
              <td>{renderTrend({ trend: d.trend.value, positive: d.trend.positive })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
