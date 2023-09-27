import { FC } from "react";
import { List } from "../../App/List/List";
import { Button } from "../../App/Button/Button";
import { ToggledElement, useTodayData } from "../../../contexts/TodayDataContext";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { IntakePreview } from "../../Intake/IntakePreview/IntakePreview";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { Intake } from "../../../../../shared/types/intake";
import { getCleanTime } from "../../../services/util/utilService";

export const IntakeList: FC = () => {
  const {
    dailyData,
    unrecordedIntakes,
    recordedIntakes,
    openedElement,
    setOpenedElement,
    setIntake,
  } = useTodayData();
  const { updateDailyData, isLoading } = useUpdateTodayData();
  const isRecordedIntakesShown = openedElement === ToggledElement.IntakeList;
  const intakes = isRecordedIntakesShown ? recordedIntakes : unrecordedIntakes;

  function handleSaveBtnClick(intakeId: string) {
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    dataToUpdate.intakes = dailyData.intakes.map(intake => {
      if (intake.id === intakeId) {
        intake.isRecorded = true;
        intake.recordedAt = new Date();
      }
      return intake;
    });
    updateDailyData(dataToUpdate);
  }

  function handleEditBtnClick(intake: Intake) {
    if (!dailyData) return;
    const intakeToEdit = { ...intake };
    setIntake(intakeToEdit);
    setOpenedElement(ToggledElement.IntakeEdit);
  }

  function handleDeleteBtnClick(intakeId: string) {
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    dataToUpdate.intakes = dailyData.intakes.filter(intake => intake.id !== intakeId);
    updateDailyData(dataToUpdate);
  }

  return (
    <>
      {isLoading && <SpinnerLoader />}

      <List
        className="intake-list"
        items={intakes}
        render={(item, i) => (
          <li className="intake-preview-container" key={item.id}>
            <h5 className="intake-list-item-title">
              {`Intake ${i + 1}# ${item.name ? `- ${item.name}` : ""} ${
                item.recordedAt ? `- ${getCleanTime(item.recordedAt as unknown as string)}` : ""
              }`}
            </h5>
            <IntakePreview intake={item} />

            <p className="intake-preview__total-calories">{`Total Calories: ${calorieUtilService.getTotalCalories(
              item
            )}`}</p>

            <div className="intake-list__btns-container">
              <Button
                className="today-details__btn"
                onClickFn={() => handleDeleteBtnClick(item.id)}
              >
                Delete
              </Button>
              {isRecordedIntakesShown ? (
                <Button className="today-details__btn" onClickFn={() => handleEditBtnClick(item)}>
                  Edit
                </Button>
              ) : (
                <Button
                  className="today-details__btn"
                  onClickFn={() => handleSaveBtnClick(item.id)}
                >
                  Save
                </Button>
              )}
            </div>
          </li>
        )}
      />
    </>
  );
};
