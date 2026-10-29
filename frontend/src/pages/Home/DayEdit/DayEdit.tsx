import { t } from "../../../i18n";
import { FC } from "react";
import { IntakeEdit } from "./IntakeEdit";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import "./DayEdit.scss";
import { DayEditFilter } from "./Filter";
import { IntakeList } from "./IntakeList";
import { WeightWaistInput } from "./WeightWaistInput";
import { NutritionQuery } from "./NutritionQuery";
import { FavoriteIntakes } from "./FavoriteIntakes";
import { DayGoals } from "./DayGoals";
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
          <h2>{t("Your daily journal")}</h2>
          <DayEditFilter />
          {openedTab === DayEditTab.WeightWaistInput && <WeightWaistInput />}
          {openedTab === DayEditTab.IntakeEdit && <IntakeEdit />}
          {openedTab === DayEditTab.FavoriteIntake && <FavoriteIntakes />}
          {isListShown &&
            (dailyData.intakes.some(i => i.isRecorded === (openedTab === DayEditTab.IntakeList)) ? (
              <IntakeList />
            ) : (
              <p className="ui-empty">
                {" "}
                {t(
                  "Your journal has room for something good. Log your first meal to get started."
                )}{" "}
              </p>
            ))}
          {openedTab === DayEditTab.Query && <NutritionQuery />}
          {openedTab === DayEditTab.Goals && <DayGoals />}
        </DayDashboard>
      )}
    </section>
  );
};
