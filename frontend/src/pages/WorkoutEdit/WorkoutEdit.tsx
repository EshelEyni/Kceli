import { FC, useEffect } from "react";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { List } from "../../components/App/List/List";
import { CombinedWorkoutItem, Workout, WorkoutItemAerobic } from "../../../../shared/types/workout";
import { Empty } from "../../components/App/Empty/Empty";
import { BtnGoBack } from "../../components/Buttons/BtnGoBack/BtnGoBack";
import "./WorkoutEdit.scss";
import { Button } from "../../components/App/Button/Button";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { AerobicWorkoutItemEdit } from "./AerobicWorkoutItemEdit";
import { AnaerobicWorkoutItemEdit } from "./AnaerobicWorkoutItemEdit";
import { SuperSetWorkoutItemEdit } from "./SuperSetWorkoutItemEdit";
import { Controller, useForm } from "react-hook-form";

interface WorkoutEditIFormInput {
  description: string;
}

const WorkoutEdit: FC = () => {
  const {
    isLoadingUpdateWorkout,
    workout,
    isLoading,
    isSuccess,
    isError,
    navigate,
    addWorkoutItem,
    addSupersetWorkoutItem,
    updateWorkout,
    duration,
  } = useWorkoutEdit();

  const { control, handleSubmit, setValue } = useForm<WorkoutEditIFormInput>({
    defaultValues: {
      description: workout?.description || "",
    },
  });

  const isItemsEmpty = workout?.items.length === 0;
  const isItemsListShown = !isItemsEmpty && !isLoadingUpdateWorkout;

  function handleGoBackBtnClick() {
    navigate("/workouts");
  }

  function onSubmit(data: WorkoutEditIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;
    const workoutToUpdate = { ...workout, ...data } as Workout;
    updateWorkout(workoutToUpdate);
  }
  useEffect(() => {
    setValue("description", workout?.description || "");
  }, [workout, setValue]);

  if (isLoading)
    return <SpinnerLoader withContainer={true} containerSize={{ width: "100%", height: "75vh" }} />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;
  if (!isSuccess || !workout) return null;

  return (
    <main className="page workout-edit-page">
      <BtnGoBack className="workout-edit__btn" handleClick={handleGoBackBtnClick} />

      <form className="workout-edit-item__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="workout-edit-item__form--input-container name-input">
          <label>description:</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <input {...field} />}
          />
        </div>

        <div className="workout-edit-item__form__input-container--btns">
          <Button type="submit" className="btn" isDisabled={isLoadingUpdateWorkout}>
            Update
          </Button>
        </div>
      </form>

      <div className="workout-edit-page__duration-container">
        <h3>duration:</h3>
        <h4>{duration} minutes</h4>
      </div>

      <div className="workout-edit__btns">
        <Button className="btn workout-edit__btn" onClickFn={addWorkoutItem}>
          add set
        </Button>
        <Button className="btn workout-edit__btn" onClickFn={addSupersetWorkoutItem}>
          add superset
        </Button>
      </div>

      {isItemsEmpty && <Empty entityName="exercises" />}
      {isItemsListShown && (
        <List<CombinedWorkoutItem | WorkoutItemAerobic>
          className="workout-edit__items-list"
          items={workout.items}
          render={item => {
            switch (item.type) {
              case "aerobic":
                return <AerobicWorkoutItemEdit item={item} key={item.id} />;
              case "anaerobic":
                return <AnaerobicWorkoutItemEdit item={item} key={item.id} />;
              case "superset":
                return <SuperSetWorkoutItemEdit item={item} key={item.id} />;
            }
          }}
        />
      )}
      {isLoadingUpdateWorkout && (
        <SpinnerLoader withContainer={true} containerSize={{ width: "100%", height: "75vh" }} />
      )}
    </main>
  );
};

export default WorkoutEdit;
