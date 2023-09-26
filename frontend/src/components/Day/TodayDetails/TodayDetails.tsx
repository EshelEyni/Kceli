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

export const TodayDetails: FC = () => {
  const {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    isLoadingUpdate,
    backgroundColor,
    openedElement,
  } = useTodayData();

  const showContent = isSuccess && dailyData && !isLoadingUpdate;
  const isListShown =
    openedElement === ToggledElement.IntakeList ||
    openedElement === ToggledElement.UnRecordedIntakeList;
  return (
    <section className="today-details" style={{ backgroundColor }}>
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <TodayDetailsHeader />
          <Filter />
          {openedElement === ToggledElement.WeightWaistInput && <WeightWaistInput />}
          {openedElement === ToggledElement.IntakeEdit && <IntakeEdit />}
          {isListShown && <IntakeList />}
        </>
      )}
    </section>
  );
};
