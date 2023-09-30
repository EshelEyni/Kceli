import { FC } from "react";
import { WorkoutItemSuperset } from "../../../../shared/types/workout";
import { useWorkout } from "../../contexts/WorkoutContex";
import workoutUtilService from "../../services/workout/workoutUtilService";
import classNames from "classnames";
import { Button } from "../../components/App/Button/Button";
import { List } from "../../components/App/List/List";
import { AnaerobicWorkoutItemDisplay } from "./AnaerobicWorkoutItemDisplay";

type SupersetWorkoutItemDisplayProps = {
  item: WorkoutItemSuperset;
};

export const SupersetWorkoutItemDisplay: FC<SupersetWorkoutItemDisplayProps> = ({ item }) => {
  const { isWorkoutStarted, onStartItem } = useWorkout();
  const duration = workoutUtilService.calcDurationForSupersetItem(item);
  const isItemsListShown = item.isStarted && !item.isCompleted;
  const infoItem = [
    { title: "name:", value: item.name },
    { title: "duration:", value: duration },
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

          {isItemsListShown && (
            <List
              items={item.items}
              isOrdered={true}
              className="workout-item-display__set-display__list"
              render={item => <AnaerobicWorkoutItemDisplay item={item} key={item.id} />}
            />
          )}
        </>
      )}
    </section>
  );
};
