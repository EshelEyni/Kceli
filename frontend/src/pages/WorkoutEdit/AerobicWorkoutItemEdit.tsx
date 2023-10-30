import { FC } from "react";
import { Workout, WorkoutItemAerobic } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContext";
import { Button } from "../../components/App/Button/Button";
import { debounce } from "../../services/util/utilService";
import { MiniWorkoutItemPreview } from "./MiniWorkoutItemPreview";

type AerobicWorkoutItemEditProps = {
  item: WorkoutItemAerobic;
};

export const AerobicWorkoutItemEdit: FC<AerobicWorkoutItemEditProps> = ({ item }) => {
  const { workout, updateWorkout, removeWorkoutItem, currItemId } = useWorkoutEdit();

  function handleInputNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const items = workout?.items.map(item => {
      if (item.id !== item.id) return item;
      return { ...item, name };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const durationInMin = Number(e.target.value);
    const items = workout?.items.map(item => {
      if (item.id !== item.id) return item;
      return { ...item, durationInMin };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  if (currItemId !== item.id) return <MiniWorkoutItemPreview item={item} />;

  return (
    <section className="workout-edit__form">
      <div className="workout-edit__form__input-container name-input">
        <label>Name:</label>
        <input
          autoComplete="off"
          defaultValue={item.name}
          onChange={debounce(handleInputNameChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container">
        <label>Duration (in min):</label>
        <input
          type="number"
          defaultValue={item.durationInMin}
          onChange={debounce(handleInputDurationChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container__btns-container">
        <Button className="btn" onClickFn={() => removeWorkoutItem(item.id)}>
          delete
        </Button>
      </div>
    </section>
  );
};
