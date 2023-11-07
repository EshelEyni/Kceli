import { FC } from "react";
import { WorkoutDayPreview } from "./WorkoutDayPreview";
import { useWorkouts } from "../WorkoutsContext";
import "./WorkoutSchedule.scss";

export const WorkoutSchedule: FC = () => {
  const { workoutSchedule } = useWorkouts();

  if (!workoutSchedule) return null;
  return (
    <ul className="workout-schedule" data-testid="workout-schedule">
      {workoutSchedule.map(day => (
        <li key={day.name}>
          <WorkoutDayPreview workoutDay={day} />
        </li>
      ))}
    </ul>
  );
};
