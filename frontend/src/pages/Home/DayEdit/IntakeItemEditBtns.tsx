import { FC } from "react";
import { Button } from "../../../components/App/Button/Button";
import { useIntakeItemEdit } from "./IntakeItemEditContext";

export const IntakeItemEditBtns: FC = () => {
  const { isOneItem, handleAddButtonClick, handleRemoveButtonClick } = useIntakeItemEdit();

  return (
    <section className="intake-edit-item__btns-container" data-testid="intake-item-edit-btns">
      {!isOneItem && <Button onClickFn={handleRemoveButtonClick}>remove item</Button>}
      <Button onClickFn={handleAddButtonClick}>add item</Button>
    </section>
  );
};
