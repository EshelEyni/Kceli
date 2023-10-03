import { FC } from "react";
import { IntakeEdit } from "../../Intake/IntakeEdit/IntakeEdit";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { ToggledElement, useTodayData } from "../../../contexts/TodayDataContext";
import "./TodayDetails.scss";
import { Filter } from "./Filter";
import { TodayDetailsHeader } from "./Header";
import { IntakeList } from "./IntakeList";
import { WeightWaistInput } from "./WeightWaistInput";
import { List } from "../../App/List/List";
import { WorkoutPreview } from "../../Workout/WorkoutPreview/WorkoutPreview";

export const TodayDetails: FC = () => {
  const {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    isLoadingUpdate,
    openedElement,
    backgroundColor,
  } = useTodayData();

  const showContent = isSuccess && dailyData && !isLoadingUpdate;
  const isLoaderShown = isLoading || isLoadingUpdate;
  const isListShown =
    openedElement === ToggledElement.IntakeList ||
    openedElement === ToggledElement.UnRecordedIntakeList;

  return (
    <section className="today-details" style={{ backgroundColor }}>
      {isLoaderShown && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <TodayDetailsHeader />
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
