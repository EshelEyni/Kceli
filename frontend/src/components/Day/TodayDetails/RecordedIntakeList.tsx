import { FC } from "react";
import { useTodayData } from "../../../contexts/TodayDataContext";
import { List } from "../../App/List/List";
import { ListItemTitle } from "../../Titles/ListItem/ListItemTitle";
import { IntakePreview } from "../../Intake/IntakePreview/IntakePreview";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";

export const RecordedIntakeList: FC = () => {
  const { recordedIntakes } = useTodayData();

  return (
    <List
      className="intake-list"
      items={recordedIntakes}
      render={(item, i) => (
        <div className="intake-preview-container" key={item.id}>
          <ListItemTitle
            idx={i}
            title={`Intake ${
              item.name ? `- ${item.name}` : ""
            } - Total Calories: ${calorieUtilService.getTotalCalories(item)}`}
            className="intake-list-item-title"
          />
          <IntakePreview intake={item} />
        </div>
      )}
    />
  );
};
