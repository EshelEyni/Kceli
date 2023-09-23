import { FC } from "react";
import { NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";
import "./IntakeItemEdit.scss";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { Button } from "../../App/Button/Button";
import { AiFillMinusCircle } from "react-icons/ai";

type IntakeItemEditProps = {
  intakeItem: NewIntakeItem;
  idx: number;
  handleChange: (intakeItem: NewIntakeItem, idx: number) => void;
};

export const IntakeItemEdit: FC<IntakeItemEditProps> = ({ intakeItem, idx, handleChange }) => {
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
      <Button onClickFn={decreaseQuantity}>
        <AiFillMinusCircle />
      </Button>
      <label htmlFor="quantity">quantity</label>
      <input
        type="number"
        id="quantity"
        value={intakeItem.quantity}
        onChange={handleQuantityInputChange}
      />
      <Button onClickFn={increaseQuantity}>
        <BsFillPlusCircleFill />
      </Button>
      <div className="unit" onClick={handleUnitInputClick}>
        {intakeItem.unit}
      </div>
      <label htmlFor="name">Name</label>
      <input type="text" id="name" value={intakeItem.name} onChange={handleNameInputChange} />
    </section>
  );
};
