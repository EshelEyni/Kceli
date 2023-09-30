import { FC } from "react";
import { WorkoutItemAnaerobic } from "../../../../shared/types/workout";
import { useWorkout } from "../../contexts/WorkoutContex";
import classNames from "classnames";
import { Button } from "../../components/App/Button/Button";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { List } from "../../components/App/List/List";

type AnaerobicWorkoutItemDisplayProps = {
  item: WorkoutItemAnaerobic;
};

export const AnaerobicWorkoutItemDisplay: FC<AnaerobicWorkoutItemDisplayProps> = ({ item }) => {
  const { isWorkoutStarted, onStartItem, onCompleteAnaerobicSet } = useWorkout();
  const duration = workoutUtilService.calcDurationForAnaerobicItem(item);
  const isSetListShown = item.isStarted && !item.isCompleted;

  const infoItem = [
    { title: "name:", value: item.name },
    { title: "sets:", value: item.sets },
    { title: "reps:", value: item.reps },
    { title: "weight:", value: `${item.weight} ${item.weightUnit}` },
    { title: "duration:", value: duration },
  ];

  return (
    <section className="workout-item-display">
      <div
        className={classNames("workout-item-display__info anaerobic", {
          "full-width": !isWorkoutStarted,
        })}
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

          {isSetListShown && (
            <List
              items={Array(item.sets).fill({})}
              isOrdered={true}
              className="workout-item-display__set-display__list"
              render={(_, i) => {
                const lastCompletedSetIndex = item.setCompletedStatus.findLastIndex(
                  s => s === true
                );
                const isStartBtnShown = lastCompletedSetIndex === i - 1;

                return (
                  <li className="workout-item-display__set-display" key={i}>
                    <div className="workout-item-display__set-display__info">
                      <span>set {i + 1}</span>
                    </div>

                    {isStartBtnShown && (
                      <Button
                        className="workout-item-display__btn"
                        isDisabled={!isWorkoutStarted}
                        onClickFn={() => onCompleteAnaerobicSet({ item, setIdx: i })}
                      >
                        completed
                      </Button>
                    )}
                  </li>
                );
              }}
            />
          )}
        </>
      )}
    </section>
  );
};
