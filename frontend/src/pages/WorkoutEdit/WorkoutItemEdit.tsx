import { FC } from "react";
import { CombinedWorkoutItem, WeightUnit, Workout } from "../../../../shared/types/workout";
import { debounce } from "../../services/util/utilService";
import { Button } from "../../components/App/Button/Button";
import { useWorkoutEdit } from "./WorkoutEditContext";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { Select } from "../../components/App/Select/Select";
import { FaChevronDown } from "react-icons/fa";

type WorkoutItemEditProps = {
  item: CombinedWorkoutItem;
};

export const WorkoutItemEdit: FC<WorkoutItemEditProps> = ({ item }) => {
  const {
    workout,
    updateWorkout,
    removeWorkoutItem,
    currItemId,
    addWorkoutItemToSuperset,
    removeWorkoutItemFromSuperset,
    setCurrItemId,
  } = useWorkoutEdit();
  const duration = workoutUtilService.calcItemDuration(item);

  function handleInputNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const updatedItem = { ...item, name };
    updateItemInWorkout(updatedItem);
  }

  function handleInputDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const durationInMin = Number(e.target.value);
    const updatedItem = { ...item, durationInMin };
    updateItemInWorkout(updatedItem);
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
    const updatedItem = { ...item, reps };
    updateItemInWorkout(updatedItem);
  }

  function handleInputWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (item.type !== "anaerobic") return;
    const weight = Number(e.target.value);
    const updatedItem = { ...item, weight };
    updateItemInWorkout(updatedItem);
  }

  function handleWeightUnitSelectChange(weightUnit: WeightUnit) {
    if (item.type !== "anaerobic") return;
    const updatedItem = { ...item, weightUnit };
    updateItemInWorkout(updatedItem);
  }

  function handleInputRestInSecChange(e: React.ChangeEvent<HTMLInputElement>) {
    const restInSec = Number(e.target.value);
    const updatedItem = { ...item, restInSec };
    updateItemInWorkout(updatedItem);
  }

  function handleInputItemNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout || item.type !== "superset") return;
    const name = e.target.value;
    const items = item.items.map(i => (i.id !== e.target.id ? i : { ...i, name }));
    const updatedItem = { ...item, items };
    updateItemInWorkout(updatedItem);
  }

  function handleInputItemRepsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout || item.type !== "superset") return;
    const reps = Number(e.target.value);
    const items = item.items.map(i => (i.id !== e.target.id ? i : { ...i, reps }));
    const updatedItem = { ...item, items };
    updateItemInWorkout(updatedItem);
  }

  function handleInputItemWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout || item.type !== "superset") return;
    const weight = Number(e.target.value);
    const items = item.items.map(i => (i.id !== e.target.id ? i : { ...i, weight }));
    const updatedItem = { ...item, items };
    updateItemInWorkout(updatedItem);
  }

  function handleSelectItemWeightUnitChange({
    weightUnit,
    supersetItemId,
  }: {
    weightUnit: WeightUnit;
    supersetItemId: string;
  }) {
    if (!workout || item.type !== "superset") return;
    const items = item.items.map(i => (i.id !== supersetItemId ? i : { ...i, weightUnit }));
    const updatedItem = { ...item, items };
    updateItemInWorkout(updatedItem);
  }

  function updateItemInWorkout(item: CombinedWorkoutItem) {
    if (!workout) return;
    const items = workout.items.map(i => (i.id !== item.id ? i : item));
    const workoutToUpdate = { ...workout, items } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleRemoveBtnClick() {
    removeWorkoutItem(item.id);
  }

  if (currItemId !== item.id)
    return (
      <section className="mini-workout-item-preview" onClick={() => setCurrItemId(item.id)}>
        <span>{item.name}</span>
        <FaChevronDown className="mini-workout-item-preview__icon" />
      </section>
    );

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

      {item.type === "aerobic" && (
        <div className="workout-edit__form__input-container">
          <label>Duration (in min):</label>
          <input
            type="number"
            defaultValue={duration}
            onChange={debounce(handleInputDurationChange, 500).debouncedFunc}
          />
        </div>
      )}

      {item.type !== "aerobic" && (
        <>
          <div className="workout-edit__form__input-container">
            <label>Sets:</label>
            <input
              type="number"
              defaultValue={item.sets}
              onChange={debounce(handleInputSetsChange, 500).debouncedFunc}
            />
          </div>

          <div className="workout-edit__form__input-container">
            <label>Rest (in sec):</label>
            <input
              type="number"
              defaultValue={item.restInSec}
              onChange={debounce(handleInputRestInSecChange, 500).debouncedFunc}
            />
          </div>
        </>
      )}

      {item.type === "anaerobic" && (
        <>
          <div className="workout-edit__form__input-container">
            <label>Reps:</label>
            <input
              type="number"
              defaultValue={item.reps}
              onChange={debounce(handleInputRepsChange, 500).debouncedFunc}
            />
          </div>

          {(item.weightUnit === "kg" || item.weightUnit === "lbs") && (
            <div className="workout-edit__form__input-container">
              <label>Weight:</label>
              <input
                type="number"
                defaultValue={item.weight}
                onChange={debounce(handleInputWeightChange, 500).debouncedFunc}
              />
            </div>
          )}

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
        </>
      )}

      {item.type === "superset" && (
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

              {(supersetItem.weightUnit === "kg" || supersetItem.weightUnit === "lbs") && (
                <div className="workout-edit__form__input-container">
                  <label>weight:</label>
                  <input
                    id={supersetItem.id}
                    type="number"
                    defaultValue={supersetItem.weight}
                    onChange={debounce(handleInputItemWeightChange, 500).debouncedFunc}
                  />
                </div>
              )}
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
      )}

      <div className="workout-edit__form__input-container__btns-container">
        <Button className="btn" onClickFn={handleRemoveBtnClick}>
          delete
        </Button>

        {item.type === "superset" && (
          <Button
            className="btn workout-edit__btn"
            onClickFn={() => addWorkoutItemToSuperset(item)}
          >
            add item
          </Button>
        )}
      </div>
    </section>
  );
};
