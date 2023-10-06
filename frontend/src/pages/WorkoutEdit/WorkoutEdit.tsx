import { FC, useEffect } from "react";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { List } from "../../components/App/List/List";
import {
  CombinedWorkoutItem,
  Split,
  Workout,
  WorkoutItemAerobic,
  WorkoutType,
} from "../../../../shared/types/workout";
import { Empty } from "../../components/App/Empty/Empty";
import { BtnGoBack } from "../../components/Buttons/BtnGoBack/BtnGoBack";
import "./WorkoutEdit.scss";
import { Button } from "../../components/App/Button/Button";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContext";
import { AerobicWorkoutItemEdit } from "./AerobicWorkoutItemEdit";
import { AnaerobicWorkoutItemEdit } from "./AnaerobicWorkoutItemEdit";
import { SuperSetWorkoutItemEdit } from "./SuperSetWorkoutItemEdit";
import { Controller, useForm } from "react-hook-form";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { Header } from "../../components/App/Header/Header";

interface WorkoutEditIFormInput {
  description: string;
  type: WorkoutType;
  split?: Split;
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

  const defaultValues: WorkoutEditIFormInput = {
    description: workout?.description || "",
    type: workout?.type || "anaerobic",
  };
  const isAnaeobic = workout && workout?.type === "anaerobic";
  if (isAnaeobic) defaultValues.split = workout.split;

  const { control, handleSubmit, setValue } = useForm<WorkoutEditIFormInput>({ defaultValues });

  const isItemsEmpty = workout?.items.length === 0;
  const isItemsListShown = !isItemsEmpty && !isLoadingUpdateWorkout;

  function handleGoBackBtnClick() {
    navigate("/workouts");
  }

  function handleOpenBtnClick() {
    if (!workout) return;
    navigate(`/workouts/details/${workout.id}`);
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
      <Header className="workout-edit__header">
        <BtnGoBack className="workout-edit__btn" handleClick={handleGoBackBtnClick} />
        <Button className="btn workout-edit__btn" onClickFn={handleOpenBtnClick}>
          open
        </Button>
      </Header>

      <form className="workout-edit-item__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="workout-edit-item__form--input-container name-input">
          <label>description:</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => <input {...field} />}
          />
        </div>

        <div className="workout-edit-item__form--input-container">
          <label>workout type:</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select.Root onValueChange={value => field.onChange(value)}>
                <Select.Trigger className="SelectTrigger">
                  <Select.Value placeholder={workout.type} />
                  <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="SelectContent">
                    <Select.Viewport className="SelectViewport">
                      <Select.Group>
                        <Select.Item value="anaerobic" className="SelectItem" {...field.ref}>
                          <Select.ItemText>anaerobic</Select.ItemText>
                        </Select.Item>
                        <Select.Item value="aerobic" className="SelectItem" {...field.ref}>
                          <Select.ItemText>aerobic</Select.ItemText>
                        </Select.Item>
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            )}
          />
        </div>

        {isAnaeobic && (
          <div className="workout-edit-item__form--input-container">
            <label>split:</label>
            <Controller
              name="split"
              control={control}
              render={({ field }) => (
                <Select.Root onValueChange={value => field.onChange(value)}>
                  <Select.Trigger className="SelectTrigger">
                    <Select.Value placeholder={workout.split} />
                    <Select.Icon className="SelectIcon">
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="SelectContent">
                      <Select.Viewport className="SelectViewport">
                        <Select.Group>
                          {workoutUtilService.SPLIT_TYPES.map(type => (
                            <Select.Item
                              value={type}
                              className="SelectItem"
                              {...field.ref}
                              key={type}
                            >
                              <Select.ItemText>{type}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              )}
            />
          </div>
        )}

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
