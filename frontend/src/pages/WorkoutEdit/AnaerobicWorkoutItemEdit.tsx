import { FC, useEffect } from "react";
import { Workout, WorkoutItemAnaerobic } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContext";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import workoutUtilService from "../../services/workout/workoutUtilService";

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
};

export const AnaerobicWorkoutItemEdit: FC<AnaerobicWorkoutItemEditProps> = ({ item }) => {
  const { control, handleSubmit, setValue } = useForm<AnaerobicWorkoutItemEditIFormInput>({
    defaultValues: {
      name: item.name,
      sets: item.sets.length,
      reps: item.reps,
      weight: item.weight,
      weightUnit: item.weightUnit,
      restInSec: item.restInSec,
    },
  });

  const { workout, updateWorkout, isLoadingUpdateWorkout, removeWorkoutItem } = useWorkoutEdit();

  function handleRemoveBtnClick() {
    removeWorkoutItem(item.id);
  }

  function onSubmit(data: AnaerobicWorkoutItemEditIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;

    const items = workout.items.map(i => {
      if (i.id === item.id) {
        const { sets: numOfSets, ...dataWithoutSets } = data;
        const sets = Array(numOfSets).fill(workoutUtilService.getAnaerobicSet());
        return { ...i, ...dataWithoutSets, sets } as WorkoutItemAnaerobic;
      }
      return i;
    });

    const workoutToUpdate = { ...workout, items } as Workout;

    updateWorkout(workoutToUpdate);
  }

  useEffect(() => {
    setValue("name", item.name);
    setValue("sets", item.sets.length);
    setValue("reps", item.reps);
    setValue("weight", item.weight);
    setValue("restInSec", item.restInSec);
    setValue("weightUnit", item.weightUnit);
  }, [item, setValue]);

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
          rules={{ min: 1, max: 10 }}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Reps:</label>
        <Controller
          name="reps"
          control={control}
          rules={{ min: 1, max: 10 }}
          render={({ field }) => <input type="number" {...field} />}
        />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Weight:</label>
        <Controller
          name="weight"
          control={control}
          rules={{ min: 1 }}
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
