import { FC } from "react";
import "./RemainingCaloriesTitle.scss";

type RemainingCaloriesTitleProps = {
  remainingCalories: number;
};

export const RemainingCaloriesTitle: FC<RemainingCaloriesTitleProps> = ({ remainingCalories }) => {
  return (
    <strong className="remaining-calorie-title">
      {remainingCalories > 0
        ? `${remainingCalories} calories remaining`
        : `${Math.abs(remainingCalories)} calories over your limit`}
    </strong>
  );
};
