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
import { List } from "../../../components/App/List/List";
import { WorkoutPreview } from "../../../components/Workout/WorkoutPreview/WorkoutPreview";
import { NutritionQuery } from "./NutritionQuery";
import { WaterEdit } from "./WaterEdit";
import { FavoriteIntakes } from "./FavoriteIntakes";
import { useGetColorByCalories } from "../../../hooks/useGetColorByCalories";

export const DayEdit: FC = () => {
  const { dailyData, isLoading, isSuccess, isError, isLoadingUpdate, openedTab } = useDayEdit();
  const { backgroundColor } = useGetColorByCalories();
  const showContent = isSuccess && dailyData && !isLoadingUpdate && !isLoading;
  const isLoaderShown = isLoading || isLoadingUpdate;
  const isListShown =
    openedTab === DayEditTab.IntakeList || openedTab === DayEditTab.UnRecordedIntakeList;

  return (
    <section
      className="day-edit"
      style={{ backgroundColor, border: `5px solid ${backgroundColor}` }}
      data-testid="day-edit"
    >
      {isLoaderShown && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <DayEditHeader />
          <DayEditFilter />
          {openedTab === DayEditTab.WeightWaistInput && <WeightWaistInput />}
          {openedTab === DayEditTab.IntakeEdit && <IntakeEdit />}
          {openedTab === DayEditTab.Workouts && (
            <List
              className="day-edit__workouts-list"
              items={dailyData.workouts}
              render={item => <WorkoutPreview workout={item} isDayEdit={true} key={item.id} />}
            />
          )}
          {openedTab === DayEditTab.FavoriteIntake && <FavoriteIntakes />}
          {isListShown && <IntakeList />}
          {openedTab === DayEditTab.Query && <NutritionQuery />}
          {openedTab === DayEditTab.Water && <WaterEdit />}
        </>
      )}
    </section>
  );
};
