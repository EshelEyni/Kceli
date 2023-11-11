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
  const { currItem, isWorkoutStarted, onStartItem, onCompleteItem } = useWorkout();
  const isCurrentItem = currItem?.id === item.id;

  const renderButtons = () => {
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
  };

  const renderSupersetSetList = () => {
    if (item.type !== "superset") return null;

    return (
      <ul
        className="workout-item-display__info__superset-set-list"
        data-testid="workout-item-display-info-superset-set-list"
      >
        {item.items.map((subItem, index) => (
          <li className="workout-item-display__info__superset-set-list__item" key={index}>
            {`${subItem.name} - ${subItem.reps} reps - ${subItem.weight} ${subItem.weightUnit}`}
          </li>
        ))}
      </ul>
    );
  };

  const getItemTitle = () => {
    const basicTitle = `${item.name} - ${workoutUtilService.calcItemDuration(item)} min`;

    switch (item.type) {
      case "anaerobic":
        return `${basicTitle} - ${item.sets} * ${item.reps} - ${item.weight} ${item.weightUnit} - ${item.restInSec}s rest`;
      case "superset":
        return `${basicTitle} - ${item.sets} sets - ${item.items.length} items - ${item.restInSec}s rest`;
      default:
        return basicTitle;
    }
  };

  return (
    <section className="workout-item-display">
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
