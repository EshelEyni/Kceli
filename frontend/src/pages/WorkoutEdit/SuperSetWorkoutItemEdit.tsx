import { FC, useEffect } from "react";
import { SupersetItem, Workout, WorkoutItemSuperset } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";
// import { AnaerobicWorkoutItemEdit } from "./AnaerobicWorkoutItemEdit";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import workoutUtilService from "../../services/workout/workoutUtilService";

interface WorkoutItemSupersetIFormInput {
  name: string;
  restInSec: number;
  sets: number;
  items: SupersetItem[];
}

type WorkoutItemSupersetEditProps = { item: WorkoutItemSuperset };

export const SuperSetWorkoutItemEdit: FC<WorkoutItemSupersetEditProps> = ({ item }) => {
  const {
    workout,
    updateWorkout,
    isLoadingUpdateWorkout,
    addWorkoutItemToSuperset,
    removeWorkoutItemFromSuperset,
    removeWorkoutItem,
  } = useWorkoutEdit();

  const defaultValues = {
    name: item.name,
    restInSec: item.restInSec,
    sets: item.sets.length,
    items: item.items,
  };

  const { control, handleSubmit, setValue } = useForm<WorkoutItemSupersetIFormInput>({
    defaultValues,
  });

  function onSubmit(data: WorkoutItemSupersetIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;
    const items = workout.items.map(i => {
      if (i.id !== item.id) return i;

      const { sets: numOfSets, ...dataWithoutSets } = data;
      const sets = Array(numOfSets).fill(workoutUtilService.getAnaerobicSet());
      const restInSec = Number(data.restInSec);
      return { ...i, ...dataWithoutSets, restInSec, sets } as WorkoutItemSuperset;
    });
    const workoutToUpdate = { ...workout, items } as Workout;

    updateWorkout(workoutToUpdate);
  }

  useEffect(() => {
    setValue("name", item.name);
    setValue("restInSec", item.restInSec);
    setValue("sets", item.sets.length);
    setValue("items", item.items);
  }, [item, setValue]);

  return (
    <form className="workout-edit-item__form superset" onSubmit={handleSubmit(onSubmit)}>
      <div className="workout-edit-item__form--input-container name-input">
        <label>Superset Name:</label>
        <Controller name="name" control={control} render={({ field }) => <input {...field} />} />
      </div>

      <div className="workout-edit-item__form--input-container">
        <label>Rest In Sec:</label>
        <Controller
          name="restInSec"
          control={control}
          render={({ field }) => <input type="number" {...field} />}
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

      {item.items.map((supersetItem, i) => (
        <div className="workout-edit-item__form__superset-item-container" key={i}>
          <h3>Item {i + 1}</h3>
          <div className="workout-edit-item__form--input-container">
            <label>name:</label>
            <Controller
              name={`items.${i}.name`}
              control={control}
              defaultValue={supersetItem.name}
              render={({ field }) => <input {...field} />}
            />
          </div>
          <div className="workout-edit-item__form--input-container">
            <label>reps:</label>
            <Controller
              name={`items.${i}.reps`}
              control={control}
              defaultValue={supersetItem.reps}
              render={({ field }) => <input type="number" {...field} />}
            />
          </div>
          <div className="workout-edit-item__form--input-container">
            <label>weight:</label>
            <Controller
              name={`items.${i}.weight`}
              control={control}
              defaultValue={supersetItem.weight}
              render={({ field }) => <input type="number" {...field} />}
            />
          </div>
          <div className="workout-edit-item__form--input-container">
            <label>weight unit:</label>
            <Controller
              name={`items.${i}.weightUnit`}
              control={control}
              defaultValue={supersetItem.weightUnit}
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

          <Button
            className="superset__btn-delete"
            onClickFn={() => removeWorkoutItemFromSuperset(item.id, supersetItem.id)}
          >
            delete
          </Button>
        </div>
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
};
