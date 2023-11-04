import { FC } from "react";
import { Workout } from "../../../../../shared/types/workout";
import { Button } from "../../App/Button/Button";
import "./WorkoutPreview.scss";
import workoutUtilService from "../../../services/workout/workoutUtilService";
import { useNavigate } from "react-router-dom";
import { useDeleteWorkout } from "../../../hooks/useDeleteWorkout";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";

type WorkoutPreviewProps = {
  workout: Workout;
  isDayEdit?: boolean;
};

export const WorkoutPreview: FC<WorkoutPreviewProps> = ({ workout, isDayEdit = false }) => {
  const { removeWorkout } = useDeleteWorkout();
  const { dailyData } = useGetTodayData();
  const { updateDailyData } = useUpdateTodayData();
  const navigate = useNavigate();
  const duration =
    workoutUtilService.calcWorkoutDuration({ workout: workout as Workout }) ||
    workout?.durationInMin ||
    0;

  function handleBtnEditClick(workoutId: string) {
    navigate(`/workouts/edit/${workoutId}`);
  }

  function handleBtnDeleteClick(workoutId: string) {
    if (!isDayEdit) return removeWorkout(workoutId);
    if (!dailyData) return;
    const updatedDailyData = { ...dailyData };
    const updatedWorkouts = updatedDailyData.workouts.filter(w => w.id !== workoutId);
    updatedDailyData.workouts = updatedWorkouts;
    updateDailyData(updatedDailyData);
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
        {!isDayEdit && (
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
