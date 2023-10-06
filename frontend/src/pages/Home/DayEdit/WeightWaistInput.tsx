import { FC, useState } from "react";
import { useDayEdit } from "./DayEditContext";
import { Button } from "../../../components/App/Button/Button";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";

export const WeightWaistInput: FC = () => {
  const { dailyData, isLoading, updateDailyData } = useDayEdit();
  const [weight, setWeight] = useState<number>();
  const [waist, setWaist] = useState<number>();

  function handleWeightInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setWeight(Number(value));
  }

  function handleWaistInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setWaist(Number(value));
  }

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (!dailyData || !weight || !waist) return;
    updateDailyData({ ...dailyData, weight, waist });
  }

  if (!dailyData) return null;
  const isFormShown = !dailyData.weight && !dailyData.waist && !isLoading;
  return (
    <>
      {isLoading && <SpinnerLoader withContainer={true} containerSize={{ height: "75px" }} />}
      {isFormShown && (
        <form className="weight-waist-form">
          <input
            type="number"
            name="weight"
            className="weight-waist-form__input"
            placeholder="Enter your weight"
            value={weight || ""}
            onChange={handleWeightInputChange}
          />
          <input
            type="number"
            className="weight-waist-form__input"
            name="waist"
            placeholder="Enter your waist size"
            value={waist || ""}
            onChange={handleWaistInputChange}
          />
          <Button className="btn" onClickFn={handleSubmit} type="submit">
            update
          </Button>
        </form>
      )}
      {!isFormShown && (
        <div className="weight-waist-details">
          <p className="weight-waist-details__title">weight:</p>
          <p className="weight-waist-details__text">{dailyData.weight} kg</p>
          <p className="weight-waist-details__title">waist:</p>
          <p className="weight-waist-details__text">{dailyData.waist} cm</p>
        </div>
      )}
    </>
  );
};
