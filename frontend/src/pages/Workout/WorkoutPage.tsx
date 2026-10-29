import { FC, useState } from "react";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import "./WorkoutPage.scss";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { useWorkouts } from "./WorkoutsContext";
import { WorkoutSchedule } from "./WorkoutSchedule/WorkoutSchedule";
import { WorkoutList } from "./WorkoutList/WorkoutList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Goal } from "../../types/app";
import { GoalEdit } from "../../components/GoalEdit/GoalEdit";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { GoalDisplay } from "../Schedule/GoalDisplay";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import { MetricCard, PageIntro } from "../../components/App/PageIntro/PageIntro";
import { FiPlus } from "react-icons/fi";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { Workout } from "../../../../shared/types/workout";

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
  const { updateUser, isLoading: isSavingSchedule } = useUpdateUser();
  const [filter, setFilter] = useState<"all" | "anaerobic" | "aerobic">("all");

  function saveSchedule(schedule: NonNullable<typeof loggedInUser>["workoutSchedule"]) {
    if (!loggedInUser || isSavingSchedule) return;
    updateUser(
      { ...loggedInUser, workoutSchedule: schedule },
      {
        onSuccess: user => {
          setWorkoutSchedule(user.workoutSchedule);
        },
      }
    );
  }

  function scheduleWorkout(workout: Workout, day: string) {
    if (!loggedInUser) return;
    if (
      loggedInUser.workoutSchedule
        .find(entry => entry.name === day)
        ?.workouts.some(w => w.id === workout.id)
    )
      return;
    const schedule = loggedInUser.workoutSchedule.map(entry =>
      entry.name === day && !entry.workouts.some(w => w.id === workout.id)
        ? { ...entry, workouts: [...entry.workouts, workout] }
        : entry
    );
    saveSchedule(schedule);
  }

  function removeScheduledWorkout(day: string, index: number) {
    if (!loggedInUser) return;
    saveSchedule(
      loggedInUser.workoutSchedule.map(entry =>
        entry.name === day
          ? { ...entry, workouts: entry.workouts.filter((_, i) => i !== index) }
          : entry
      )
    );
  }

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
      const visibleWorkouts =
        filter === "all" ? workouts : workouts.filter(workout => workout.type === filter);
      const workoutToAdd = { ...visibleWorkouts[source.index] };
      if (workoutDay.workouts.some(workout => workout.id === workoutToAdd.id)) return workoutDay;
      const newWorkouts = [...workoutDay.workouts, workoutToAdd];
      return { ...workoutDay, workouts: newWorkouts };
    });
    saveSchedule(UpdatedWorkoutSchedule);
  }

  function updateFromWorkoutScheduleToWorkoutSchedule(result: DropResult) {
    if (!result.destination || !loggedInUser || !workouts) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;
    const { workoutSchedule } = loggedInUser;
    const UpdatedWorkoutSchedule = workoutSchedule.map(workoutDay => {
      if (workoutDay.name === destination.droppableId) {
        const sourceDay = workoutSchedule.find(day => day.name === source.droppableId);
        if (!sourceDay) return workoutDay;
        const workoutToAdd = { ...sourceDay.workouts[source.index] };
        if (workoutDay.workouts.some(workout => workout.id === workoutToAdd.id)) return workoutDay;
        const newWorkouts = [...workoutDay.workouts, workoutToAdd];
        return { ...workoutDay, workouts: newWorkouts };
      }

      if (workoutDay.name === source.droppableId) {
        const newWorkouts = workoutDay.workouts.filter((_, index) => index !== source.index);
        return { ...workoutDay, workouts: newWorkouts };
      }

      return workoutDay;
    });
    saveSchedule(UpdatedWorkoutSchedule);
  }

  return (
    <main className="page workout-page">
      <PageIntro
        eyebrow="Move with purpose"
        title="Your space to get stronger."
        description="Simple routines. A plan that works for you."
        action={
          <button
            className="ui-button"
            disabled={isLoadingCreateWorkout}
            onClick={handleCreateWorkoutBtn}
          >
            <FiPlus />
            Create workout
          </button>
        }
      />
      <div className="ui-metrics">
        <MetricCard
          label="Your library"
          value={workouts?.length ?? "—"}
          unit="routines"
          description="Built around your own exercises"
        />
        <MetricCard
          label="Strength routines"
          value={workouts?.filter(w => w.type === "anaerobic").length ?? "—"}
          description="Sets, reps, weights and supersets"
        />
        <MetricCard
          label="Cardio routines"
          value={workouts?.filter(w => w.type === "aerobic").length ?? "—"}
          description="Make time for movement"
        />
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <section className="ui-card ui-weekly-plan">
          <div className="ui-card-heading">
            <h2>Your weekly rhythm</h2>
            <span>{isSavingSchedule ? "Saving…" : "Recurring weekly plan"}</span>
          </div>
          <p className="ui-subtitle">
            Drag a routine onto a day, or use its “Add to day” menu on mobile.
          </p>
          <WorkoutSchedule onRemove={removeScheduledWorkout} isSaving={isSavingSchedule} />
        </section>
        <section className="ui-workout-library">
          <div className="ui-card-heading">
            <h2>Your workout library</h2>
            <div className="ui-tabs" aria-label="Filter workouts">
              {(
                [
                  { value: "all", label: "All workouts" },
                  { value: "anaerobic", label: "Strength" },
                  { value: "aerobic", label: "Cardio" },
                ] as const
              ).map(item => (
                <button
                  key={item.value}
                  className={filter === item.value ? "active" : ""}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {isLoadingCreateWorkout ? (
            <SpinnerLoader />
          ) : (
            <WorkoutList
              filter={filter}
              onSchedule={scheduleWorkout}
              isSavingSchedule={isSavingSchedule}
            />
          )}
        </section>
        <div className="ui-card workout-page__goals">
          <h2>A goal worth showing up for</h2>
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
      </DragDropContext>
    </main>
  );
};

export default WorkoutPage;
