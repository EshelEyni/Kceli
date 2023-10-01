import { FC } from "react";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { useTodayData } from "../../../contexts/TodayDataContext";

export const TodayDetailsHeader: FC = () => {
  const {
    dailyData,
    recordedIntakes,
    remainingCalories,
    consumedCalories,
    estimatedKGChange,
    recommendedWaterIntake,
  } = useTodayData();

  if (!dailyData) return null;

  const { date } = dailyData;
  const dateToRender = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

  return (
    <header className="today-details__header">
      <div className="today-details__header__date-container">
        <h2 className="today-details__header__date">{dateToRender}</h2>
      </div>

      <CaloriePie intakes={recordedIntakes} remainingCalories={remainingCalories} />

      <div className="today-details__header__titles">
        {remainingCalories > 0 ? (
          <p className="today-details__title">
            <strong>{Math.round(remainingCalories)}</strong> calories remaining
          </p>
        ) : (
          <p className="today-details__title">
            <strong>{Math.abs(Math.round(remainingCalories))}</strong> calories over your limit
          </p>
        )}

        <hr />
        {consumedCalories > 0 && (
          <p className="today-details__title">
            <strong>{Math.round(consumedCalories)}</strong> calories consumed
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
