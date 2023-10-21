import { FC } from "react";
import { SpellingSuggestionList } from "./SpellingSuggestionList";
import { useIntakeItemEdit } from "./IntakeItemEditContext";
import "./IntakeItemEdit.scss";
import { IntakeItemEditManualInputs } from "./IntakeItemEditManualInputs";
import { IntakeItemEditInputBtns } from "./IntakeItemEditInputBtns";
import { IntakeItemEditBtns } from "./IntakeItemEditBtns";
import { IntakeItenEditInputName } from "./IntakeItenEditInputName";

export const IntakeItemEdit: FC = () => {
  const { isCurrIntakeItem, isManual, isSuggestionListShown } = useIntakeItemEdit();

  return (
    <section className="intake-item-edit">
      <IntakeItenEditInputName />
      {isSuggestionListShown && <SpellingSuggestionList />}
      <IntakeItemEditInputBtns />
      {isManual && <IntakeItemEditManualInputs />}
      {isCurrIntakeItem && <IntakeItemEditBtns />}
    </section>
  );
};
