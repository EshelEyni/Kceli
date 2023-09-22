import { FC } from "react";

type RemainingCaloriesTitleProps = {
  remainingCalories: number;
};

export const RemainingCaloriesTitle: FC<RemainingCaloriesTitleProps> = ({ remainingCalories }) => {
  return (
    <span>
      {remainingCalories > 0
        ? `${remainingCalories} calories remaining`
        : `${Math.abs(remainingCalories)} calories over your limit`}
    </span>
  );
};
