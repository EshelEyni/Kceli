import { FC, useState } from "react";
import toast from "react-hot-toast";
import classnames from "classnames";
import { NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";
import { List } from "../../../components/App/List/List";
import { IntakeItemEdit } from "./IntakeItemEdit";
import { Button } from "../../../components/App/Button/Button";
import { useDayEdit } from "./DayEditContext";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { IntakeItemEditProvider } from "./IntakeItemEditContext";
import "./IntakeEdit.scss";

export const IntakeEdit: FC = () => {
  const {
    dailyData,
    isLoading,
    isLoadingUpdate,
    intake,
    updateDailyData,
    setIntake,
    backgroundColor,
  } = useDayEdit();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isEditShown = !isReviewOpen && !isLoading && !isLoadingUpdate;

  function handleSaveLaterButtonClick() {
    setIntake(prev => ({
      ...prev,
      recordedAt: null,
      isRecorded: false,
    }));
  }

  function handleToggleReview() {
    setIsReviewOpen(prev => !prev);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dailyData) return;
    const iValidIntake = intake.items.every(item => item.name.length && item.quantity > 0);
    if (!iValidIntake) return toast.error("Please fill all intake items");
    intake.recordedAt = new Date();
    const isNewIntake = !dailyData.intakes.some(i => i.id === intake.id);
    const updatedIntakes = isNewIntake
      ? [...dailyData.intakes, intake]
      : dailyData.intakes.map(i => (i.id === intake.id ? intake : i));
    updateDailyData({ ...dailyData, intakes: updatedIntakes });
    setIntake(intakeUtilService.getDefaultIntake());
  }

  return (
    <form className="intake-edit" onSubmit={handleSubmit} data-testid="intake-edit">
      {(isLoading || isLoadingUpdate) && (
        <SpinnerLoader withContainer={true} containerSize={{ height: "75px", width: "100%" }} />
      )}

      {isEditShown && (
        <List
          items={intake.items}
          render={(item: NewIntakeItem) => {
            return (
              <IntakeItemEditProvider intakeItem={item} key={item.id}>
                <IntakeItemEdit />
              </IntakeItemEditProvider>
            );
          }}
          className="intake-edit-item-list"
          dataTestId="intake-edit-item-list"
        />
      )}

      {isReviewOpen && (
        <List
          items={intake.items}
          render={(item, i) => (
            <div className="intake-edit-review-list__item" key={item.id}>
              <span>{`${i + 1})`}</span>
              <p>{`${item.name} - ${item.quantity} ${item.unit} ${
                item.calories ? `- Calories ${item.calories}` : ""
              }`}</p>
            </div>
          )}
          className="intake-edit-review-list"
          dataTestId="intake-edit-review-list"
        />
      )}

      <div className="intake-edit-btns-container" style={{ backgroundColor }}>
        <Button
          onClickFn={handleSaveLaterButtonClick}
          className={
            "intake-edit-btn btn-toggle-save-later" + classnames({ clicked: !intake.isRecorded })
          }
        >
          Save Later
        </Button>
        <Button onClickFn={handleToggleReview} className="intake-edit-btn">
          {isReviewOpen ? "Edit" : "Review"}
        </Button>
        <Button onClickFn={e => handleSubmit(e)} className="intake-edit-btn" type="submit">
          Save Intake
        </Button>
      </div>
    </form>
  );
};
