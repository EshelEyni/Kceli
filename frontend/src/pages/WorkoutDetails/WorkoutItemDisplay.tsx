import { FC } from "react";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";
import { useWorkout } from "./WorkoutContext";
import { Button } from "../../components/App/Button/Button";
import workoutUtilService from "../../services/workout/workoutUtilService";
import "./WorkoutItemDisplay.scss";

type WorkoutItemDisplayProps = {
  item: CombinedWorkoutItem;
};

export const WorkoutItemDisplay: FC<WorkoutItemDisplayProps> = ({ item }) => {
  const { currItem, setCurrItem, isWorkoutStarted, onStartItem, onCompleteItem } = useWorkout();
  const isCurrentItem = currItem?.id === item.id;

  function handleDisplayItemClicked() {
    if (isCurrentItem) setCurrItem(null);
    else setCurrItem(item);
  }

  function renderButtons() {
    if (!isCurrentItem || !isWorkoutStarted) return null;

    return (
      <div
        className="workout-item-display__btns-container"
        data-testid="workout-item-display-btns-container"
      >
        {!item.isStarted && (
          <Button
            className="workout-item-display__btn"
            isDisabled={!isWorkoutStarted}
            onClickFn={() => onStartItem(item)}
          >
            start
          </Button>
        )}
        {item.isStarted && !item.isCompleted && (
          <Button
            className="workout-item-display__btn"
            isDisabled={!isWorkoutStarted}
            onClickFn={() => onCompleteItem(item)}
          >
            complete
          </Button>
        )}
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
