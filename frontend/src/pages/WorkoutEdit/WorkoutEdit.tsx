import { FC, useEffect, useState } from "react";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { CombinedWorkoutItem, Workout } from "../../../../shared/types/workout";
import { Empty } from "../../components/App/Empty/Empty";
import { Button } from "../../components/App/Button/Button";
import { useWorkoutEdit } from "./WorkoutEditContext";
import { AppDispatch } from "../../types/app";
import { useDispatch } from "react-redux";
import { setGoBackBtnLink } from "../../store/slices/systemSlice";
import { Footer } from "../../components/App/Footer/Footer";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  DropResult,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "../../components/App/StrictModeDroppable/StrictModeDroppable";
import { WorkoutEditMainInputs } from "./WorkoutEditMainInputs";
import "./WorkoutEdit.scss";
import { WorkoutItemEdit } from "./WorkoutItemEdit";

const WorkoutEdit: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    workout,
    isLoading,
    isSuccess,
    isError,
    navigate,
    addWorkoutItem,
    updateWorkout,
    duration,
  } = useWorkoutEdit();

  const [workoutItems, setWorkoutItems] = useState<CombinedWorkoutItem[]>(workout?.items ?? []);

  const isItemsEmpty = workout?.items.length === 0;
  const isItemsListShown = isSuccess && !isItemsEmpty;

  function handleOpenBtnClick() {
    if (!workout) return;
    navigate(`/workouts/details/${workout.id}`);
  }

  function handleDescInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!workout) return;
    const description = e.target.value;
    const workoutToUpdate = { ...workout, description } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleTypeSelectChange(type: string) {
    if (!workout) return;
    const workoutToUpdate = { ...workout, type } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function handleSplitSelectChange(split: string) {
    if (!workout) return;
    const workoutToUpdate = { ...workout, split } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination || !workout) return;

    const reorder = (list: CombinedWorkoutItem[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const newItems = reorder(
      workout.items,
      result.source.index,
      result.destination.index
    ) as CombinedWorkoutItem[];

    setWorkoutItems(newItems);
    const workoutToUpdate = { ...workout, items: newItems } as Workout;
    updateWorkout(workoutToUpdate);
  }

  function getItemStyle(
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ) {
    return {
      background: isDragging ? "var(--color-warning)" : "",
      transform: isDragging ? "rotate(7deg)" : "",
      ...draggableStyle,
    };
  }

  useEffect(() => {
    dispatch(setGoBackBtnLink(true));

    return () => {
      dispatch(setGoBackBtnLink(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (!workout) return;
    setWorkoutItems(workout.items);
  }, [workout]);

  if (isLoading)
    return <SpinnerLoader withContainer={true} containerSize={{ width: "100%", height: "75vh" }} />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;
  if (!isSuccess || !workout) return null;

  return (
    <main className="page workout-edit" data-testid="workout-edit-page">
      <form className="workout-edit__form">
        <WorkoutEditMainInputs
          workout={workout}
          handleTypeSelectChange={handleTypeSelectChange}
          handleDescInputChange={handleDescInputChange}
          handleSplitSelectChange={handleSplitSelectChange}
        />

        <div className="workout-edit-page__duration-container">
          <h3>duration:</h3>
          <h4>{duration} minutes</h4>
        </div>

        <div className="workout-edit__form__btns">
          <Button className="btn workout-edit__btn" onClickFn={() => addWorkoutItem("aerobic")}>
            add cardio
          </Button>
          <Button className="btn workout-edit__btn" onClickFn={() => addWorkoutItem("anaerobic")}>
            add set
          </Button>
          <Button className="btn workout-edit__btn" onClickFn={() => addWorkoutItem("superset")}>
            add superset
          </Button>
        </div>

        {isItemsEmpty && <Empty entityName="exercises" />}
        {isItemsListShown && (
          <div
            className="workout-edit__items-list-container"
            data-testid="workout-edit-items-list-container"
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <StrictModeDroppable droppableId="droppable">
                {provided => (
                  <ul
                    className="workout-edit__items-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {workoutItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            className="workout-edit__items-list__item"
                          >
                            <WorkoutItemEdit item={item} />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </div>
        )}

        <Footer className="workout-edit__form__footer">
          <Button className="btn  workout-edit__btn-open" onClickFn={handleOpenBtnClick}>
            open
          </Button>
        </Footer>
      </form>
    </main>
  );
};

export default WorkoutEdit;
