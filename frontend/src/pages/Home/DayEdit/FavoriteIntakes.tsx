import { FC, useState } from "react";
import { useDayEdit } from "./DayEditContext";
import { IntakePreview } from "./IntakePreview";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  DropResult,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { StrictModeDroppable } from "../../../components/App/StrictModeDroppable/StrictModeDroppable";
import "./FavoriteIntakes.scss";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { Empty } from "../../../components/App/Empty/Empty";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import { FavoriteIntake } from "../../../../../shared/types/intake";
import { useUpdateFavoriteIntake } from "../../../hooks/useUpdateFavoriteIntake";

export const FavoriteIntakes: FC = () => {
  const {
    favoriteIntakes,
    isErrorFavoriteIntakes: isError,
    isLoadingFavoriteIntakes: isLoading,
    isSuccessFavoriteIntakes: isSuccess,
    isEmptyFavoriteIntakes: isEmpty,
  } = useDayEdit();

  const { updateFavoriteIntake } = useUpdateFavoriteIntake();

  const [sortedIntakes, setSortedIntakes] = useState(_sortIntakes(favoriteIntakes));

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

  function onDragEnd(result: DropResult) {
    if (!result.destination || !sortedIntakes) return;

    const reorder = (list: FavoriteIntake[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const newItems = reorder(sortedIntakes, result.source.index, result.destination.index);
    setSortedIntakes(newItems as FavoriteIntake[]);
    const intakeToUpdate = { ...(newItems[result.destination.index] as FavoriteIntake) };
    intakeToUpdate.sortOrder = result.destination.index;
    updateFavoriteIntake(intakeToUpdate);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (!favoriteIntakes) return setSortedIntakes(_sortIntakes(favoriteIntakes));
    const searchedIntakes = favoriteIntakes?.filter(
      intake =>
        intake.name.toLowerCase().includes(value.toLowerCase()) ||
        intake.items.some(item => item.name.toLowerCase().includes(value.toLowerCase()))
    ) as FavoriteIntake[];
    setSortedIntakes(searchedIntakes);
  }

  return (
    <section className="day-edit__favorite-intakes" data-testid="day-edit-favorite-intakes">
      <input
        type="text"
        className="day-edit__favorite-intakes__input"
        autoComplete="off"
        placeholder="Search..."
        onChange={handleInputChange}
      />

      {isLoading && <SpinnerLoader />}
      {isSuccess && !isEmpty && (
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="droppable">
            {provided => (
              <ul
                className="list day-edit__favorite-intakes__list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {(sortedIntakes as FavoriteIntake[]).map((intake, index) => (
                  <Draggable key={intake.id} draggableId={intake.id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        className="day-edit__favorite-intakes__list__item"
                      >
                        <IntakePreview intake={intake} isFavorite={true} />
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
      {isSuccess && isEmpty && <Empty entityName={"favorite intake"} />}

      {isError && <ErrorMsg msg="Couldn't get favorite intake. Please try again later." />}
    </section>
  );
};

function _sortIntakes(intakes: FavoriteIntake[] | undefined): FavoriteIntake[] {
  if (!intakes) return [];
  return intakes?.sort((a: FavoriteIntake, b: FavoriteIntake) => a.sortOrder - b.sortOrder);
}
