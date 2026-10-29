import { t } from "../../../i18n";
import { FC } from "react";
import { Button } from "../../../components/App/Button/Button";
import { FaPlus, FaMinus } from "react-icons/fa6";
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
        <Button
          className="quantity-input-btn"
          onClickFn={decreaseQuantity}
          aria-label={t("Decrease quantity")}
        >
          <FaMinus />
        </Button>
        <input
          type="number"
          name="quantity"
          aria-label={t("Quantity")}
          className="intake-item-input quantity-input"
          value={intakeItem.quantity}
          onChange={handleInputChange}
        />
        <Button
          className="quantity-input-btn"
          onClickFn={increaseQuantity}
          aria-label={t("Increase quantity")}
        >
          <FaPlus />
        </Button>
      </div>

      <Button onClickFn={handleUnitBtnClick} className="intake-item-edit__btn">
        <span>{t(intakeItem.unit)}</span>
      </Button>

      <Button onClickFn={handleToggleManual} className="intake-item-edit__btn">
        <span>{isManual ? t("Manual") : t("Auto")}</span>
      </Button>
      <Button onClickFn={handleCalcBtnClick} className="intake-item-edit__btn calc-calories-btn">
        {isLoadingCal ? (
          <SpinnerLoader containerSize={{ width: "100%" }} />
        ) : (
          <span>{t("calc")}</span>
        )}
      </Button>
    </section>
  );
};
