import { FC } from "react";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { Workout } from "../../../../shared/types/workout";
import { Button } from "../../components/App/Button/Button";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import "./WorkoutPage.scss";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { WorkoutPreview } from "../../components/Workout/WorkoutPreview/WorkoutPreview";
import { useWorkouts } from "../../contexts/WorkoutsContex";

const WorkoutPage: FC = () => {
  const {
    workouts,
    isLoading,
    isSuccess,
    isError,
    isEmpty,
    createWorkout,
    isLoadingCreateWorkout,
  } = useWorkouts();

  function handleCreateWorkoutBtn() {
    createWorkout(workoutUtilService.getDefaultWorkout());
  }

  return (
    <main className="workout-page">
      {isLoadingCreateWorkout && <SpinnerLoader />}
      {!isLoadingCreateWorkout && (
        <>
          <Button className="btn workout-page__btn" onClickFn={handleCreateWorkoutBtn}>
            add new workout
          </Button>
          <AsyncList
            items={workouts as Workout[]}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            isEmpty={isEmpty}
            className="workout-page__list"
            entityName="workouts"
            render={(workout: Workout) => <WorkoutPreview key={workout.id} workout={workout} />}
          />
        </>
      )}
    </main>
  );
};

export default WorkoutPage;
