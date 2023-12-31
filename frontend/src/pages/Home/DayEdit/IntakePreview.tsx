import { FC } from "react";
import { Intake } from "../../../../../shared/types/intake";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/App/Button/Button";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import { createId } from "../../../services/util/utilService";
import "./IntakePreview.scss";
import { useAddFavoriteIntake } from "../../../hooks/useAddFavoriteIntake";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { List } from "../../../components/App/List/List";
import { useDeleteFavoriteIntake } from "../../../hooks/useDeleteFavoriteIntake";
import toast from "react-hot-toast";

type IntakePreviewProps = {
  intake: Intake;
};

export const IntakePreview: FC<IntakePreviewProps> = ({ intake }) => {
  const { dailyData, openedTab, setOpenedTab, setIntake, updateDailyData, setCurrIntakeItemId } =
    useDayEdit();

  const { addFavoriteIntake, isLoading: isLoadingAddToFav } = useAddFavoriteIntake();
  const { removeFavoriteIntake } = useDeleteFavoriteIntake();

  const isRecordedIntakeShown = openedTab === DayEditTab.IntakeList;
  const isFavorite = openedTab === DayEditTab.FavoriteIntake;
  const isSaveBtnShown = !isRecordedIntakeShown || isFavorite;
  const totalCalories = calorieUtilService.getTotalCalories(intake);
  const favoriteIntakeTitle = isFavorite
    ? intake.name || intake.items.map(item => item.name).join(", ")
    : null;

  function handleDeleteBtnClick(intakeId: string) {
    if (isFavorite) return removeFavoriteIntake(intakeId);
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    const intakes = dailyData.intakes.filter(intake => intake.id !== intakeId);
    updateDailyData({ id: dataToUpdate.id, data: { intakes } });
    toast.success("Intake deleted successfully");
  }

  function handleEditBtnClick(intake: Intake) {
    if (!dailyData) return;
    const intakeToEdit = { ...intake };
    setIntake(intakeToEdit);
    setOpenedTab(DayEditTab.IntakeEdit);
    setCurrIntakeItemId(intake.items[0].id);
  }

  function handleDuplicateBtnClick(intake: Intake) {
    if (!dailyData) return;
    const intakeToSave = { ...intake };
    intakeToSave.id = createId();
    intakeToSave.recordedAt = new Date();
    const intakes = [...dailyData.intakes, intakeToSave];
    updateDailyData({ id: dailyData.id, data: { intakes } });
    toast.success("Intake duplicated successfully");
  }

  function handleSaveBtnClick(intakeId: string) {
    if (!dailyData) return;
    const dataToUpdate = { ...dailyData };
    let intakes = [...dailyData.intakes];
    if (isFavorite)
      intakes = [
        ...dailyData.intakes,
        { ...intake, id: createId(), isRecorded: true, recordedAt: new Date() },
      ];
    else {
      intakes = dailyData.intakes.map(intake => {
        if (intake.id !== intakeId) return intake;
        (intake.isRecorded = true), (intake.recordedAt = new Date());
        return intake;
      });
    }
    updateDailyData({ id: dataToUpdate.id, data: { intakes } });
    toast.success("Intake saved successfully");
  }

  function handleAddToFavBtnClick(intake: Intake) {
    addFavoriteIntake(intake);
  }

  if (isLoadingAddToFav) return <SpinnerLoader containerSize={{ height: "50px" }} />;

  return (
    <section className="intake-preview" data-testid="intake-preview">
      {favoriteIntakeTitle && (
        <h2 className="intake-preview__title" data-testid="intake-title">
          {favoriteIntakeTitle}
        </h2>
      )}
      <List
        items={intake.items}
        className="intake-preview__item-list"
        render={item => (
          <li
            className="intake-preview__item-list__item"
            data-testid="intake-preview-item"
            key={item.id}
          >
            {`${item.name} - ${item.quantity} ${item.unit} - calories: ${Math.round(
              item.calories
            )}`}
          </li>
        )}
      />

      <p className="intake-preview__total-calories">total calories: {totalCalories}</p>

      <div id="intake-preview-btns-container" className="intake-preview__btns-container">
        <Modal>
          <Modal.OpenBtn modalName="delete-intake">
            <button className="btn">Delete</button>
          </Modal.OpenBtn>
          <Modal.Window
            name="delete-intake"
            elementId="intake-preview-btns-container"
            className="delete-intake-modal"
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

        {(isFavorite || isRecordedIntakeShown) && (
          <Button className="btn" onClickFn={() => handleEditBtnClick(intake)}>
            Edit
          </Button>
        )}

        {isRecordedIntakeShown && (
          <Button className="btn" onClickFn={() => handleDuplicateBtnClick(intake)}>
            duplicate
          </Button>
        )}

        {isSaveBtnShown && (
          <Button className="btn" onClickFn={() => handleSaveBtnClick(intake.id)}>
            Save
          </Button>
        )}

        {!isFavorite && (
          <Button className="btn" onClickFn={() => handleAddToFavBtnClick(intake)}>
            add to fav
          </Button>
        )}
      </div>
    </section>
  );
};
