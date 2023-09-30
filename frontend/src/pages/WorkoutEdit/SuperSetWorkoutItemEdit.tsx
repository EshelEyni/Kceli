import { FC, useEffect } from "react";
import { Workout, WorkoutItemSuperset } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";
import { AnaerobicWorkoutItemEdit } from "./AnaerobicWorkoutItemEdit";

interface WorkoutItemSupersetIFormInput {
  name: string;
}

type WorkoutItemSupersetEditProps = { item: WorkoutItemSuperset };

export const SuperSetWorkoutItemEdit: FC<WorkoutItemSupersetEditProps> = ({ item }) => {
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
};
