import { FC, useEffect } from "react";
import {
  Workout,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface AnaerobicWorkoutItemEditIFormInput {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: "kg" | "lbs";
  restInSec: number;
}

type AnaerobicWorkoutItemEditProps = {
  item: WorkoutItemAnaerobic;
  parentItem?: WorkoutItemSuperset;
};

export const AnaerobicWorkoutItemEdit: FC<AnaerobicWorkoutItemEditProps> = ({
  item,
  parentItem,
}) => {
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
        if (i.type === "superset" && i.id === parentItem?.id) {
          const itemToUpdate: WorkoutItemSuperset = {
            ...i,
            items: i.items.map(i => {
              if (i.id === item.id) return { ...i, ...data } as WorkoutItemAnaerobic;
              return i;
            }),
          };
          return itemToUpdate;
        }
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
            <Select.Root onValueChange={value => field.onChange(value)}>
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
                      <Select.Item value="kg" className="SelectItem" {...field.ref}>
                        <Select.ItemText>kg</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="lbs" className="SelectItem" {...field.ref}>
                        <Select.ItemText>lbs</Select.ItemText>
                      </Select.Item>
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
};
