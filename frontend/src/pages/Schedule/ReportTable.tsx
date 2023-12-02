import { FC } from "react";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { DayData } from "../../../../shared/types/dayData";
import "./ReportTable.scss";
import { Goal } from "../../types/app";

type ReportTableProps = {
  type: "week" | "month";
  currData: DayData[];
  prevData: DayData[];
  goals?: Goal[];
};

type TableData = {
  [key: string]: {
    label: string;
    curr: number;
    prev: number;
    trend: {
      value: number;
      positive: "up" | "down";
    };
  };
};

export const ReportTable: FC<ReportTableProps> = ({ type, currData, prevData, goals }) => {
  const tableData = getTableData();

  function getTableData() {
    if (!currData.length || !prevData?.length) return;

    const tableData: TableData = {
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
      excessPercentage: {
        label: "excess percentage (days)",
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

    tableData.excessPercentage.curr = Math.round(
      (tableData.exceededDays.curr / currData.length) * 100
    );

    tableData.excessPercentage.prev = Math.round(
      (tableData.exceededDays.prev / prevData.length) * 100
    );

    tableData.excessPercentage.trend.value =
      tableData.excessPercentage.curr - tableData.excessPercentage.prev;

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

    if (type === "week") return Object.values(tableData);

    function calcWeightLossPerDay(data: DayData[]) {
      if (!data.length) return 0;
      const firstDayWeight = data.find(d => !!d.weight)?.weight || 0;
      const lastDayWeight = data.findLast(d => !!d.weight)?.weight || 0;
      const weightLoss = firstDayWeight - lastDayWeight;
      const weightLossPerDay = weightLoss / data.length;
      if (isNaN(weightLossPerDay)) return 0;
      return weightLossPerDay >= 0 ? +weightLossPerDay.toFixed(2) : 0;
    }

    tableData.weightLossPerDay = {
      label: "weight loss per day",
      curr: 0,
      prev: 0,
      trend: {
        value: 0,
        positive: "up",
      },
    };

    tableData.weightLossPerDay.curr = calcWeightLossPerDay(currData);
    tableData.weightLossPerDay.prev = calcWeightLossPerDay(prevData);
    tableData.weightLossPerDay.trend.value =
      tableData.weightLossPerDay.curr - tableData.weightLossPerDay.prev;

    function calculateAverageWeight(data: DayData[]) {
      let totalWeight = 0;
      let count = 0;

      data.forEach(item => {
        if (item.weight) {
          totalWeight += item.weight;
          count++;
        }
      });

      return count > 0 ? Math.round(totalWeight / count) : 0;
    }

    tableData.averageWeight = {
      label: "average weight",
      curr: 0,
      prev: 0,
      trend: {
        value: 0,
        positive: "down",
      },
    };

    tableData.averageWeight.curr = calculateAverageWeight(currData);
    tableData.averageWeight.prev = calculateAverageWeight(prevData);

    tableData.averageWeight.trend.value =
      tableData.averageWeight.curr - tableData.averageWeight.prev;

    if (!goals || !goals.length) return Object.values(tableData);
    const prevMonth = new Date(prevData[0].date).getMonth();
    const currMonth = new Date(currData[0].date).getMonth();
    const prevGoals = goals.filter(g => new Date(g.date).getMonth() === prevMonth);
    const currGoals = goals.filter(g => new Date(g.date).getMonth() === currMonth);
    tableData.totalGoals = {
      label: "total goals",
      curr: 0,
      prev: 0,
      trend: {
        value: 0,
        positive: "up",
      },
    };

    tableData.totalGoals.curr = currGoals.length;
    tableData.totalGoals.prev = prevGoals.length;

    tableData.completedGoalsPerc = {
      label: "completed goals percentage",
      curr: 0,
      prev: 0,
      trend: {
        value: 0,
        positive: "up",
      },
    };

    tableData.completedGoalsPerc.curr = currGoals.length
      ? Math.round((currGoals.filter(g => g.isCompleted).length / currGoals.length) * 100)
      : 0;

    tableData.completedGoalsPerc.prev = prevGoals.length
      ? Math.round((prevGoals.filter(g => g.isCompleted).length / prevGoals.length) * 100)
      : 0;

    tableData.completedGoalsPerc.trend.value =
      tableData.completedGoalsPerc.curr - tableData.completedGoalsPerc.prev;

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
          {tableData.map((d, i) => {
            const isPerc =
              d.label === "excess percentage (days)" || d.label === "completed goals percentage";
            return (
              <tr key={i}>
                <td>{d.label}</td>
                <td>
                  {d.prev}
                  {isPerc ? "%" : ""}
                </td>
                <td>
                  {d.curr}
                  {isPerc ? "%" : ""}
                </td>
                <td>{renderTrend({ trend: d.trend.value, positive: d.trend.positive })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
