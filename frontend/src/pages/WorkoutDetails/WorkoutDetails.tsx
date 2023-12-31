import { FC } from "react";
import { useWorkout } from "./WorkoutContext";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import "./WorkoutDetails.scss";
import { List } from "../../components/App/List/List";
import { Timer } from "./Timer/Timer";
import { Button } from "../../components/App/Button/Button";
import { WorkoutItemDisplay } from "./WorkoutItemDisplay";
import { usePageLoaded } from "../../hooks/usePageLoaded";

const WorkoutDetails: FC = () => {
  usePageLoaded({ title: "Workout / Kceli" });
  const {
    workout,
    unCompletedItems,
    completedItems,
    isLoading,
    isSuccess,
    isError,
    duration,
    isWorkoutStarted,
    isLoadingUpdateDailyData,
    onStart,
  } = useWorkout();

  if (isError) return <ErrorMsg />;
  if (!isSuccess || !workout) return null;

  return (
    <main className="page workout-details" data-testid="workout-details">
      {(isLoading || isLoadingUpdateDailyData) && (
        <SpinnerLoader containerSize={{ height: "100px" }} />
      )}
      {isError && <ErrorMsg />}
      {isSuccess && !workout && <ErrorMsg msg="Workout not found" />}
      {isSuccess && workout && (
        <div className="workout-details__wrapper">
          <section className="workout-details__info">
            <div className="workout-details__info__item">
              <h2>description:</h2>
              <h3> {workout.description}</h3>
            </div>
            <div className="workout-details__info__item">
              <h2>duration: </h2>
              <h3>{duration} min</h3>
            </div>
            <div className="workout-details__info__item">
              <h2>type: </h2>
              <h3>{workout.type}</h3>
            </div>
            {"split" in workout && (
              <div className="workout-details__info__item">
                <h2>split: </h2> <h3>{workout.split}</h3>
              </div>
            )}

            {!isWorkoutStarted && <Button onClickFn={onStart}>Start</Button>}
          </section>

          {!isWorkoutStarted && (
            <>
              <h2 className="workout-details__title">items:</h2>
              <List
                items={workout.items}
                className="workout-details__list"
                render={item => <WorkoutItemDisplay item={item} key={item.id} />}
                dataTestId="workout-items-list"
              />
            </>
          )}

          {isWorkoutStarted && (
            <>
              <Timer />
              <List
                items={unCompletedItems}
                className="workout-details__list"
                render={item => <WorkoutItemDisplay item={item} key={item.id} />}
                dataTestId="workout-uncompleted-items-list"
              />
              {completedItems.length > 0 && (
                <div className="workout-details__completed-list-container">
                  <h2 className="workout-details__completed-list-container__title">
                    Completed Items:
                  </h2>
                  <hr className="workout-details__completed-list-container__hr" />
                  <List
                    items={completedItems}
                    className="workout-details__list"
                    render={item => <WorkoutItemDisplay item={item} key={item.id} />}
                    dataTestId="workout-completed-items-list"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
};

export default WorkoutDetails;
