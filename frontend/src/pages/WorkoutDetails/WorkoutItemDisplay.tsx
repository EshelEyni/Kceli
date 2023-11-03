import { FC } from "react";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";
import { useWorkout } from "./WorkoutContext";
import { Button } from "../../components/App/Button/Button";
import "./WorkoutItemDisplay.scss";
import { WorkoutItemDisplayInfoItem } from "./WorkoutItemDisplayInfoItem";

type WorkoutItemDisplayProps = {
  item: CombinedWorkoutItem;
};

export const WorkoutItemDisplay: FC<WorkoutItemDisplayProps> = ({ item }) => {
  const { currItem, isWorkoutStarted, onStartItem, onCompleteItem } = useWorkout();
  const isCurrentItem = currItem?.id === item.id;
  const isBtnsShown = isCurrentItem && isWorkoutStarted;
  const isStartBtnShown = !item.isStarted;
  const isCompletedBtnShown = item.isStarted && !item.isCompleted;

  return (
    <section className="workout-item-display">
      <WorkoutItemDisplayInfoItem item={item} />

      {isBtnsShown && (
        <div className="workout-item-display__btns-container">
          {isStartBtnShown && (
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
              onClickFn={() => onCompleteItem(item)}
            >
              complete
            </Button>
          )}
        </div>
      )}
    </section>
  );
};
