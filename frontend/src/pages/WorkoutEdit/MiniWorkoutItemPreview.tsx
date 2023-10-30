import { FC } from "react";
import { useWorkoutEdit } from "../../contexts/WorkoutEditContext";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";
import "./MiniWorkoutItemPreview.scss";
import { FaChevronDown } from "react-icons/fa";

type MiniWorkoutItemPreviewProps = {
  item: CombinedWorkoutItem;
};

export const MiniWorkoutItemPreview: FC<MiniWorkoutItemPreviewProps> = ({ item }) => {
  const { setCurrItemId } = useWorkoutEdit();

  return (
    <section className="mini-workout-item-preview" onClick={() => setCurrItemId(item.id)}>
      <span>{item.name}</span>
      <FaChevronDown className="mini-workout-item-preview__icon" />
    </section>
  );
};
