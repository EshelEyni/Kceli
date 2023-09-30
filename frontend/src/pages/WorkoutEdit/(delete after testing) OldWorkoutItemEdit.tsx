import { FC, useEffect } from "react";
import {
  CombinedWorkoutItem,
  Workout,
  WorkoutItemAerobic,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import SelectItem from "../../components/App/RadixSelect/SelectItem";

type WorkoutItemEditProps = {
  item: CombinedWorkoutItem | WorkoutItemAerobic;
};

export const WorkoutItemEdit: FC<WorkoutItemEditProps> = ({ item }) => {
  switch (item.type) {
    case "aerobic":
      return <AerobicWorkoutItemEdit item={item} />;
    case "anaerobic":
      return <AnaerobicWorkoutItemEdit item={item} />;
    case "superset":
      return <SuperSetWorkoutItemEdit item={item} />;
    default:
      return <AnaerobicWorkoutItemEdit item={item} />;
  }
};

interface AerobicWorkoutItemEditIFormInput {
  name: string;
  durationInMin: number;
}

function AerobicWorkoutItemEdit({ item }: { item: WorkoutItemAerobic }) {
  const { control, handleSubmit, setValue } = useForm<AerobicWorkoutItemEditIFormInput>({
    defaultValues: {
      name: item.name,
      durationInMin: item.durationInMin,
    },
  });

  const { workout, updateWorkout, isLoadingUpdateWorkout, removeWorkoutItem } = useWorkoutEdit();

  useEffect(() => {
    setValue("name", item.name);
    setValue("durationInMin", item.durationInMin);
  }, [item, setValue]);

  function onSubmit(data: AerobicWorkoutItemEditIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;
    const workoutToUpdate = {
      ...workout,
      items: workout.items.map(item => {
        if (item.id === item.id) return { ...item, ...data } as WorkoutItemAerobic;
        return item;
      }),
    } as Workout;

    updateWorkout(workoutToUpdate);
  }

  return (
    <form className="workout-edit-item__form" onSubmit={handleSubmit(onSubmit)}>
      <div className="workout-edit-item__form--input-container name-input">
        <label>Name:</label>
        <Controller name="name" control={control} render={({ field }) => <input {...field} />} />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Duration (in min):</label>
        <Controller
          name="durationInMin"
          control={control}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form__input-container--btns">
        <Button className="btn" onClickFn={() => removeWorkoutItem(item.id)}>
          delete
        </Button>
        <Button type="submit" className="btn" isDisabled={isLoadingUpdateWorkout}>
          Update
        </Button>
      </div>
    </form>
  );
}

interface AnaerobicWorkoutItemEditIFormInput {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
}

function AnaerobicWorkoutItemEdit({
  item,
  parentItem,
}: {
  item: WorkoutItemAnaerobic;
  parentItem?: WorkoutItemSuperset;
}) {
  const { control, handleSubmit, setValue } = useForm<AnaerobicWorkoutItemEditIFormInput>({
    defaultValues: {
      name: item.name,
      sets: item.sets,
      reps: item.reps,
      weight: item.weight,
      weightUnit: item.weightUnit,
      restInSec: item.restInSec,
    },
  });

  const {
    workout,
    updateWorkout,
    isLoadingUpdateWorkout,
    removeWorkoutItem,
    removeWorkoutItemFromSuperset,
  } = useWorkoutEdit();

  useEffect(() => {
    setValue("name", item.name);
    setValue("sets", item.sets);
    setValue("reps", item.reps);
    setValue("weight", item.weight);
    setValue("restInSec", item.restInSec);
    setValue("weightUnit", item.weightUnit);
  }, [item, setValue]);

  function handleRemoveBtnClick() {
    if (!parentItem) return removeWorkoutItem(item.id);
    removeWorkoutItemFromSuperset(item.id, parentItem.id);
  }

  function onSubmit(data: AnaerobicWorkoutItemEditIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;
    const workoutToUpdate = {
      ...workout,
      items: workout.items.map(i => {
        if (i.id === item.id) return { ...i, ...data } as WorkoutItemAnaerobic;
        return i;
      }),
    } as Workout;

    updateWorkout(workoutToUpdate);
  }

  return (
    <form className="workout-edit-item__form" onSubmit={handleSubmit(onSubmit)}>
      <div className="workout-edit-item__form--input-container name-input">
        <label>Name:</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <input {...field} autoComplete="off" />}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Sets:</label>
        <Controller
          name="sets"
          control={control}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Reps:</label>
        <Controller
          name="reps"
          control={control}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Weight:</label>
        <Controller
          name="weight"
          control={control}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Weight unit:</label>
        <Controller
          name="weightUnit"
          control={control}
          render={({ field }) => (
            <Select.Root onValueChange={value => field.onChange(value)} {...field}>
              <Select.Trigger className="SelectTrigger">
                <Select.Value placeholder={field.value === "kg" ? "kg" : "lbs"} />
                <Select.Icon className="SelectIcon">
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="SelectContent">
                  <Select.Viewport className="SelectViewport">
                    <Select.Group>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          )}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Rest (in sec):</label>
        <Controller
          name="restInSec"
          control={control}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form__input-container--btns">
        <Button className="btn" onClickFn={handleRemoveBtnClick}>
          delete
        </Button>
        <Button type="submit" isDisabled={isLoadingUpdateWorkout} className="btn">
          Update
        </Button>
      </div>
    </form>
  );
}

interface WorkoutItemSupersetIFormInput {
  name: string;
}

function SuperSetWorkoutItemEdit({ item }: { item: WorkoutItemSuperset }) {
  const { control, handleSubmit, setValue } = useForm<WorkoutItemSupersetIFormInput>({
    defaultValues: {
      name: item.name,
    },
  });

  const {
    workout,
    updateWorkout,
    isLoadingUpdateWorkout,
    addWorkoutItemToSuperset,
    removeWorkoutItem,
  } = useWorkoutEdit();

  useEffect(() => {
    setValue("name", item.name);
  }, [item, setValue]);

  function onSubmit(data: WorkoutItemSupersetIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;

    const workoutToUpdate = {
      ...workout,
      items: workout.items.map(i => {
        if (i.id === item.id) return { ...i, name: data.name } as WorkoutItemSuperset;
        return i;
      }),
    } as Workout;

    updateWorkout(workoutToUpdate);
  }

  return (
    <form className="workout-edit-item__form superset" onSubmit={handleSubmit(onSubmit)}>
      <div className="workout-edit-item__form--input-container name-input">
        <label>Superset Name:</label>
        <Controller name="name" control={control} render={({ field }) => <input {...field} />} />
      </div>

      {item.items.map(supersetItem => (
        <AnaerobicWorkoutItemEdit item={supersetItem} parentItem={item} key={supersetItem.id} />
      ))}

      <div className="workout-edit-item__form__input-container--btns">
        <Button className="btn" onClickFn={() => removeWorkoutItem(item.id)}>
          delete
        </Button>

        <Button
          className="btn workout-edit__btn"
          onClickFn={() => addWorkoutItemToSuperset(item.id)}
        >
          add item
        </Button>

        <Button className="btn workout-edit__btn" type="submit" isDisabled={isLoadingUpdateWorkout}>
          Update
        </Button>
      </div>
    </form>
  );
}
