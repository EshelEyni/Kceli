import { FC } from "react";
import { IntakeEdit } from "./IntakeEdit";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import "./DayEdit.scss";
import { DayEditFilter } from "./Filter";
import { DayEditHeader } from "./Header";
import { IntakeList } from "./IntakeList";
import { WeightWaistInput } from "./WeightWaistInput";
import { NutritionQuery } from "./NutritionQuery";
import { WaterEdit } from "./WaterEdit";
import { FavoriteIntakes } from "./FavoriteIntakes";
import { DayWorkouts } from "./DayWorkouts";
import { DayGoals } from "./DayGoals";
import { HungerMeter } from "./HungerMeter";

export const DayEdit: FC = () => {
  const { dailyData, isLoading, isSuccess, isError, openedTab, backgroundColor, color } =
    useDayEdit();

  const showContent = isSuccess && dailyData && !isLoading;
  const isListShown =
    openedTab === DayEditTab.IntakeList || openedTab === DayEditTab.UnRecordedIntakeList;

  return (
    <section
      className="day-edit"
      style={{ backgroundColor, color, border: `5px solid ${backgroundColor}` }}
      data-testid="day-edit"
    >
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <DayEditHeader />
          <DayEditFilter />
          {openedTab === DayEditTab.WeightWaistInput && <WeightWaistInput />}
          {openedTab === DayEditTab.IntakeEdit && <IntakeEdit />}
          {openedTab === DayEditTab.Workouts && <DayWorkouts />}
          {openedTab === DayEditTab.FavoriteIntake && <FavoriteIntakes />}
          {isListShown && <IntakeList />}
          {openedTab === DayEditTab.Query && <NutritionQuery />}
          {openedTab === DayEditTab.Water && <WaterEdit />}
          {openedTab === DayEditTab.Goals && <DayGoals />}
          {openedTab === DayEditTab.HungerMeter && <HungerMeter />}
        </>
      )}
    </section>
  );
};
