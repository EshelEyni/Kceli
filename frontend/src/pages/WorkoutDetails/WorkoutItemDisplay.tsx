import { FC, useState } from "react";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";
import { useWorkout } from "./WorkoutContext";
import { Button } from "../../components/App/Button/Button";
import workoutUtilService from "../../services/workout/workoutUtilService";
import classnames from "classnames";
import "./WorkoutItemDisplay.scss";

type WorkoutItemDisplayProps = {
  item: CombinedWorkoutItem;
};

export const WorkoutItemDisplay: FC<WorkoutItemDisplayProps> = ({ item }) => {
  const { currItem, setCurrItem, isWorkoutStarted, onCompleteItem, onResetTimer } = useWorkout();
  const [setNum, setSetNum] = useState<number | null>(item.type !== "aerobic" ? item.sets : null);
  const isCurrentItem = currItem?.id === item.id;

  function handleDisplayItemClicked() {
    if (isCurrentItem || item.isCompleted) return;
    else {
      setCurrItem(item);
      if (item.type === "aerobic") return;
      setSetNum(item.sets);
    }
  }

  function handleSetDisplayClicked() {
    if (item.type !== "anaerobic") return;

    setSetNum(prev => {
      if (prev === 0 || typeof prev !== "number") return prev;
      return prev - 1;
    });

    onResetTimer();
    if (setNum !== 1) return;
    onCompleteItem(item);
    setSetNum(null);
  }

  function renderButtons() {
    if (!isCurrentItem || !isWorkoutStarted || item.isCompleted) return null;

    return (
      <div
        className={
          "workout-item-display__btns-container " +
          classnames({ aerobic: currItem?.type === "aerobic" })
        }
        data-testid="workout-item-display-btns-container"
      >
        {currItem?.type !== "aerobic" && (
          <Button
            className="workout-item-display__btns-container__btn-set-num"
            isDisabled={!isWorkoutStarted}
            onClickFn={handleSetDisplayClicked}
          >
            <span>{setNum}</span>
          </Button>
        )}
        <Button
          className="workout-item-display__btns-container__btn"
          isDisabled={!isWorkoutStarted}
          onClickFn={() => onCompleteItem(item)}
        >
          complete
        </Button>
      </div>
    );
  }

  function renderSupersetSetList() {
    if (item.type !== "superset") return null;

    return (
      <ul
        className="workout-item-display__info__superset-set-list"
        data-testid="workout-item-display-info-superset-set-list"
      >
        {item.items.map((subItem, index) => {
          const isWeightShown = subItem.weightUnit === "kg" || subItem.weightUnit === "lbs";
          const weightStr = isWeightShown
            ? `${subItem.weight} ${subItem.weightUnit}`
            : subItem.weightUnit;

          return (
            <li className="workout-item-display__info__superset-set-list__item" key={index}>
              {`${subItem.name} - ${subItem.reps} reps - ${weightStr}`}
            </li>
          );
        })}
      </ul>
    );
  }

  function getItemTitle() {
    const basicTitle = `${item.name} - ${workoutUtilService.calcItemDuration(item)} min`;

    switch (item.type) {
      case "anaerobic": {
        const isWeightShown = item.weightUnit === "kg" || item.weightUnit === "lbs";
        const weightStr = isWeightShown ? `${item.weight} ${item.weightUnit}` : item.weightUnit;
        return `${basicTitle} - ${item.sets} * ${item.reps} - ${weightStr} - ${item.restInSec}s rest`;
      }
      case "superset":
        return `${basicTitle} - ${item.sets} sets - ${item.items.length} items - ${item.restInSec}s rest`;
      default:
        return basicTitle;
    }
  }

  return (
    <section className="workout-item-display" onClick={handleDisplayItemClicked}>
      <div className="workout-item-display__info" data-testid="workout-item-display-info">
        <h4
          className="workout-item-display__info__title"
          data-testid="workout-item-display-info-title"
        >
          {getItemTitle()}
        </h4>
        {renderSupersetSetList()}
      </div>
      {renderButtons()}
    </section>
  );
};
