import { FC } from "react";
import { WorkoutItemAerobic } from "../../../../shared/types/workout";
import { useWorkout } from "../../contexts/WorkoutContex";
import { Button } from "../../components/App/Button/Button";
import classNames from "classnames";

type AerobicWorkoutItemDisplayProps = {
  item: WorkoutItemAerobic;
};

export const AerobicWorkoutItemDisplay: FC<AerobicWorkoutItemDisplayProps> = ({ item }) => {
  const { isWorkoutStarted, onStartItem, onCompletedItem } = useWorkout();
  const isCompletedBtnShown = item.isStarted && !item.isCompleted;
  return (
    <section className="workout-item-display">
      <div
        className={classNames("workout-item-display__info", { "full-width": !isWorkoutStarted })}
      >
        <div className="workout-item-display__info__item">
          <h3>name:</h3>
          <h4>{item.name}</h4>
        </div>
        <div className="workout-item-display__info__item">
          <h3>duration:</h3>
          <h4>{item.durationInMin}</h4>
        </div>
      </div>

      {isWorkoutStarted && (
        <>
          {!item.isStarted && (
            <Button
              className="workout-item-display__btn"
              isDisabled={!isWorkoutStarted}
              onClickFn={() => onStartItem(item)}
            >
              start
            </Button>
          )}

          {isCompletedBtnShown && (
            <Button
              className="workout-item-display__btn"
              isDisabled={!isWorkoutStarted}
              onClickFn={() => onCompletedItem(item)}
            >
              complete
            </Button>
          )}
        </>
      )}
    </section>
  );
};
