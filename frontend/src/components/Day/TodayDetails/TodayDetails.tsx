import { FC } from "react";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { RemainingCaloriesTitle } from "../../Calories/RemainingCaloriesTitle/RemainingCaloriesTitle";
import { IntakeEdit } from "../../Intake/IntakeEdit/IntakeEdit";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { useTodayData } from "../../../contexts/TodayDataContext";
import "./TodayDetails.scss";

export const TodayDetails: FC = () => {
  const {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    isLoadingUpdate,
    remainingCalories,
    backgroundColor,
  } = useTodayData();
  const showContent = isSuccess && dailyData && !isLoadingUpdate;

  return (
    <section className="today-details" style={{ backgroundColor }}>
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <CaloriePie intakes={dailyData.intakes} remainingCalories={remainingCalories} />
          <RemainingCaloriesTitle remainingCalories={remainingCalories} />
          <IntakeEdit />
        </>
      )}
    </section>
  );
};
