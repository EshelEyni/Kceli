import { FC } from "react";
import { IntakeEdit } from "./IntakeEdit";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import { ToggledElement, useDayEdit } from "./DayEditContext";
import "./DayEdit.scss";
import { Filter } from "./Filter";
import { DayEditHeader } from "./Header";
import { IntakeList } from "./IntakeList";
import { WeightWaistInput } from "./WeightWaistInput";
import { List } from "../../../components/App/List/List";
import { WorkoutPreview } from "../../../components/Workout/WorkoutPreview/WorkoutPreview";

export const DayEdit: FC = () => {
  const {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    isLoadingUpdate,
    openedElement,
    backgroundColor,
  } = useDayEdit();

  const showContent = isSuccess && dailyData && !isLoadingUpdate;
  const isLoaderShown = isLoading || isLoadingUpdate;
  const isListShown =
    openedElement === ToggledElement.IntakeList ||
    openedElement === ToggledElement.UnRecordedIntakeList;

  return (
    <section className="day-edit" style={{ backgroundColor }} data-testid="day-edit">
      {isLoaderShown && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <DayEditHeader />
          <Filter />
          {openedElement === ToggledElement.WeightWaistInput && <WeightWaistInput />}
          {openedElement === ToggledElement.IntakeEdit && <IntakeEdit />}
          {openedElement === ToggledElement.Workouts && (
            <List
              items={dailyData.workouts}
              render={item => <WorkoutPreview workout={item} isTodayDetails={true} key={item.id} />}
            />
          )}
          {isListShown && <IntakeList />}
        </>
      )}
    </section>
  );
};