import { FC } from "react";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { useTodayData } from "../../../contexts/TodayDataContext";

export const TodayDetailsHeader: FC = () => {
  const {
    dailyData,
    recordedIntakes,
    calConsumedPct,
    calRemainingPct,
    remainingCalories,
    consumedCalories,
    estimatedKGChange,
  } = useTodayData();

  if (!dailyData) return null;

  const { date } = dailyData;
  const dateToRender = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

  const calConsumedTitle = remainingCalories > 0 ? "remaining" : "over your limit";

  return (
    <header className="today-details__header">
      <div className="today-details__header__date-container">
        <h2 className="today-details__header__date">{dateToRender}</h2>
      </div>

      <CaloriePie intakes={recordedIntakes} remainingCalories={remainingCalories} />

      <div className="today-details__header__titles">
        <p className="today-details__header__titles__title">
          <strong>{remainingCalories} </strong>
          calories {calConsumedTitle}
        </p>

        {consumedCalories > 0 && (
          <p className="today-details__header__titles__title">
            <strong>{Math.round(consumedCalories)}</strong> calories consumed
          </p>
        )}

        <div className="today-details__header__percentages-container">
          <div className="today-details__header__percentage">
            <p className="today-details__header__percentage__title">consumed:</p>
            <p className="today-details__header__percentage__value">{calConsumedPct}%</p>
          </div>
          <div className="today-details__header__percentage">
            <p className="today-details__header__percentage__title">remaining:</p>
            <p className="today-details__header__percentage__value">{calRemainingPct}%</p>
          </div>
        </div>

        {estimatedKGChange > 0 ? (
          <p className="today-details__header__titles__title">
            estimated to gain <strong>{estimatedKGChange}kg</strong>
          </p>
        ) : (
          <p className="today-details__header__titles__title">
            estimated to lose <strong>{Math.abs(estimatedKGChange)}</strong> kg
          </p>
        )}
      </div>
    </header>
  );
};
