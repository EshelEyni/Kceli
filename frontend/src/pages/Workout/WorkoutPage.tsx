import { FC } from "react";
import { Button } from "../../components/App/Button/Button";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import "./WorkoutPage.scss";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { useWorkouts } from "./WorkoutsContext";
import { WorkoutSchedule } from "./WorkoutSchedule/WorkoutSchedule";
import { WorkoutList } from "./WorkoutList/WorkoutList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { updateLoggedInUser } from "../../store/slices/authSlice";
import { AppDispatch, Goal } from "../../types/app";
import { useDispatch } from "react-redux";
import { GoalEdit } from "../../components/GoalEdit/GoalEdit";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { GoalDisplay } from "../Schedule/GoalDisplay";
import { usePageLoaded } from "../../hooks/usePageLoaded";

const WorkoutPage: FC = () => {
  usePageLoaded({ title: "Workouts / Kceli" });
  const {
    createWorkout,
    isLoadingCreateWorkout,
    loggedInUser,
    workouts,
    setWorkoutSchedule,
    goals,
    isLoadingGoals,
    isSuccessGoals,
    isErrorGoals,
    isEmptyGoals,
  } = useWorkouts();
  const dispatch: AppDispatch = useDispatch();

  function handleCreateWorkoutBtn() {
    createWorkout(workoutUtilService.getDefaultWorkout());
  }

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;
    const { source } = result;

    switch (source.droppableId) {
      case "workout-list":
        updateFromWorkoutListToWorkoutSchedule(result);
        break;
      case "sun":
      case "mon":
      case "tue":
      case "wed":
      case "thu":
      case "fri":
      case "sat":
        updateFromWorkoutScheduleToWorkoutSchedule(result);
        break;
      default:
        break;
    }
  }

  function updateFromWorkoutListToWorkoutSchedule(result: DropResult) {
    if (!result.destination || !loggedInUser || !workouts) return;
    const { source, destination } = result;
    const { workoutSchedule } = loggedInUser;
    const UpdatedWorkoutSchedule = workoutSchedule.map(workoutDay => {
      if (workoutDay.name !== destination.droppableId) return workoutDay;
      const workoutToAdd = { ...workouts[source.index] };
      const newWorkouts = [...workoutDay.workouts, workoutToAdd];
      return { ...workoutDay, workouts: newWorkouts };
    });
    setWorkoutSchedule(UpdatedWorkoutSchedule);
    dispatch(updateLoggedInUser({ ...loggedInUser, workoutSchedule: UpdatedWorkoutSchedule }));
  }

  function updateFromWorkoutScheduleToWorkoutSchedule(result: DropResult) {
    if (!result.destination || !loggedInUser || !workouts) return;
    const { source, destination } = result;
    const { workoutSchedule } = loggedInUser;
    const UpdatedWorkoutSchedule = workoutSchedule.map(workoutDay => {
      if (workoutDay.name === destination.droppableId) {
        const sourceDay = workoutSchedule.find(day => day.name === source.droppableId);
        if (!sourceDay) return workoutDay;
        const workoutToAdd = { ...sourceDay.workouts[source.index] };
        const newWorkouts = [...workoutDay.workouts, workoutToAdd];
        return { ...workoutDay, workouts: newWorkouts };
      }

      if (workoutDay.name === source.droppableId) {
        const newWorkouts = workoutDay.workouts.filter((_, index) => index !== source.index);
        return { ...workoutDay, workouts: newWorkouts };
      }

      return workoutDay;
    });
    setWorkoutSchedule(UpdatedWorkoutSchedule);
    dispatch(updateLoggedInUser({ ...loggedInUser, workoutSchedule: UpdatedWorkoutSchedule }));
  }

  return (
    <main className="page workout-page">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <WorkoutSchedule />
        <Button className="btn workout-page__btn" onClickFn={handleCreateWorkoutBtn}>
          add new workout
        </Button>
        <div className="workout-page__goals">
          <GoalEdit type="workout" />
          <AsyncList
            className="workout-page__goals__list"
            items={goals as Goal[]}
            render={goal => <GoalDisplay goal={goal} key={goal.id} isEditEnabled={true} />}
            isLoading={isLoadingGoals}
            isError={isErrorGoals}
            isSuccess={isSuccessGoals}
            isEmpty={isEmptyGoals}
            entityName="goal"
          />
        </div>
        {isLoadingCreateWorkout ? <SpinnerLoader /> : <WorkoutList />}
      </DragDropContext>
    </main>
  );
};

export default WorkoutPage;
