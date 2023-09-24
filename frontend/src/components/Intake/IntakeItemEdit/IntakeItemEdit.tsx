import { FC, useState } from "react";
import { NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";
import "./IntakeItemEdit.scss";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Button } from "../../App/Button/Button";
import { AiFillMinusCircle } from "react-icons/ai";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";

type IntakeItemEditProps = {
  intakeItem: NewIntakeItem;
  idx: number;
  handleChange: (intakeItem: NewIntakeItem, idx: number) => void;
};

export const IntakeItemEdit: FC<IntakeItemEditProps> = ({ intakeItem, idx, handleChange }) => {
  const [isInputNameEmpty, setIsInputNameEmpty] = useState(false);
  function handleQuantityInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value } = e.target;
    handleChange({ ...intakeItem, quantity: Number(value) }, idx);
  }

  function handleUnitInputClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    const currentUnitIdx = intakeUtilService.units.indexOf(intakeItem.unit);
    const unit =
      currentUnitIdx === intakeUtilService.units.length - 1
        ? intakeUtilService.units[0]
        : intakeUtilService.units[currentUnitIdx + 1];

    const quantity = intakeUtilService.getUnitDefaultQuantity(unit);
    handleChange({ ...intakeItem, unit, quantity }, idx);
  }

  function handleNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value: name } = e.target;
    handleChange({ ...intakeItem, name }, idx);
    setIsInputNameEmpty(!name.length);
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

  return (
    <section className="intake-item-edit">
      <div className="name-input-container">
        <label htmlFor="name" className="intake-item-label">
          name
        </label>
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

      <div className="quantity-input-container">
        <label htmlFor="quantity" className="intake-item-label">
          quantity
        </label>
        <div className="quantity-input-actions-container">
          <Button onClickFn={decreaseQuantity}>
            <AiFillMinusCircle />
          </Button>
          <input
            type="number"
            id="quantity"
            className="intake-item-input quantity-input"
            value={intakeItem.quantity}
            onChange={handleQuantityInputChange}
          />
          <Button onClickFn={increaseQuantity}>
            <BsFillPlusCircleFill />
          </Button>
        </div>
      </div>

      <div className="unit-toggle" onClick={handleUnitInputClick}>
        <span>{intakeItem.unit}</span>
      </div>
    </section>
  );
};
