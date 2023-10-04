import { FC } from "react";
import { CalenderDay } from "../../types/app";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { CalorieBar } from "../../components/Charts/CalorieBarChart/CalorieBarChart";
import { Intake } from "../../../../shared/types/intake";

type DayInfoProps = {
  day: CalenderDay;
};

export const DayInfo: FC<DayInfoProps> = ({ day }) => {
  const { data } = day;
  if (!data) return <p>No data for this day</p>;

  const consumedCalories = calorieUtilService.getTotalCalories(data);
  return (
    <section className="day-info">
      <h2>{`Consumed Calories: ${consumedCalories}`}</h2>
      <h3>{`Weight: ${data.weight}`}</h3>
      <h3>{`Waist: ${data.waist}`}</h3>
      <h3>{`Target Caloric Intake: ${data.targetCaloricIntake}`}</h3>
      <div>
        <h4>Workouts:</h4>
        <ul>
          {data.workouts.map((workout, index) => (
            <li key={index}>{`${workout.type} - ${workout.description}`}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Intakes:</h4>
        <ul>
          {data.intakes.map((intake, index) => (
            <li key={index}>
              {`${intake.isRecorded ? "Recorded" : "Not Recorded"} - ${intake.items
                .map(item => item.name)
                .join(", ")}`}
            </li>
          ))}
        </ul>
      </div>
      <CalorieBar intakes={data.intakes as Intake[]} />
    </section>
  );
};
