import { FC } from "react";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";
import workoutUtilService from "../../services/workout/workoutUtilService";

type WorkoutItemDisplayInfoItemProps = {
  item: CombinedWorkoutItem;
};

export const WorkoutItemDisplayInfoItem: FC<WorkoutItemDisplayInfoItemProps> = ({ item }) => {
  const duration = workoutUtilService.calcItemDuration(item);

  const title = getTitle();

  function getTitle() {
    if (item.type === "anaerobic") {
      return `${item.name} - ${duration} min - ${item.sets} * ${item.reps} - ${item.weight} ${item.weightUnit} - ${item.restInSec}s rest`;
    }

    if (item.type === "superset") {
      return `${item.name} - ${duration} min - ${item.sets} sets - ${item.items.length} items - ${item.restInSec}s rest`;
    }

    return `${item.name} - ${duration} min`;
  }

  const infoItems: string[] = [item.name, "-", `${duration} min`];
  if (item.type === "anaerobic") {
    infoItems.push("-", `${item.sets} * ${item.reps}`, "-", `${item.weight} ${item.weightUnit}`);
  }

  const isSupersetSetListShown = item.type === "superset";

  return (
    <div className="workout-item-display__info">
      <h4 className="workout-item-display__info__title">{title}</h4>

      {isSupersetSetListShown && (
        <ul className="workout-item-display__info__superset-set-list">
          {item.items.map((item, index) => {
            const title = `${item.name} - ${item.reps} reps - ${item.weight} ${item.weightUnit}`;
            return (
              <li className="workout-item-display__info__superset-set-list__item" key={index}>
                {title}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
