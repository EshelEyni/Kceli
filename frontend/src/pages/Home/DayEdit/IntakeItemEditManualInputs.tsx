import { t } from "../../../i18n";
import { useIntakeItemEdit } from "./IntakeItemEditContext";

export const IntakeItemEditManualInputs = () => {
  const { intakeItem, handleInputChange } = useIntakeItemEdit();
  return <label>{t("Calories")}
    <input type="number" name="calories" aria-label={t("Calories")} required min="0" step="any"
      inputMode="decimal" className="intake-item-input" value={intakeItem.calories ?? ""}
      placeholder={t("Calories")} onChange={handleInputChange} />
  </label>;
};
