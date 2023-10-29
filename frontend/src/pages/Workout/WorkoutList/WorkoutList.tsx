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

export const WorkoutList: FC = () => {
  const { workouts, isLoading, isSuccess, isError, isEmpty } = useWorkouts();

  return (
    <>
      {isLoading && <SpinnerLoader />}
      {isSuccess && !isEmpty && (
        <StrictModeDroppable droppableId="workout-list" direction="horizontal">
          {provided => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="workout-list">
              {(workouts as Workout[]).map((workout, index) => (
                <Draggable key={workout.id} draggableId={workout.id} index={index}>
                  {provided => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      style={{ ...provided.draggableProps.style }}
                      className="workout-list__item"
                    >
                      <WorkoutPreview key={workout.id} workout={workout} />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </StrictModeDroppable>
      )}
      {isSuccess && isEmpty && <Empty entityName="workouts" />}
      {isError && <ErrorMsg msg="Couldn't get workouts. Please try again later" />}
    </>
  );
};
