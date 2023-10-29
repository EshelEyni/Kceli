import { FC } from "react";
import { WorkoutDay as WorkoutDayType } from "../../../../../shared/types/user";
import { StrictModeDroppable } from "../../../components/App/StrictModeDroppable/StrictModeDroppable";
import { Draggable } from "react-beautiful-dnd";
import { useWorkouts } from "../WorkoutsContext";
import { RiCloseCircleLine } from "react-icons/ri";
import { updateLoggedInUser } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../types/app";
import "./WorkoutDayPreview.scss";

type WorkoutDayProps = {
  workoutDay: WorkoutDayType;
};

export const WorkoutDayPreview: FC<WorkoutDayProps> = ({ workoutDay }) => {
  const { loggedInUser, workouts } = useWorkouts();
  const dispatch: AppDispatch = useDispatch();

  function handleRemoveButtonClick(workoutId: string) {
    if (!loggedInUser || !workouts) return;
    const { workoutSchedule } = loggedInUser;
    const UpdatedWorkoutSchedule = workoutSchedule.map(workoutDay => {
      if (workoutDay.name !== workoutDay.name) return workoutDay;
      const newWorkouts = workoutDay.workouts.filter(workout => workout.id !== workoutId);
      return { ...workoutDay, workouts: newWorkouts };
    });
    dispatch(updateLoggedInUser({ ...loggedInUser, workoutSchedule: UpdatedWorkoutSchedule }));
  }

  return (
    <StrictModeDroppable droppableId={workoutDay.name} direction="vertical">
      {(provided, snapshot) => (
        <section
          className="workout-day"
          style={{ backgroundColor: snapshot.draggingOverWith ? "var(--color-success)" : "" }}
        >
          <h2 className="workout-day__name">{workoutDay.name}</h2>
          <ul {...provided.droppableProps} ref={provided.innerRef} className="workout-day__list">
            {workoutDay.workouts.map((workout, index) => (
              <Draggable key={workout.id} draggableId={workout.id} index={index}>
                {provided => (
                  <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{ ...provided.draggableProps.style }}
                    className="workout-day__list__item"
                  >
                    <span>{workout.description}</span>
                    <RiCloseCircleLine
                      size={18}
                      onClick={() => handleRemoveButtonClick(workout.id)}
                    />
                  </li>
                )}
              </Draggable>
            ))}
          </ul>
          {provided.placeholder}
        </section>
      )}
    </StrictModeDroppable>
  );
};
