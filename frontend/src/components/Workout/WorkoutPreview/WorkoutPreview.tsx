import { FC } from "react";
import { Workout } from "../../../../../shared/types/workout";
import { Button } from "../../App/Button/Button";
import "./WorkoutPreview.scss";
import workoutUtilService from "../../../services/workout/workoutUtilService";
import { useNavigate } from "react-router-dom";
import { useDeleteWorkout } from "../../../hooks/useDeleteWorkout";

type WorkoutPreviewProps = {
  workout: Workout;
  isDayEdit?: boolean;
};

export const WorkoutPreview: FC<WorkoutPreviewProps> = ({ workout, isDayEdit = false }) => {
  const { removeWorkout } = useDeleteWorkout();
  const navigate = useNavigate();
  const duration = workoutUtilService.calcDuration({ workout: workout as Workout });

  function handleBtnEditClick(workoutId: string) {
    navigate(`/workouts/edit/${workoutId}`);
  }

  function handleBtnDeleteClick(workoutId: string) {
    removeWorkout(workoutId);
  }

  function handleBtnOpenClick(workoutId: string) {
    navigate(`/workouts/details/${workoutId}`);
  }

  return (
    <article className="workout-preview" data-testid="workout-preview">
      <section className="workout-preview__info">
        <h3>description: {workout.description}</h3>
        <h3>duration (in min): {duration}</h3>
        <h3>type: {workout.type}</h3>
        {"split" in workout && <h3>split: {workout.split}</h3>}
      </section>

      <div className="workout-preview__btns">
        {!isDayEdit && (
          <>
            <Button
              className="btn workout-page__btn"
              onClickFn={() => handleBtnDeleteClick(workout.id)}
            >
              delete
            </Button>
            <Button
              className="btn workout-page__btn"
              onClickFn={() => handleBtnEditClick(workout.id)}
            >
              edit
            </Button>
          </>
        )}
        <Button className="btn workout-page__btn" onClickFn={() => handleBtnOpenClick(workout.id)}>
          open
        </Button>
      </div>
    </article>
  );
};
