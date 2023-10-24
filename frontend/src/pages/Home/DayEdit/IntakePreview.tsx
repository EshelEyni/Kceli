import { FC } from "react";
import { Intake } from "../../../../../shared/types/intake";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/App/Button/Button";

import "./IntakePreview.scss";
import { ToggledElement, useDayEdit } from "./DayEditContext";
import { createId } from "../../../services/util/utilService";

type IntakePreviewProps = {
  intake: Intake;
};

export const IntakePreview: FC<IntakePreviewProps> = ({ intake }) => {
  const { dailyData, openedElement, setOpenedElement, setIntake, updateDailyData } = useDayEdit();
  const isRecordedIntakesShown = openedElement === ToggledElement.IntakeList;

  const totalCalories = calorieUtilService.getTotalCalories(intake);

  function handleDeleteBtnClick(intakeId: string) {
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    dataToUpdate.intakes = dailyData.intakes.filter(intake => intake.id !== intakeId);
    updateDailyData(dataToUpdate);
  }

  function handleEditBtnClick(intake: Intake) {
    if (!dailyData) return;
    const intakeToEdit = { ...intake };
    setIntake(intakeToEdit);
    setOpenedElement(ToggledElement.IntakeEdit);
  }

  function handleDuplicateBtnClick(intake: Intake) {
    if (!dailyData) return;
    const intakeToSave = { ...intake };
    intakeToSave.id = createId();
    intakeToSave.recordedAt = new Date();
    updateDailyData({ ...dailyData, intakes: [...dailyData.intakes, intakeToSave] });
  }

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

  return (
    <section className="intake-preview" data-testid="intake-preview">
      <ol className="intake-preview__item-list">
        {intake.items.map(item => (
          <li
            className="intake-preview__item-list__item"
            data-testid="intake-preview-item"
            key={item.id}
          >
            {`${item.name} - ${item.quantity} ${item.unit} - caolries: ${Math.round(
              item.calories
            )}`}
          </li>
        ))}
      </ol>

      <p className="intake-preview__total-calories">total calories: {totalCalories}</p>

      <div className="intake-preview__btns-container">
        <Modal>
          <Modal.OpenBtn modalName="delete-intake">
            <button className="btn">Delete</button>
          </Modal.OpenBtn>
          <Modal.Window
            name="delete-intake"
            className="delete-intake-modal"
            style={{ top: window.scrollY + 100 }}
          >
            <h2>Are you sure you want to delete this intake?</h2>
            <Modal.CloseBtn onClickFn={() => handleDeleteBtnClick(intake.id)}>
              <button className="btn delete-btn">Delete</button>
            </Modal.CloseBtn>
            <Modal.CloseBtn>
              <button className="btn">Cancel</button>
            </Modal.CloseBtn>
          </Modal.Window>
        </Modal>
        {isRecordedIntakesShown && (
          <>
            <Button className="btn" onClickFn={() => handleEditBtnClick(intake)}>
              Edit
            </Button>
            <Button className="btn" onClickFn={() => handleDuplicateBtnClick(intake)}>
              duplicate
            </Button>
          </>
        )}
        {!isRecordedIntakesShown && (
          <Button className="btn" onClickFn={() => handleSaveBtnClick(intake.id)}>
            Save
          </Button>
        )}
      </div>
    </section>
  );
};
