import { FC } from "react";
import { Button } from "../../../components/App/Button/Button";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { useIntakeItemEdit } from "./IntakeItemEditContext";
import "./IntakeItemEditInputBtns.scss";

export const IntakeItemEditInputBtns: FC = () => {
  const {
    intakeItem,
    isManual,
    isLoadingCal,
    handleInputChange,
    decreaseQuantity,
    increaseQuantity,
    handleUnitBtnClick,
    handleToggleManual,
    handleCalcBtnClick,
  } = useIntakeItemEdit();

  return (
    <section className="intake-item-edit__inputs-btns" data-testid="intake-item-edit-inputs-btns">
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

      <Button onClickFn={handleUnitBtnClick} className="intake-item-edit__btn">
        <span>{intakeItem.unit}</span>
      </Button>

      <Button onClickFn={handleToggleManual} className="intake-item-edit__btn">
        <span>{isManual ? "Manual" : "Auto"}</span>
      </Button>
      <Button onClickFn={handleCalcBtnClick} className="intake-item-edit__btn calc-calories-btn">
        {isLoadingCal ? (
          <SpinnerLoader withContainer={true} containerSize={{ width: "100%" }} />
        ) : (
          <span>calc</span>
        )}
      </Button>
    </section>
  );
};
