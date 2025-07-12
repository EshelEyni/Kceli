import { FC } from "react";
import { Button } from "../../../components/App/Button/Button";
import { useIntakeItemEdit } from "./IntakeItemEditContext";

export const IntakeItemEditBtns: FC = () => {
  const { isOneItem, handleAddButtonClick, handleRemoveButtonClick, btnStyle } =
    useIntakeItemEdit();

  return (
    <section className="intake-edit-item__btns-container" data-testid="intake-item-edit-btns">
      {!isOneItem && (
        <Button style={btnStyle} onClickFn={handleRemoveButtonClick}>
          remove item
        </Button>
      )}
      <Button style={btnStyle} onClickFn={handleAddButtonClick}>
        add item
      </Button>
    </section>
  );
};
