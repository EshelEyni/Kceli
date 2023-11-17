import { FC } from "react";
import { CalenderDay } from "../../types/app";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { CalorieBar } from "../../components/Charts/CalorieBarChart/CalorieBarChart";
import { Intake } from "../../../../shared/types/intake";
import "./DayReport.scss";
import dayDataUtilService from "../../services/dayData/dayDataUtilService";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "../../components/App/Header/Header";
import { WorkoutPreview } from "./WorkoutPreview";
import { IntakePreview } from "./IntakesPreview";
import { List } from "../../components/App/List/List";

type DayReportProps = {
  day: CalenderDay;
};

export const DayReport: FC<DayReportProps> = ({ day }) => {
  const { loggedInUser } = useAuth();
  const { data, backgroundColor } = day;
  if (!data)
    return (
      <section className="report day-report empty">
        <p>No data for this day</p>
      </section>
    );

  const consumedCalories = calorieUtilService.getTotalCalories(data);
  const remainingCalories = calorieUtilService.calcRemainingCalories(loggedInUser, data);
  const calConsumedSufix = remainingCalories > 0 ? "remaining" : "over your limit";
  const calConsumedTitle = ` calories ${calConsumedSufix}`;
  const dateStr = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(day.date);
  const averageTimeBetweenMeals = dayDataUtilService.calcAverageTimeBetweenMeals(data);

  return (
    <section className="report day-report">
      <Header className="day-report__header">
        <h1>{dateStr}</h1>
        <div className="day-report__header__color-circle" style={{ backgroundColor }} />
      </Header>
      <div className="day-report__weight">
        {data.weight && (
          <p>
            <strong>Weight: </strong>
            {data.weight}
          </p>
        )}

        {data.waist && (
          <p>
            <strong>Waist: </strong>
            {data.waist}
          </p>
        )}
      </div>
      <div className="day-report__calories">
        <h3 className="day-report__calories__title">calories</h3>
        <p>
          <strong>consumed Calories: </strong>
          {consumedCalories}
        </p>
        <p>
          <strong>{calConsumedTitle}: </strong>
          {Math.abs(remainingCalories)}
        </p>
        <p>
          <strong>target caloric intake: </strong>
          {day.targetCalorie}
        </p>
      </div>
      {data.intakes.length > 0 && (
        <div className="day-report__intakes">
          <h2 className="day-report__intakes__title">Intakes</h2>
          <h4>Number of Intakes: {data.intakes.length}</h4>
          <h4>Average time between meals: {averageTimeBetweenMeals}</h4>
          <List
            className="day-report__intakes__list"
            items={data.intakes as Intake[]}
            render={intake => <IntakePreview intake={intake} key={intake.id} />}
          />

          <CalorieBar intakes={data.intakes as Intake[]} />
        </div>
      )}
      {data.workouts.length > 0 && (
        <div className="day-report__workouts">
          <h1 className="day-report__workouts__title">Workouts</h1>
          <ul>
            {data.workouts.map((workout, index) => (
              <li key={index}>
                <WorkoutPreview workout={workout} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
