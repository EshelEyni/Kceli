import { FC } from "react";
import { useIntakeItemEdit } from "./IntakeItemEditContext";

export const IntakeItenEditInputName: FC = () => {
  const { intakeItem, handleNameInputClick, handleInputChange } = useIntakeItemEdit();

  return (
    <input
      type="text"
      name="name"
      className="intake-item-input"
      value={intakeItem.name}
      onChange={handleInputChange}
      spellCheck={true}
      autoComplete="off"
      placeholder="Enter food name"
      onClick={() => handleNameInputClick(intakeItem.id)}
    />
  );
};
