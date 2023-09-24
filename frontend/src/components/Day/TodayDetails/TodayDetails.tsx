import { FC } from "react";
import { CaloriePie } from "../../Charts/CaloriePie/CaloriePie";
import { RemainingCaloriesTitle } from "../../Calories/RemainingCaloriesTitle/RemainingCaloriesTitle";
import { IntakeEdit } from "../../Intake/IntakeEdit/IntakeEdit";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { ToggledElement, useTodayData } from "../../../contexts/TodayDataContext";
import "./TodayDetails.scss";
import { Filter } from "./Filter";
import { List } from "../../App/List/List";
import { ListItemTitle } from "../../App/ListItemTitle/ListItemTitle";
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
          <RemainingCaloriesTitle remainingCalories={remainingCalories} />
          <Filter />
          {openedElement === ToggledElement.IntakeEdit && <IntakeEdit />}
          {openedElement === ToggledElement.IntakeList && (
            <List
              className="intake-list"
              items={dailyData.intakes}
              render={(item, i) => (
                <div className="intake-preview-container">
                  <ListItemTitle
                    idx={i}
                    title={`Intake ${
                      item.name ? `- ${item.name}` : ""
                    } - Total Calories: ${calorieUtilService.getTotalCalories(item)}`}
                    className="intake-list-item-title"
                  />
                  <IntakePreview intake={item} key={item.id} />
                </div>
              )}
            />
          )}
        </>
      )}
    </section>
  );
};
