import { FC } from "react";
import { useIntakeItemEdit } from "./IntakeItemEditContext";
import classnames from "classnames";

export const IntakeItemEditManualInputs: FC = () => {
  const { intakeItem, inputFaded, setInputFaded, handleInputChange } = useIntakeItemEdit();

  function handleInputClick(inputName: string) {
    if (inputFaded !== inputName) return;
    setInputFaded("");
  }

  return (
    <div className="intake-item-edit__manuall-calorie-edit">
      <input
        type="number"
        name="calories"
        className={classnames("intake-item-input", { faded: inputFaded === "calories" })}
        value={intakeItem.calories || ""}
        placeholder="Calories"
        onChange={handleInputChange}
        onClick={() => handleInputClick("calories")}
      />
      <input
        type="number"
        name="caloriesPer100g"
        className={classnames("intake-item-input", { faded: inputFaded === "caloriesPer100g" })}
        value={intakeItem.caloriesPer100g || ""}
        placeholder="Calories per 100g"
        onChange={handleInputChange}
        onClick={() => handleInputClick("caloriesPer100g")}
      />
    </div>
  );
};