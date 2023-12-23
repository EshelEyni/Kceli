import { FC } from "react";
import { CombinedWorkoutItem, WeightUnit, Workout } from "../../../../shared/types/workout";
import { debounce } from "../../services/util/utilService";
import { Button } from "../../components/App/Button/Button";
import { useWorkoutEdit } from "./WorkoutEditContext";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { Select } from "../../components/App/Select/Select";
import { FaChevronDown } from "react-icons/fa";
import { usePageLoaded } from "../../hooks/usePageLoaded";

type WorkoutItemEditProps = {
  item: CombinedWorkoutItem;
};

export const WorkoutItemEdit: FC<WorkoutItemEditProps> = ({ item }) => {
  usePageLoaded({ title: "Workout Edit / Kceli" });

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
  const DEBOUNCE_TIME = 250;

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
      <section
        className="mini-workout-item-preview"
        data-testid="mini-workout-item-preview"
        onClick={() => setCurrItemId(item.id)}
      >
        <span>{item.name}</span>
        <FaChevronDown className="mini-workout-item-preview__icon" />
      </section>
    );

  return (
    <section className="workout-edit__form" data-testid="workout-item-edit">
      <div className="workout-edit__form__input-container name-input">
        <label htmlFor="item-name-input">Name:</label>
        <input
          id="item-name-input"
          data-testid="workout-item-name-input"
          autoComplete="off"
          defaultValue={item.name}
          onChange={debounce(handleInputNameChange, DEBOUNCE_TIME).debouncedFunc}
        />
      </div>

      {item.type === "aerobic" && (
        <div className="workout-edit__form__input-container">
          <label htmlFor="item-duration-input">Duration (in min):</label>
          <input
            id="item-duration-input"
            data-testid="workout-item-duration-input"
            type="number"
            defaultValue={duration}
            onChange={debounce(handleInputDurationChange, DEBOUNCE_TIME).debouncedFunc}
          />
        </div>
      )}

      {item.type !== "aerobic" && (
        <>
          <div className="workout-edit__form__input-container">
            <label htmlFor="item-sets-input">Sets:</label>
            <input
              id="item-sets-input"
              type="number"
              data-testid="workout-item-sets-input"
              defaultValue={item.sets}
              onChange={debounce(handleInputSetsChange, DEBOUNCE_TIME).debouncedFunc}
            />
          </div>

          <div className="workout-edit__form__input-container">
            <label htmlFor="item-rest-input">Rest (in sec):</label>
            <input
              id="item-rest-input"
              type="number"
              data-testid="workout-item-rest-input"
              defaultValue={item.restInSec}
              onChange={debounce(handleInputRestInSecChange, DEBOUNCE_TIME).debouncedFunc}
            />
          </div>
        </>
      )}

      {item.type === "anaerobic" && (
        <>
          <div className="workout-edit__form__input-container">
            <label htmlFor="item-reps-input">reps:</label>
            <input
              id="item-reps-input"
              type="number"
              data-testid="workout-item-reps-input"
              defaultValue={item.reps}
              onChange={debounce(handleInputRepsChange, DEBOUNCE_TIME).debouncedFunc}
            />
          </div>

          {(item.weightUnit === "kg" || item.weightUnit === "lbs") && (
            <div className="workout-edit__form__input-container">
              <label htmlFor="item-weight-input">weight:</label>
              <input
                id="item-weight-input"
                type="number"
                data-testid="workout-item-weight-input"
                defaultValue={item.weight}
                onChange={debounce(handleInputWeightChange, DEBOUNCE_TIME).debouncedFunc}
              />
            </div>
          )}

          <div className="workout-edit__form__input-container">
            <label>weight unit:</label>

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
        <div className="workout-edit__form__superset-item-list" data-testid="superset-item-list">
          {item.items.map((supersetItem, i) => (
            <div className="workout-edit__form__superset-item-container" key={i}>
              <h3>Item {i + 1}</h3>
              <div className="workout-edit__form__input-container">
                <label>name:</label>
                <input
                  id={supersetItem.id}
                  type="text"
                  data-testid="superset-item-name-input"
                  defaultValue={supersetItem.name}
                  onChange={debounce(handleInputItemNameChange, DEBOUNCE_TIME).debouncedFunc}
                />
              </div>
              <div className="workout-edit__form__input-container">
                <label>reps:</label>
                <input
                  id={supersetItem.id}
                  type="number"
                  data-testid="superset-item-reps-input"
                  defaultValue={supersetItem.reps}
                  onChange={debounce(handleInputItemRepsChange, DEBOUNCE_TIME).debouncedFunc}
                />
              </div>

              {(supersetItem.weightUnit === "kg" || supersetItem.weightUnit === "lbs") && (
                <div className="workout-edit__form__input-container">
                  <label>weight:</label>
                  <input
                    id={supersetItem.id}
                    type="number"
                    data-testid="superset-item-weight-input"
                    defaultValue={supersetItem.weight}
                    onChange={debounce(handleInputItemWeightChange, DEBOUNCE_TIME).debouncedFunc}
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
                  dataTestId="delete-superset-item-btn"
                >
                  delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="workout-edit__form__input-container__btns-container">
        <Button
          className="btn"
          onClickFn={handleRemoveBtnClick}
          dataTestId="delete-workout-item-btn"
        >
          delete
        </Button>

        {item.type === "superset" && (
          <Button
            className="btn workout-edit__btn"
            onClickFn={() => addWorkoutItemToSuperset(item)}
            dataTestId="add-superset-item-btn"
          >
            add item
          </Button>
        )}
      </div>
    </section>
  );
};
