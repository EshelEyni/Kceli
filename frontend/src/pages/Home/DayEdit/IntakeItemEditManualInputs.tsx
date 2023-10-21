import { FC } from "react";
import { useIntakeItemEdit } from "./IntakeItemEditContext";

export const IntakeItemEditManualInputs: FC = () => {
  const { intakeItem, inputFaded, setInputFaded, handleInputChange } = useIntakeItemEdit();

  return (
    <div className="intake-item-edit__manuall-calorie-edit">
      <input
        type="number"
        name="calories"
        className={"intake-item-input" + (inputFaded === "calories" ? " faded" : "")}
        value={intakeItem.calories || ""}
        placeholder="Calories"
        onChange={handleInputChange}
        onClick={() => setInputFaded("")}
      />
      <input
        type="number"
        name="caloriesPer100g"
        className={"intake-item-input" + (inputFaded === "caloriesPer100g" ? " faded" : "")}
        value={intakeItem.caloriesPer100g || ""}
        placeholder="Calories per 100g"
        onChange={handleInputChange}
        onClick={() => setInputFaded("")}
      />
    </div>
  );
};
