import { FC, useState } from "react";
import { MeasurementUnit, NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";
import "./IntakeItemEdit.scss";
import { Button } from "../../App/Button/Button";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";

type IntakeItemEditProps = {
  intakeItem: NewIntakeItem;
  idx: number;
  handleChange: (intakeItem: NewIntakeItem, idx: number) => void;
};

export const IntakeItemEdit: FC<IntakeItemEditProps> = ({ intakeItem, idx, handleChange }) => {
  const [isInputNameEmpty, setIsInputNameEmpty] = useState(false);
  const [isManual, setIsManual] = useState(false);

  function handleNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value: name } = e.target;
    handleChange({ ...intakeItem, name }, idx);
    setIsInputNameEmpty(!name.length);
  }

  function handleQuantityInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    handleChange({ ...intakeItem, quantity: Number(value) }, idx);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value, name } = e.target;
    console.log(value, name);
    // handleChange({ ...intakeItem, name: value }, idx);
  }

  function decreaseQuantity() {
    const step = intakeUtilService.getQuantityStepPerUnit(intakeItem.unit);
    if (intakeItem.quantity - step < 1) return;
    handleChange({ ...intakeItem, quantity: intakeItem.quantity - step }, idx);
  }

  function increaseQuantity() {
    const step = intakeUtilService.getQuantityStepPerUnit(intakeItem.unit);
    handleChange({ ...intakeItem, quantity: intakeItem.quantity + step }, idx);
  }

  function handleUnitInputClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    if (isManual) return;
    const currentUnitIdx = intakeUtilService.units.indexOf(intakeItem.unit);
    const unit =
      currentUnitIdx === intakeUtilService.units.length - 1
        ? intakeUtilService.units[0]
        : intakeUtilService.units[currentUnitIdx + 1];

    const quantity = intakeUtilService.getUnitDefaultQuantity(unit);
    handleChange({ ...intakeItem, unit, quantity }, idx);
  }

  function handleToggleManual() {
    setIsManual(prev => !prev);
    handleChange({ ...intakeItem, unit: MeasurementUnit.GRAM }, idx);
  }

  return (
    <section className="intake-item-edit">
      <div className="name-input-container">
        <input
          type="text"
          id="name"
          className="intake-item-input"
          value={intakeItem.name}
          onChange={handleNameInputChange}
          spellCheck={true}
          placeholder="Enter food name"
        />
      </div>
      {isInputNameEmpty && (
        <div onClick={() => setIsInputNameEmpty(false)}>
          <ErrorMsg msg="Intake name cannot be empty" />
        </div>
      )}

      <div className="intake-item-edit-inputs-container">
        <div className="quantity-input-container">
          <Button onClickFn={decreaseQuantity}>
            <AiFillMinusCircle />
          </Button>
          <input
            type="number"
            className="intake-item-input quantity-input"
            value={intakeItem.quantity}
            onChange={handleQuantityInputChange}
          />
          <Button onClickFn={increaseQuantity}>
            <AiFillPlusCircle />
          </Button>
        </div>

        <div className="unit-toggle" onClick={handleUnitInputClick}>
          <span>{intakeItem.unit}</span>
        </div>

        <Button onClickFn={handleToggleManual} className="intake-item-edit__toggle-manual-btn">
          <span>{isManual ? "Auto" : "Manual"}</span>
        </Button>
      </div>

      {isManual && (
        <div className="intake-item-edit__manuall-calorie-edit">
          <input
            type="number"
            className="intake-item-input quantity-input"
            value={intakeItem.calories}
            placeholder="Calories"
            onChange={handleInputChange}
          />
          <input
            type="number"
            className="intake-item-input quantity-input"
            value={intakeItem.caloriesPer100g}
            placeholder="Calories per 100g"
            onChange={handleInputChange}
          />
        </div>
      )}
    </section>
  );
};
