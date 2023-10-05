import { FC } from "react";
import { WorkoutItemSuperset } from "../../../../shared/types/workout";
import { useWorkout } from "../../contexts/WorkoutContex";
import workoutUtilService from "../../services/workout/workoutUtilService";
import classNames from "classnames";
import { Button } from "../../components/App/Button/Button";
import { List } from "../../components/App/List/List";

type SupersetWorkoutItemDisplayProps = {
  item: WorkoutItemSuperset;
};

export const SupersetWorkoutItemDisplay: FC<SupersetWorkoutItemDisplayProps> = ({ item }) => {
  const { isWorkoutStarted, onStartItem, onCompleteAnaerobicSet } = useWorkout();
  const duration = workoutUtilService.calcDurationForSupersetItem(item);

  const isSetListShown = item.isStarted && !item.isCompleted;

  const infoItem = [
    { title: "name:", value: item.name },
    { title: "duration:", value: duration },
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

          {isSetListShown && (
            <List
              items={item.sets}
              isOrdered={true}
              className="workout-item-display__set-display__list"
              render={(_, i) => {
                const firstUncompletedSetIndex = item.sets.findIndex(set => !set.isCompleted);
                const isStartBtnShown = firstUncompletedSetIndex === i;

                return (
                  <li className="workout-item-display__set-display supertest" key={i}>
                    <div className="workout-item-display__set-display__info superset">
                      <span className="set-num">set {i + 1}</span>

                      <div
                        className="superset-grid"
                        style={{ gridTemplateRows: `repeat(${item.items.length}, auto)` }}
                      >
                        {item.items.reduce((acc: JSX.Element[], item, idx) => {
                          return acc.concat([
                            <span key={`supsersetGridName${idx}`}>{item.name}</span>,
                            <span key={`supsersetGridDash1${idx}`}>-</span>,
                            <span key={`supsersetGridReps${idx}`}>reps: {item.reps}</span>,
                            <span key={`supsersetGridDash2${idx}`}>-</span>,
                            <span
                              key={`supsersetGridWeight${idx}`}
                            >{`weight: ${item.weight} ${item.weightUnit}`}</span>,
                          ]);
                        }, [])}
                      </div>
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