import { FC } from "react";
import { useWorkouts } from "../WorkoutsContext";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { Workout } from "../../../../../shared/types/workout";
import { WorkoutPreview } from "../../../components/Workout/WorkoutPreview/WorkoutPreview";
import { Empty } from "../../../components/App/Empty/Empty";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import { StrictModeDroppable } from "../../../components/App/StrictModeDroppable/StrictModeDroppable";
import { Draggable } from "react-beautiful-dnd";
import "./WorkoutList.scss";

export const WorkoutList: FC<{
  filter?: "all" | "anaerobic" | "aerobic";
  onSchedule?: (workout: Workout, day: string) => void;
  isSavingSchedule?: boolean;
}> = ({ filter = "all", onSchedule, isSavingSchedule }) => {
  const { workouts, isLoading, isSuccess, isError, isEmpty } = useWorkouts();

  return (
    <div className="workout-list-container" data-testid="workout-list">
      {isLoading && <SpinnerLoader />}
      {isSuccess && !isEmpty && (
        <StrictModeDroppable droppableId="workout-list" direction="horizontal">
          {provided => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="workout-list">
              {(workouts as Workout[])
                .filter(workout => filter === "all" || workout.type === filter)
                .map((workout, index) => {
                  const draggableId = `workout-list-workout-${workout.id}-index-${index}`;
                  return (
                    <Draggable key={workout.id + index} draggableId={draggableId} index={index}>
                      {provided => (
                        <li
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{ ...provided.draggableProps.style }}
                          className="workout-list__item"
                        >
                          <button
                            {...provided.dragHandleProps}
                            className="ui-drag-handle"
                            aria-label={`Drag ${workout.description || "routine"} to a weekday`}
                          >
                            ⠿
                          </button>
                          <WorkoutPreview
                            workout={workout}
                            onSchedule={onSchedule}
                            isSavingSchedule={isSavingSchedule}
                          />
                        </li>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      )}
      {isSuccess && isEmpty && <Empty entityName="workouts" />}
      {isSuccess &&
        !isEmpty &&
        filter !== "all" &&
        !workouts?.some(workout => workout.type === filter) && (
          <p className="ui-empty">
            No {filter === "aerobic" ? "cardio" : "strength"} routines yet. Create one to get
            started.
          </p>
        )}
      {isError && <ErrorMsg msg="Couldn't get workouts. Please try again later" />}
    </div>
  );
};
