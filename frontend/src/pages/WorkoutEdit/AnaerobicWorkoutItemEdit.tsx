import { FC } from "react";
import { WeightUnit, Workout, WorkoutItemAnaerobic } from "../../../../shared/types/workout";
import { useWorkoutEdit } from "./WorkoutEditContext";
import { Button } from "../../components/App/Button/Button";
import { FaChevronDown } from "react-icons/fa";
import { debounce } from "../../services/util/utilService";
import { MiniWorkoutItemPreview } from "./MiniWorkoutItemPreview";
import { Select } from "../../components/App/Select/Select";

type AnaerobicWorkoutItemEditProps = {
  item: WorkoutItemAnaerobic;
};

export const AnaerobicWorkoutItemEdit: FC<AnaerobicWorkoutItemEditProps> = ({ item }) => {
  const { removeWorkoutItem, workout, updateWorkout, currItemId } = useWorkoutEdit();

  function handleRemoveBtnClick() {
    removeWorkoutItem(item.id);
  }

  function handleInputNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, name };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputSetsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sets = Number(e.target.value);
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, sets };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputRepsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const reps = Number(e.target.value);
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, reps };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    const weight = Number(e.target.value);
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, weight };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleWeightUnitSelectChange(weightUnit: string) {
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, weightUnit };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputRestInSecChange(e: React.ChangeEvent<HTMLInputElement>) {
    const restInSec = Number(e.target.value);
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, restInSec };
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
        <label>Sets:</label>
        <input
          type="number"
          defaultValue={item.sets}
          onChange={debounce(handleInputSetsChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container">
        <label>Reps:</label>
        <input
          type="number"
          defaultValue={item.reps}
          onChange={debounce(handleInputRepsChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container">
        <label>Weight:</label>
        <input
          type="number"
          defaultValue={item.weight}
          onChange={debounce(handleInputWeightChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container">
        <label>Weight unit:</label>

        <Select onChange={handleWeightUnitSelectChange} listHeight={250}>
          <Select.SelectTrigger>
            <div>
              <span>{item.weightUnit}</span>
              <FaChevronDown />
            </div>
          </Select.SelectTrigger>
          <Select.SelectList>
            {Object.values(WeightUnit).map(weightUnit => (
              <Select.SelectItem value={weightUnit} key={weightUnit}>
                {weightUnit}
              </Select.SelectItem>
            ))}
          </Select.SelectList>
        </Select>
      </div>

      <div className="workout-edit__form__input-container">
        <label>Rest (in sec):</label>
        <input
          type="number"
          defaultValue={item.restInSec}
          onChange={debounce(handleInputRestInSecChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container__btns-container">
        <Button className="btn" onClickFn={handleRemoveBtnClick}>
          delete
        </Button>
      </div>
    </section>
  );
};
