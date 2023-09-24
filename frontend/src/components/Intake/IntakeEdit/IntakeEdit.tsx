import { FC, useState } from "react";
import { NewIntake, NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilServiceTest from "../../../services/intakeUtil/intakeUtilService";
import { List } from "../../App/List/List";
import { IntakeItemEdit } from "../IntakeItemEdit/IntakeItemEdit";
import { Button } from "../../App/Button/Button";
import { useTodayData } from "../../../contexts/TodayDataContext";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import "./IntakeEdit.scss";

export const IntakeEdit: FC = () => {
  const { dailyData, addIntake, isLoadingIntake, backgroundColor, setCurrIsValidIntake } =
    useTodayData();
  const [intake, setIntake] = useState<NewIntake>(intakeUtilServiceTest.getDefaultIntake());
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const isEditShown = !isReviewOpen && !isLoadingIntake;

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

  function handleNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value: name } = e.target;
    setIntake(prev => ({
      ...prev,
      name,
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
    if (!iValidIntake) return setCurrIsValidIntake(false);
    addIntake({ todayDataId: dailyData.id, intakes: [...dailyData.intakes, intake] });
    setIntake(intakeUtilServiceTest.getDefaultIntake());
  }

  return (
    <form className="intake-edit" onSubmit={handleSubmit}>
      {isEditShown && (
        <>
          <input
            type="text"
            id="intake-name"
            className="input-intake-name"
            onChange={handleNameInputChange}
            autoComplete="off"
            placeholder="Name your intake!"
          />
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
      {isLoadingIntake && (
        <SpinnerLoader withContainer={true} containerSize={{ height: "100%", width: "100%" }} />
      )}
      {isReviewOpen && (
        <>
          <h3 className="intake-edit-review-title">{intake.name}</h3>
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
          onClickFn={() => setIntake(prev => ({ ...prev, isRecorded: !prev.isRecorded }))}
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
          Add Intake
        </Button>
      </div>
    </form>
  );
};
