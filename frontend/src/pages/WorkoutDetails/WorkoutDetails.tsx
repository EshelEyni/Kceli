import { FC } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import "./WorkoutDetails.scss";
import { List } from "../../components/App/List/List";
import { AerobicWorkoutItemDisplay } from "./AerobicWorkoutItemDisplay";
import { CombinedWorkoutItem, WorkoutItemAerobic } from "../../../../shared/types/workout";
import { Timer } from "./Timer";
import { Button } from "../../components/App/Button/Button";
import { AnaerobicWorkoutItemDisplay } from "./AnaerobicWorkoutItemDisplay";
import { SupersetWorkoutItemDisplay } from "./SupersetWorkoutItemDisplay";

const WorkoutDetails: FC = () => {
  const { workout, isLoading, isSuccess, isError, duration, isWorkoutStarted, onStart } =
    useWorkout();

  if (isLoading) return <SpinnerLoader />;
  if (isError) return <ErrorMsg />;
  if (!isSuccess || !workout) return null;

  function renderItem(item: CombinedWorkoutItem) {
    switch (item.type) {
      case "aerobic":
        return <AerobicWorkoutItemDisplay item={item as WorkoutItemAerobic} key={item.id} />;
      case "anaerobic":
        return <AnaerobicWorkoutItemDisplay item={item} key={item.id} />;
      case "superset":
        return <SupersetWorkoutItemDisplay item={item} key={item.id} />;
    }
  }

  const unCompletedItems = workout.items.filter(item => !item.isCompleted);
  const completedItems = workout.items.filter(item => item.isCompleted);

  return (
    <main className="page workout-details">
      <Timer />
      {/* <section className="workout-details__info">
        <div className="workout-details__info__item">
          <h2>description:</h2>
          <h3> {workout.description}</h3>
        </div>
        <div className="workout-details__info__item">
          <h2>duration (in min): </h2>
          <h3>{duration}</h3>
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
      </section>

      {!isWorkoutStarted && (
        <>
          <Button onClickFn={onStart}>Start</Button>
          <List items={workout.items} className="workout-details__list" render={renderItem} />
        </>
      )}

      {isWorkoutStarted && (
        <>
          <Timer />
          <List items={unCompletedItems} className="workout-details__list" render={renderItem} />
          {completedItems.length > 0 && (
            <div className="workout-details__completed-list-container">
              <h2 className="workout-details__completed-list-container__title">Completed Items:</h2>
              <hr className="workout-details__completed-list-container__hr" />
              <List items={completedItems} className="workout-details__list" render={renderItem} />
            </div>
          )}
        </>
      )} */}
    </main>
  );
};

export default WorkoutDetails;
