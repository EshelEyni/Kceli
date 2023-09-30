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

  const infoItem = [
    { title: "name:", value: item.name },
    { title: "duration:", value: item.durationInMin },
    { title: "type:", value: item.type },
  ];

  return (
    <section className="workout-item-display">
      <div
        className={classNames("workout-item-display__info", { "full-width": !isWorkoutStarted })}
      >
        {infoItem.map((item, index) => (
          <div className="workout-item-display__info__item" key={index}>
            <h3>{item.title}</h3>
            <h4>{item.value}</h4>
          </div>
        ))}
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
