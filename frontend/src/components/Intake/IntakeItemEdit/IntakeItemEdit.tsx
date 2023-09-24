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
  const [inputFaded, setInputFaded] = useState("");

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value, name } = e.target;
    switch (name) {
      case "name":
        handleChange({ ...intakeItem, name: value }, idx);
        setIsInputNameEmpty(!value.length);
        break;
      case "quantity":
        handleChange({ ...intakeItem, quantity: Number(value) }, idx);
        break;
      case "calories":
        handleChange({ ...intakeItem, calories: Number(value) }, idx);
        setInputFaded("caloriesPer100g");
        break;
      case "caloriesPer100g": {
        const caloriesPer100g = Number(value);
        const calories = caloriesPer100g * (intakeItem.quantity / 100);
        handleChange({ ...intakeItem, caloriesPer100g: Number(value), calories }, idx);
        setInputFaded("calories");
        break;
      }
      default:
        break;
    }
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
          name="name"
          className="intake-item-input"
          value={intakeItem.name}
          onChange={handleInputChange}
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
            name="quantity"
            className="intake-item-input quantity-input"
            value={intakeItem.quantity}
            onChange={handleInputChange}
          />
          <Button onClickFn={increaseQuantity}>
            <AiFillPlusCircle />
          </Button>
        </div>

        <div className="unit-toggle" onClick={handleUnitInputClick}>
          <span>{intakeItem.unit}</span>
        </div>

        <Button onClickFn={handleToggleManual} className="intake-item-edit__toggle-manual-btn">
          <span>{isManual ? "Manual" : "Auto"}</span>
        </Button>
      </div>

      {isManual && (
        <div className="intake-item-edit__manuall-calorie-edit">
          <input
            type="number"
            name="calories"
            className={"intake-item-input" + (inputFaded === "calories" ? " faded" : "")}
            value={intakeItem.calories || ""}
            placeholder="Calories"
            onChange={handleInputChange}
            onClick={() => setInputFaded("")}
          />
          <input
            type="number"
            name="caloriesPer100g"
            className={"intake-item-input" + (inputFaded === "caloriesPer100g" ? " faded" : "")}
            value={intakeItem.caloriesPer100g || ""}
            placeholder="Calories per 100g"
            onChange={handleInputChange}
            onClick={() => setInputFaded("")}
          />
        </div>
      )}
    </section>
  );
};
