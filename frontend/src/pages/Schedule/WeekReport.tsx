import { FC } from "react";
import { useSchedule } from "./ScheduleContext";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { DayData } from "../../../../shared/types/dayData";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import "./WeekReport.scss";

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
  const tableData = getTableData();

  function getPrevWeekData() {
    if (!currDays.length || !data) return;
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

  function renderTrend({ trend, positive }: { trend: number; positive: "up" | "down" }) {
    if (!trend) return;
    const size = 20;
    return trend > 0 ? (
      <FaArrowTrendUp size={size} color={positive === "up" ? "green" : "red"} />
    ) : (
      <FaArrowTrendDown size={size} color={positive === "down" ? "green" : "red"} />
    );
  }

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
      totalWorkouts: {
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

    return defaultData;
  }

  return (
    <div className="report week-report">
      {tableData && (
        <div className="table-container">
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
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
