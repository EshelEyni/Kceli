import { FC } from "react";
import {
  WeightUnit,
  Workout,
  WorkoutAnaerobic,
  WorkoutItemSuperset,
} from "../../../../shared/types/workout";
import { useWorkoutEdit } from "./WorkoutEditContext";
import { Button } from "../../components/App/Button/Button";
import { FaChevronDown } from "react-icons/fa";
import { debounce } from "../../services/util/utilService";
import { MiniWorkoutItemPreview } from "./MiniWorkoutItemPreview";
import { Select } from "../../components/App/Select/Select";

type WorkoutItemSupersetEditProps = { item: WorkoutItemSuperset };

export const SuperSetWorkoutItemEdit: FC<WorkoutItemSupersetEditProps> = ({ item }) => {
  const {
    workout,
    updateWorkout,
    addWorkoutItemToSuperset,
    removeWorkoutItemFromSuperset,
    removeWorkoutItem,
    currItemId,
  } = useWorkoutEdit();

  function handleInputNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, name };
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

  function handleInputSetsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sets = Number(e.target.value);
    const items = workout?.items.map(item => {
      if (item.id !== currItemId) return item;
      return { ...item, sets };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputItemNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout) return;
    const name = e.target.value;
    const items = (workout as WorkoutAnaerobic).items.map(i => {
      if (i.id !== item.id) return i;
      const items = (i as WorkoutItemSuperset).items.map(superSetItem => {
        if (superSetItem.id !== e.target.id) return superSetItem;
        return { ...superSetItem, name };
      });
      return { ...i, items };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputItemRepsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout) return;
    const reps = Number(e.target.value);
    const items = (workout as WorkoutAnaerobic).items.map(i => {
      if (i.id !== item.id) return i;
      const items = (i as WorkoutItemSuperset).items.map(superSetItem => {
        if (superSetItem.id !== e.target.id) return superSetItem;
        return { ...superSetItem, reps };
      });
      return { ...i, items };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleInputItemWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout) return;
    const weight = Number(e.target.value);
    const items = (workout as WorkoutAnaerobic).items.map(i => {
      if (i.id !== item.id) return i;
      const items = (i as WorkoutItemSuperset).items.map(superSetItem => {
        if (superSetItem.id !== e.target.id) return superSetItem;
        return { ...superSetItem, weight };
      });
      return { ...i, items };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleSelectItemWeightUnitChange({
    weightUnit,
    supersetItemId,
  }: {
    weightUnit: string;
    supersetItemId: string;
  }) {
    if (!workout) return;
    const items = (workout as WorkoutAnaerobic).items.map(i => {
      if (i.id !== item.id) return i;
      const items = (i as WorkoutItemSuperset).items.map(superSetItem => {
        if (superSetItem.id !== supersetItemId) return superSetItem;
        return { ...superSetItem, weightUnit };
      });
      return { ...i, items };
    });
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  if (currItemId !== item.id) return <MiniWorkoutItemPreview item={item} />;
  return (
    <section className="workout-edit__form superset">
      <div className="workout-edit__form__input-container name-input">
        <label>Superset Name:</label>
        <input
          autoComplete="off"
          defaultValue={item.name}
          onChange={debounce(handleInputNameChange, 500).debouncedFunc}
        />
      </div>

      <div className="workout-edit__form__input-container">
        <label>Rest In Sec:</label>
        <input
          type="number"
          defaultValue={item.restInSec}
          onChange={debounce(handleInputRestInSecChange, 500).debouncedFunc}
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
      <div className="workout-edit__form__superset-item-list">
        {item.items.map((supersetItem, i) => (
          <div className="workout-edit__form__superset-item-container" key={i}>
            <h3>Item {i + 1}</h3>
            <div className="workout-edit__form__input-container">
              <label>name:</label>
              <input
                id={supersetItem.id}
                type="text"
                defaultValue={supersetItem.name}
                onChange={debounce(handleInputItemNameChange, 500).debouncedFunc}
              />
            </div>
            <div className="workout-edit__form__input-container">
              <label>reps:</label>
              <input
                id={supersetItem.id}
                type="number"
                defaultValue={supersetItem.reps}
                onChange={debounce(handleInputItemRepsChange, 500).debouncedFunc}
              />
            </div>
            <div className="workout-edit__form__input-container">
              <label>weight:</label>
              <input
                id={supersetItem.id}
                type="number"
                defaultValue={supersetItem.weight}
                onChange={debounce(handleInputItemWeightChange, 500).debouncedFunc}
              />
            </div>
            <div className="workout-edit__form__input-container">
              <label>weight unit:</label>

              <Select onChange={handleSelectItemWeightUnitChange} listHeight={250}>
                <Select.SelectTrigger>
                  <div>
                    <span>{supersetItem.weightUnit}</span>
                    <FaChevronDown />
                  </div>
                </Select.SelectTrigger>
                <Select.SelectList>
                  {Object.values(WeightUnit).map(weightUnit => (
                    <Select.SelectItem
                      value={{ weightUnit, supersetItemId: supersetItem.id }}
                      key={weightUnit}
                    >
                      {weightUnit}
                    </Select.SelectItem>
                  ))}
                </Select.SelectList>
              </Select>
            </div>
            <div className="workout-edit__form__input-container__btns-container">
              <Button
                className="superset__btn-delete"
                onClickFn={() => removeWorkoutItemFromSuperset(item.id, supersetItem.id)}
              >
                delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="workout-edit__form__input-container__btns-container">
        <Button className="btn" onClickFn={() => removeWorkoutItem(item.id)}>
          delete
        </Button>

        <Button className="btn workout-edit__btn" onClickFn={() => addWorkoutItemToSuperset(item)}>
          add item
        </Button>
      </div>
    </section>
  );
};
