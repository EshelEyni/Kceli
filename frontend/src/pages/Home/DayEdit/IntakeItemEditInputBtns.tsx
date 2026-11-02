import { t } from "../../../i18n";
import { FC } from "react";
import { Button } from "../../../components/App/Button/Button";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useIntakeItemEdit } from "./IntakeItemEditContext";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { NewIntakeItem } from "../../../../../shared/types/intake";
import "./IntakeItemEditInputBtns.scss";

export const IntakeItemEditInputBtns: FC = () => {
  const {
    intakeItem,
    isManual,
    isLoadingCal,
    handleInputChange,
    decreaseQuantity,
    increaseQuantity,
    handleUnitChange,
    handleToggleManual,
    handleCalcBtnClick,
  } = useIntakeItemEdit();
  return (
    <section
      className="intake-item-edit__inputs-btns meal-portion"
      data-testid="intake-item-edit-inputs-btns"
    >
      <div className="meal-portion__row">
        <div className="meal-field">
          <span>{t("Quantity")}</span>
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
              min="0.01"
              step="any"
              inputMode="decimal"
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
        </div>
        <label className="meal-field">
          <span>{t("Unit")}</span>
          <select
            value={intakeItem.unit}
            onChange={e => handleUnitChange(e.target.value as NewIntakeItem["unit"])}
          >
            {intakeUtilService.units.map(unit => (
              <option key={unit} value={unit}>
                {t(unit)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="meal-portion__calories">
        <Button
          onClickFn={handleCalcBtnClick}
          isDisabled={!intakeItem.name.trim() || isLoadingCal}
          className="intake-item-edit__btn calc-calories-btn"
        >
          {isLoadingCal ? t("Calculating…") : t("Estimate calories")}
        </Button>
        <label className="meal-manual-toggle">
          <input type="checkbox" checked={isManual} onChange={handleToggleManual} />
          {t("Enter calories manually")}
        </label>
      </div>
    </section>
  );
};
