import { FC, useEffect, useState } from "react";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { CombinedWorkoutItem, Workout } from "../../../../shared/types/workout";
import { Empty } from "../../components/App/Empty/Empty";
import { Button } from "../../components/App/Button/Button";
import { useWorkoutEdit } from "./WorkoutEditContext";
import { AerobicWorkoutItemEdit } from "./AerobicWorkoutItemEdit";
import { AnaerobicWorkoutItemEdit } from "./AnaerobicWorkoutItemEdit";
import { SuperSetWorkoutItemEdit } from "./SuperSetWorkoutItemEdit";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { AppDispatch } from "../../types/app";
import { useDispatch } from "react-redux";
import { setGoBackBtnLink } from "../../store/slices/systemSlice";
import "./WorkoutEdit.scss";
import { Footer } from "../../components/App/Footer/Footer";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  DropResult,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "../../components/App/StrictModeDroppable/StrictModeDroppable";
import { debounce } from "../../services/util/utilService";

const WorkoutEdit: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    workout,
    isLoading,
    isSuccess,
    isError,
    navigate,
    addWorkoutAerobicItem,
    addWorkoutAnaerobicItem,
    addSupersetWorkoutItem,
    updateWorkout,
    duration,
  } = useWorkoutEdit();

  const [workoutItems, setWorkoutItems] = useState<CombinedWorkoutItem[]>(workout?.items ?? []);
  const isAnaeobic = workout && workout?.type === "anaerobic";

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

  function renderItem(item: CombinedWorkoutItem) {
    switch (item.type) {
      case "aerobic":
        return <AerobicWorkoutItemEdit item={item} key={item.id} />;
      case "anaerobic":
        return <AnaerobicWorkoutItemEdit item={item} key={item.id} />;
      case "superset":
        return <SuperSetWorkoutItemEdit item={item} key={item.id} />;
    }
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
    <main className="page workout-edit">
      <form className="workout-edit__form">
        <div className="workout-edit__form__input-container name-input">
          <label>description:</label>
          <input
            type="text"
            defaultValue={workout.description}
            onChange={debounce(handleDescInputChange, 500).debouncedFunc}
          />
        </div>

        <div className="workout-edit__form__input-container">
          <label>workout type:</label>
          <Select.Root onValueChange={handleTypeSelectChange}>
            <Select.Trigger className="SelectTrigger">
              <Select.Value placeholder={workout.type} />
              <Select.Icon className="SelectIcon">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="SelectContent">
                <Select.Viewport className="SelectViewport">
                  <Select.Group>
                    <Select.Item value="anaerobic" className="SelectItem">
                      <Select.ItemText>anaerobic</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="aerobic" className="SelectItem">
                      <Select.ItemText>aerobic</Select.ItemText>
                    </Select.Item>
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {isAnaeobic && (
          <div className="workout-edit__form__input-container">
            <label>split:</label>
            <Select.Root onValueChange={handleSplitSelectChange}>
              <Select.Trigger className="SelectTrigger">
                <Select.Value placeholder={workout.split} />
                <Select.Icon className="SelectIcon">
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="SelectContent">
                  <Select.Viewport className="SelectViewport">
                    <Select.Group>
                      {workoutUtilService.SPLIT_TYPES.map(type => (
                        <Select.Item value={type} className="SelectItem" key={type}>
                          <Select.ItemText>{type}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        )}

        <div className="workout-edit-page__duration-container">
          <h3>duration:</h3>
          <h4>{duration} minutes</h4>
        </div>

        <div className="workout-edit__form__btns">
          <Button className="btn workout-edit__btn" onClickFn={addWorkoutAerobicItem}>
            add cardio
          </Button>
          <Button className="btn workout-edit__btn" onClickFn={addWorkoutAnaerobicItem}>
            add set
          </Button>
          <Button className="btn workout-edit__btn" onClickFn={addSupersetWorkoutItem}>
            add superset
          </Button>
        </div>

        {isItemsEmpty && <Empty entityName="exercises" />}
        {isItemsListShown && (
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
                          {renderItem(item)}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </StrictModeDroppable>
          </DragDropContext>
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
