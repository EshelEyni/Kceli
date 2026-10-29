import { t } from "../../../i18n";
import { FC } from "react";
import { WorkoutDay as WorkoutDayType } from "../../../../../shared/types/user";
import { StrictModeDroppable } from "../../../components/App/StrictModeDroppable/StrictModeDroppable";
import { Draggable } from "react-beautiful-dnd";
import "./WorkoutDayPreview.scss";

type WorkoutDayProps = {
  workoutDay: WorkoutDayType;
  onRemove?: (day: string, index: number) => void;
  isSaving?: boolean;
};

export const WorkoutDayPreview: FC<WorkoutDayProps> = ({ workoutDay, onRemove, isSaving }) => {
  return (
    <StrictModeDroppable droppableId={workoutDay.name} direction="vertical">
      {(provided, snapshot) => (
        <section
          className="workout-day"
          style={{ backgroundColor: snapshot.draggingOverWith ? "var(--color-success)" : "" }}
        >
          <h2 className="workout-day__name">{t(workoutDay.name)}</h2>
          <ul {...provided.droppableProps} ref={provided.innerRef} className="workout-day__list">
            {workoutDay.workouts.map((workout, index) => {
              const draggableId = `workday-${workoutDay.name}-workout-${workout.id}`;
              return (
                <Draggable key={workout.id + index} draggableId={draggableId} index={index}>
                  {provided => (
                    <li
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      className="workout-day__list__item"
                    >
                      <span {...provided.dragHandleProps}>{workout.description}</span>
                      {onRemove && (
                        <button
                          className="ui-remove-scheduled"
                          aria-label={t("Remove {{name}} from {{day}}", {
                            name: workout.description || t("Your routine"),
                            day: t(workoutDay.name),
                          })}
                          disabled={isSaving}
                          onClick={() => onRemove(workoutDay.name, index)}
                        >
                          ×
                        </button>
                      )}
                    </li>
                  )}
                </Draggable>
              );
            })}
          </ul>
          {provided.placeholder}
        </section>
      )}
    </StrictModeDroppable>
  );
};
