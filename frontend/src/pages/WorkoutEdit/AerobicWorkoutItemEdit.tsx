import { FC, useEffect } from "react";
import { Workout, WorkoutItemAerobic } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContex";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../components/App/Button/Button";

interface AerobicWorkoutItemEditIFormInput {
  name: string;
  durationInMin: number;
}

type AerobicWorkoutItemEditProps = {
  item: WorkoutItemAerobic;
};

export const AerobicWorkoutItemEdit: FC<AerobicWorkoutItemEditProps> = ({ item }) => {
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
};
