import { FC } from "react";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { useTodayData } from "../../../contexts/TodayDataContext";

export const TodayDetailsHeader: FC = () => {
  const { recordedIntakes, remainingCalories, estimatedKGChange, recommendedWaterIntake } =
    useTodayData();

  return (
    <header className="today-details__header">
      <CaloriePie intakes={recordedIntakes} remainingCalories={remainingCalories} />

      <div className="today-details__header__titles">
        {remainingCalories > 0 ? (
          <p className="today-details__title">
            <strong>{remainingCalories}</strong> calories remaining
          </p>
        ) : (
          <p className="today-details__title">
            <strong>{Math.abs(remainingCalories)}</strong> calories over your limit
          </p>
        )}
        {estimatedKGChange > 0 ? (
          <p className="today-details__title">
            estimated to gain <strong>{estimatedKGChange}kg</strong>
          </p>
        ) : (
          <p className="today-details__title">
            estimated to lose <strong>{Math.abs(estimatedKGChange)}</strong> kg
          </p>
        )}

        {recommendedWaterIntake && (
          <p className="today-details__title">
            <strong>{recommendedWaterIntake}</strong> ml of water remaining
          </p>
        )}
      </div>
    </header>
  );
};
