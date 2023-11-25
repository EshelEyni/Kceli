import { FC } from "react";
import { Workout } from "../../../../../shared/types/workout";
import { Button } from "../../App/Button/Button";
import "./WorkoutPreview.scss";
import workoutUtilService from "../../../services/workout/workoutUtilService";
import { useNavigate } from "react-router-dom";
import { useDeleteWorkout } from "../../../hooks/useDeleteWorkout";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { DayData } from "../../../../../shared/types/dayData";

type WorkoutPreviewProps = {
  workout: Workout;
  updateDailyData?: UseMutateFunction<
    DayData,
    unknown,
    { id: string; data: Partial<DayData> },
    unknown
  >;
};

export const WorkoutPreview: FC<WorkoutPreviewProps> = ({ workout, updateDailyData }) => {
  const { removeWorkout } = useDeleteWorkout();
  const { dailyData } = useGetTodayData();
  const navigate = useNavigate();
  const duration =
    workoutUtilService.calcWorkoutDuration({ workout: workout as Workout }) ||
    workout?.durationInMin ||
    0;

  function handleBtnEditClick(workoutId: string) {
    navigate(`/workouts/edit/${workoutId}`);
  }

  function handleBtnDeleteClick(workoutId: string) {
    if (!updateDailyData) return removeWorkout(workoutId);
    if (!dailyData) return;
    const updatedDailyData = { ...dailyData };
    const workouts = updatedDailyData.workouts.filter(w => w.id !== workoutId);
    updateDailyData({ id: updatedDailyData.id, data: { workouts } });
  }

  function handleBtnOpenClick(workoutId: string) {
    navigate(`/workouts/details/${workoutId}`);
  }

  return (
    <article className="workout-preview" data-testid="workout-preview">
      <section className="workout-preview__info">
        <h3>description: {workout.description}</h3>
        {duration > 0 && <h3>duration (in min): {duration}</h3>}
        <h3>type: {workout.type}</h3>
        {"split" in workout && <h3>split: {workout.split}</h3>}
      </section>

      <div className="workout-preview__btns">
        <Button
          className="btn workout-page__btn"
          onClickFn={() => handleBtnDeleteClick(workout.id)}
        >
          delete
        </Button>
        {!updateDailyData && (
          <Button
            className="btn workout-page__btn"
            onClickFn={() => handleBtnEditClick(workout.id)}
          >
            edit
          </Button>
        )}
        <Button className="btn workout-page__btn" onClickFn={() => handleBtnOpenClick(workout.id)}>
          open
        </Button>
      </div>
    </article>
  );
};
