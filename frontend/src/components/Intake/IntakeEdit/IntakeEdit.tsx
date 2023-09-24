import { FC, useState } from "react";
import { NewIntake, NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilServiceTest from "../../../services/intakeUtil/intakeUtilService";
import { List } from "../../App/List/List";
import { IntakeItemEdit } from "../IntakeItemEdit/IntakeItemEdit";
import { Button } from "../../App/Button/Button";
import { useTodayData } from "../../../contexts/TodayDataContext";
import "./IntakeEdit.scss";

export const IntakeEdit: FC = () => {
  const { dailyData, addIntake } = useTodayData();
  const [intake, setIntake] = useState<NewIntake>(intakeUtilServiceTest.getDefaultBasicIntake());

  function handleAddButtonClick() {
    setIntake(prev => ({
      ...prev,
      items: [...prev.items, intakeUtilServiceTest.getDefaultBasicIntakeItem()],
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
    addIntake({ todayDataId: dailyData.id, intakes: [...dailyData.intakes, intake] });
  }

  return (
    <form className="intake-edit" onSubmit={handleSubmit}>
      <input
        type="text"
        id="intake-name"
        className="input-intake-name"
        onChange={handleNameInputChange}
        placeholder="Name your intake!"
      />
      <List
        items={intake.items}
        render={(item: NewIntakeItem, i: number, arr: NewIntakeItem[]) => {
          if (i === arr.length - 1)
            return (
              <div className="last-intake-edit-item-container" key={i}>
                <IntakeItemEdit intakeItem={item} idx={i} handleChange={handleIntakeItemChange} />
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
      <Button onClickFn={e => handleSubmit(e)} type="submit">
        Add Intake
      </Button>
    </form>
  );
};
