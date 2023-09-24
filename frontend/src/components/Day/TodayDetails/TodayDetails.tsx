import { FC } from "react";
import { IntakeEdit } from "../../Intake/IntakeEdit/IntakeEdit";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { ToggledElement, useTodayData } from "../../../contexts/TodayDataContext";
import "./TodayDetails.scss";
import { Filter } from "./Filter";
import { TodayDetailsHeader } from "./Header";
import { RecordedIntakeList } from "./RecordedIntakeList";
import { UnrecordedIntakeList } from "./UnrecordedIntakeList";

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

  return (
    <section className="today-details" style={{ backgroundColor }}>
      {isLoading && <SpinnerLoader />}
      {isError && <ErrorMsg />}
      {showContent && (
        <>
          <TodayDetailsHeader />
          <Filter />
          {openedElement === ToggledElement.IntakeEdit && <IntakeEdit />}
          {openedElement === ToggledElement.IntakeList && <RecordedIntakeList />}
          {openedElement === ToggledElement.UnRecordedIntakeList && <UnrecordedIntakeList />}
        </>
      )}
    </section>
  );
};
