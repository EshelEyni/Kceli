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
import { DayDashboard } from "./DayDashboard";

export const DayEdit: FC = () => {
  const { dailyData, isLoading, isSuccess, isError, openedTab } = useDayEdit();

  const showContent = isSuccess && dailyData && !isLoading;
  const isListShown =
    openedTab === DayEditTab.IntakeList || openedTab === DayEditTab.UnRecordedIntakeList;

  return (
    <section className="day-edit" data-testid="day-edit">
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <DayDashboard>
          <h2>Your daily journal</h2>
          <DayEditFilter />
          {openedTab === DayEditTab.WeightWaistInput && <WeightWaistInput />}
          {openedTab === DayEditTab.IntakeEdit && <IntakeEdit />}
          {openedTab === DayEditTab.Workouts && <DayWorkouts />}
          {openedTab === DayEditTab.FavoriteIntake && <FavoriteIntakes />}
          {isListShown &&
            (dailyData.intakes.some(i => i.isRecorded === (openedTab === DayEditTab.IntakeList)) ? (
              <IntakeList />
            ) : (
              <p className="ui-empty">
                Your journal has room for something good. Log your first meal to get started.
              </p>
            ))}
          {openedTab === DayEditTab.Query && <NutritionQuery />}
          {openedTab === DayEditTab.Water && <WaterEdit />}
          {openedTab === DayEditTab.Goals && <DayGoals />}
          {openedTab === DayEditTab.HungerMeter && <HungerMeter />}
          <details className="ui-details">
            <summary>More daily insights</summary>
            <DayEditHeader />
          </details>
        </DayDashboard>
      )}
    </section>
  );
};
