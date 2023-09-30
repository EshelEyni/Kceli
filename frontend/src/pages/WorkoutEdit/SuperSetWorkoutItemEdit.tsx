import { FC, useEffect } from "react";
import { SupersetItem, Workout, WorkoutItemSuperset } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";
// import { AnaerobicWorkoutItemEdit } from "./AnaerobicWorkoutItemEdit";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface WorkoutItemSupersetIFormInput {
  name: string;
  restInSec: number;
  sets: number;
  items: SupersetItem[];
}

type WorkoutItemSupersetEditProps = { item: WorkoutItemSuperset };

export const SuperSetWorkoutItemEdit: FC<WorkoutItemSupersetEditProps> = ({ item }) => {
  const { control, handleSubmit, setValue } = useForm<WorkoutItemSupersetIFormInput>({
    defaultValues: {
      name: item.name,
      restInSec: item.restInSec,
      sets: item.sets,
      items: item.items,
    },
  });

  const {
    workout,
    updateWorkout,
    isLoadingUpdateWorkout,
    addWorkoutItemToSuperset,
    removeWorkoutItem,
  } = useWorkoutEdit();

  function onSubmit(data: WorkoutItemSupersetIFormInput) {
    if (!workout || isLoadingUpdateWorkout) return;

    const workoutToUpdate = {
      ...workout,
      items: workout.items.map(i => {
        if (i.id === item.id)
          return {
            ...i,
            name: data.name,
            restInSec: Number(data.restInSec),
            sets: Number(data.sets),
            items: data.items,
          } as WorkoutItemSuperset;
        return i;
      }),
    } as Workout;

    updateWorkout(workoutToUpdate);
  }

  useEffect(() => {
    setValue("name", item.name);
    setValue("restInSec", item.restInSec);
    setValue("sets", item.sets);
    setValue("items", item.items);
  }, [item, setValue]);

  return (
    <>
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

          <Button
            className="btn workout-edit__btn"
            type="submit"
            isDisabled={isLoadingUpdateWorkout}
          >
            Update
          </Button>
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

            <div className="workout-edit-item__form--input-container" key={i}>
              <label>reps:</label>
              <Controller
                name={`items.${i}.reps`}
                control={control}
                defaultValue={supersetItem.reps}
                render={({ field }) => <input type="number" {...field} />}
              />
            </div>

            <div className="workout-edit-item__form--input-container" key={i}>
              <label>weight:</label>
              <Controller
                name={`items.${i}.weight`}
                control={control}
                defaultValue={supersetItem.weight}
                render={({ field }) => <input type="number" {...field} />}
              />
            </div>

            <div className="workout-edit-item__form--input-container" key={i}>
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
          </div>
        ))}
      </form>

      {/* {item.items.map(supersetItem => (
        <AnaerobicWorkoutItemEdit item={supersetItem} parentItem={item} key={supersetItem.id} />
      ))} */}
    </>
  );
};
