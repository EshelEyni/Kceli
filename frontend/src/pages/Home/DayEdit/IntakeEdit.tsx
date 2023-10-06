import { FC, useState } from "react";
import { NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilServiceTest from "../../../services/intakeUtil/intakeUtilService";
import { List } from "../../../components/App/List/List";
import { IntakeItemEdit } from "./IntakeItemEdit";
import { Button } from "../../../components/App/Button/Button";
import { useDayEdit } from "./DayEditContext";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";

export const IntakeEdit: FC = () => {
  const {
    dailyData,
    isLoading,
    isLoadingUpdate,
    intake,
    updateDailyData,
    setIntake,
    backgroundColor,
    // setCurrIsValidIntake,
  } = useDayEdit();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isEditShown = !isReviewOpen && !isLoading && !isLoadingUpdate;

  function handleAddButtonClick() {
    setIntake(prev => ({
      ...prev,
      items: [...prev.items, intakeUtilServiceTest.getDefaultIntakeItem()],
    }));
  }

  function handleRemoveButtonClick(index: number) {
    if (intake.items.length === 1) return;
    setIntake(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function handleSaveLaterButtonClick() {
    setIntake(prev => ({
      ...prev,
      recordedAt: prev.recordedAt ? null : new Date(),
      isRecorded: !prev.isRecorded,
    }));
  }

  function handleIntakeItemChange(intakeItem: NewIntakeItem, idx: number) {
    setIntake(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === idx ? intakeItem : item)),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dailyData) return;
    const iValidIntake = intake.items.every(item => item.name.length && item.quantity > 0);
    if (!iValidIntake) return;
    // TODO: Add Toast notification
    intake.recordedAt = new Date();
    const isNewIntake = !dailyData.intakes.some(i => i.id === intake.id);
    const updatedIntakes = isNewIntake
      ? [...dailyData.intakes, intake]
      : dailyData.intakes.map(currIntake => (currIntake.id === intake.id ? intake : currIntake));
    updateDailyData({ ...dailyData, intakes: updatedIntakes });
    setIntake(intakeUtilServiceTest.getDefaultIntake());
  }

  return (
    <form className="intake-edit" onSubmit={handleSubmit} data-testid="intake-edit">
      {isEditShown && (
        <>
          <div className="intake-edit__list-container">
            <List
              items={intake.items}
              render={(item: NewIntakeItem, i: number, arr: NewIntakeItem[]) => {
                if (i === arr.length - 1)
                  return (
                    <div className="last-intake-edit-item-container" key={i}>
                      <IntakeItemEdit
                        intakeItem={item}
                        idx={i}
                        handleChange={handleIntakeItemChange}
                      />
                      <div className="last-intake-edit-item__btn-container">
                        {arr.length > 1 && (
                          <Button onClickFn={() => handleRemoveButtonClick(i)}>remove item</Button>
                        )}
                        <Button onClickFn={handleAddButtonClick}>add item</Button>
                      </div>
                    </div>
                  );
                return (
                  <IntakeItemEdit
                    intakeItem={item}
                    idx={i}
                    key={i}
                    handleChange={handleIntakeItemChange}
                  />
                );
              }}
            />
          </div>
        </>
      )}
      {(isLoading || isLoadingUpdate) && (
        <SpinnerLoader withContainer={true} containerSize={{ height: "75px", width: "100%" }} />
      )}
      {isReviewOpen && (
        <>
          <List
            items={intake.items}
            render={(item, i) => (
              <p className="intake-edit-review-list__item">
                <span>{`${i + 1})`}</span>
                <p>{`${item.name} - ${item.quantity} ${item.unit} ${
                  item.calories ? `- Calories ${item.calories}` : ""
                }`}</p>
              </p>
            )}
            className="intake-edit-review-list"
          />
        </>
      )}
      <div className="intake-edit-btns-container" style={{ backgroundColor }}>
        <Button
          onClickFn={handleSaveLaterButtonClick}
          className={
            "intake-edit-btn btn-toggle-save-later" + (!intake.isRecorded ? " clicked" : "")
          }
        >
          Save Later
        </Button>
        <Button onClickFn={() => setIsReviewOpen(prev => !prev)} className="intake-edit-btn">
          {isReviewOpen ? "Edit" : "Review"}
        </Button>
        <Button onClickFn={e => handleSubmit(e)} className="intake-edit-btn" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};
