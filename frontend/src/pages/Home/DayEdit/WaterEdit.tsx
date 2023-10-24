import { FC, useState } from "react";
import { Button } from "../../../components/App/Button/Button";
import classnames from "classnames";
import "./WaterEdit.scss";
import { useDayEdit } from "./DayEditContext";
import { MeasurementUnit } from "../../../../../shared/types/intake";
import toast from "react-hot-toast";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";

type WaterValue = {
  name: string;
  value: number;
};

export const waterEditBtns = [
  {
    name: "cup (250ml)",
    value: 250,
  },
  {
    name: "bottle (750ml)",
    value: 750,
  },
  {
    name: "1.5 Liter",
    value: 1500,
  },
];

export const WaterEdit: FC = () => {
  const { dailyData, updateDailyData, recommendedWaterIntake } = useDayEdit();
  const [selectedValue, setSelectedValue] = useState<string>("");

  function handleValueBtnClick(value: WaterValue) {
    setSelectedValue(value.name);
  }

  function handleBtnSaveClick() {
    if (!dailyData) return;

    const btn = waterEditBtns.find(i => i.name === selectedValue);
    if (!btn) return toast.error("Please select a value");

    const newWaterIntake = intakeUtilService.getDefaultIntake();
    newWaterIntake.items[0].quantity = btn.value;
    newWaterIntake.items[0].unit = MeasurementUnit.MILLILITER;
    newWaterIntake.items[0].name = "water";

    const intakes = [...dailyData.intakes, newWaterIntake];

    updateDailyData({ ...dailyData, intakes });
  }

  return (
    <section className="water-edit" data-testid="water-edit">
      <h2 className="water-edit__title">{`Recommended water intake: ${recommendedWaterIntake} ml`}</h2>
      <div className="water-edit__btns-values-container">
        {waterEditBtns.map(i => (
          <Button
            className={classnames("btn", { "btn-selected": selectedValue === i.name })}
            onClickFn={() => handleValueBtnClick(i)}
            key={i.value}
          >
            {i.name}
          </Button>
        ))}
      </div>

      <Button className="water-edit__btn-save" onClickFn={handleBtnSaveClick}>
        Save
      </Button>
    </section>
  );
};
