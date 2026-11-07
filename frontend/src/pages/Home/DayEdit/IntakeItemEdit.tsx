import { t } from "../../../i18n";
import { useIntakeItemEdit } from "./IntakeItemEditContext";
import { IntakeItemEditManualInputs } from "./IntakeItemEditManualInputs";
import { IntakeItemEditInputName } from "./IntakeItemEditInputName";
import "./IntakeItemEdit.scss";

export const IntakeItemEdit = () => {
  const { isOneItem, handleRemoveButtonClick } = useIntakeItemEdit();
  return <section className="intake-item-edit" data-testid="intake-item-edit">
    <label>{t("Food name")}<IntakeItemEditInputName /></label>
    <IntakeItemEditManualInputs />
    {!isOneItem && <button type="button" className="intake-edit__manual-link" onClick={handleRemoveButtonClick}>{t("Remove")}</button>}
  </section>;
};
