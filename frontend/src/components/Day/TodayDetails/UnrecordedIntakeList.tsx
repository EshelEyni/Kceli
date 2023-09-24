import { FC } from "react";
import { List } from "../../App/List/List";
import { Button } from "../../App/Button/Button";
import { useTodayData } from "../../../contexts/TodayDataContext";
import { ListItemTitle } from "../../Titles/ListItem/ListItemTitle";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { IntakePreview } from "../../Intake/IntakePreview/IntakePreview";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";

export const UnrecordedIntakeList: FC = () => {
  const { dailyData, unrecordedIntakes } = useTodayData();
  const { updateDailyData, isLoading } = useUpdateTodayData();

  function handleSaveBtnClick(intakeId: string) {
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    dataToUpdate.intakes = dailyData.intakes.map(intake => {
      if (intake.id === intakeId) intake.isRecorded = true;
      return intake;
    });
    updateDailyData(dataToUpdate);
  }

  function handleDeleteBtnClick(intakeId: string) {
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    dataToUpdate.intakes = dailyData.intakes.filter(intake => intake.id !== intakeId);
    updateDailyData(dataToUpdate);
  }

  return isLoading ? (
    <SpinnerLoader />
  ) : (
    <List
      className="intake-list unrecorded-intake-list"
      items={unrecordedIntakes}
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
          <div className="unrecorded-intake-list__btns-container">
            <Button onClickFn={() => handleDeleteBtnClick(item.id)}>Delete</Button>
            <Button onClickFn={() => handleSaveBtnClick(item.id)}>Save</Button>
          </div>
        </div>
      )}
    />
  );
};
