import { FC, useState } from "react";
import { useDayEdit } from "./DayEditContext";
import { WorkoutPreview } from "../../../components/Workout/WorkoutPreview/WorkoutPreview";
import { List } from "../../../components/App/List/List";
import { Button } from "../../../components/App/Button/Button";
import { Workout } from "../../../../../shared/types/workout";
import workoutUtilService from "../../../services/workout/workoutUtilService";
import { WorkoutEditMainInputs } from "../../WorkoutEdit/WorkoutEditMainInputs";
import "./DayWorkouts.scss";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { useAuth } from "../../../hooks/useAuth";

export const DayWorkouts: FC = () => {
  const { loggedInUser } = useAuth();
  const { dailyData, updateDailyData, isLoadingUpdate } = useDayEdit();
  const [quickWorkout, setQuickWorkout] = useState<Workout | null>(null);

  function handleAddBtnClick() {
    const defaultWorkout = workoutUtilService.getDefaultWorkout();
    setQuickWorkout(defaultWorkout);
  }

  function handleDescInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!quickWorkout) return;
    const description = e.target.value;
    const updatedWorkout = { ...quickWorkout, description } as Workout;
    setQuickWorkout(updatedWorkout);
  }

  function handleTypeSelectChange(type: string) {
    if (!quickWorkout) return;
    const updatedWorkout = { ...quickWorkout, type } as Workout;
    setQuickWorkout(updatedWorkout);
  }

  function handleDurationInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!quickWorkout) return;
    const durationInMin = Number(e.target.value);
    const updatedWorkout = { ...quickWorkout, durationInMin } as Workout;
    setQuickWorkout(updatedWorkout);
  }

  function handleSplitSelectChange(split: string) {
    if (!quickWorkout) return;
    const updatedWorkout = { ...quickWorkout, split } as Workout;
    setQuickWorkout(updatedWorkout);
  }

  function handleCancelBtnClick() {
    setQuickWorkout(null);
  }

  function handleSaveBtnClick() {
    if (!quickWorkout || !dailyData || !loggedInUser) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...rest } = quickWorkout;
    const quickWorkoutToAdd = { ...rest, userId: loggedInUser.id } as Workout;
    const updatedWorkouts = [...dailyData.workouts, quickWorkoutToAdd];
    const updatedDailyData = { ...dailyData, workouts: updatedWorkouts };
    updateDailyData(updatedDailyData);
    setQuickWorkout(null);
  }

  if (!dailyData) return null;
  if (isLoadingUpdate) return <SpinnerLoader />;
  return (
    <section className="day-edit__day-workouts" data-testid="day-workouts">
      <Button className="day-edit__day-workouts__btn" onClickFn={handleAddBtnClick}>
        add quick workout
      </Button>
      {quickWorkout && (
        <form
          className="day-edit__day-workouts__quick-workout-form"
          data-testid="quick-workout-form"
        >
          <WorkoutEditMainInputs
            workout={quickWorkout}
            handleTypeSelectChange={handleTypeSelectChange}
            handleDurationInputChange={handleDurationInputChange}
            handleDescInputChange={handleDescInputChange}
            handleSplitSelectChange={handleSplitSelectChange}
          />

          <div className="day-edit__day-workouts__quick-workout-form__btns-container">
            <Button onClickFn={handleCancelBtnClick}>cancel</Button>
            <Button onClickFn={handleSaveBtnClick}>save</Button>
          </div>
        </form>
      )}

      <List
        className="day-edit__day-workouts__workouts-list"
        items={dailyData.workouts}
        render={item => <WorkoutPreview workout={item} isDayEdit={true} key={item.id} />}
        dataTestId="workouts-list"
      />
    </section>
  );
};
