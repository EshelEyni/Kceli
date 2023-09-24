import { FC } from "react";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { IntakeEdit } from "../../Intake/IntakeEdit/IntakeEdit";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { ToggledElement, useTodayData } from "../../../contexts/TodayDataContext";
import "./TodayDetails.scss";
import { Filter } from "./Filter";
import { List } from "../../App/List/List";
import { ListItemTitle } from "../../Titles/ListItem/ListItemTitle";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { IntakePreview } from "../../Intake/IntakePreview/IntakePreview";

export const TodayDetails: FC = () => {
  const {
    dailyData,
    isLoading,
    isSuccess,
    isError,
    isLoadingUpdate,
    remainingCalories,
    estimatedKGChange,
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
          <CaloriePie intakes={dailyData.intakes} remainingCalories={remainingCalories} />
          {remainingCalories > 0 ? (
            <p className="today-details__title">
              <strong>{remainingCalories}</strong> calories remaining
            </p>
          ) : (
            <p className="today-details__title">
              <strong>{Math.abs(remainingCalories)}</strong> calories over your limit
            </p>
          )}
          {estimatedKGChange > 0 ? (
            <p className="today-details__title">
              estimated to gain <strong>{estimatedKGChange}kg</strong>
            </p>
          ) : (
            <p className="today-details__title">
              estimated to lose <strong>{Math.abs(estimatedKGChange)}</strong> kg
            </p>
          )}
          <Filter />
          {openedElement === ToggledElement.IntakeEdit && <IntakeEdit />}
          {openedElement === ToggledElement.IntakeList && (
            <List
              className="intake-list"
              items={dailyData.intakes}
              render={(item, i) => (
                <div className="intake-preview-container" key={item.id}>
                  <ListItemTitle
                    idx={i}
                    title={`Intake ${
                      item.name ? `- ${item.name}` : ""
                    } - Total Calories: ${calorieUtilService.getTotalCalories(item)}`}
                    className="intake-list-item-title"
                  />
                  <IntakePreview intake={item} />
                </div>
              )}
            />
          )}
        </>
      )}
    </section>
  );
};
