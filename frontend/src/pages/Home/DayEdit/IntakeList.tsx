import { FC } from "react";
import { List } from "../../../components/App/List/List";
import { ToggledElement, useDayEdit } from "./DayEditContext";
import calorieUtilService from "../../../services/calorieUtil/calorieUtilService";
import { IntakePreview } from "./IntakePreview";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { getCleanTime } from "../../../services/util/utilService";
import "./IntakeList.scss";

export const IntakeList: FC = () => {
  const { dailyData, unrecordedIntakes, recordedIntakes, openedElement, isLoadingUpdate } =
    useDayEdit();

  if (!dailyData) return null;

  const isRecordedIntakesShown = openedElement === ToggledElement.IntakeList;
  const intakes = isRecordedIntakesShown ? recordedIntakes : unrecordedIntakes;
  const sortedIntakes = intakes.sort((a, b) => {
    if (!a.recordedAt || !b.recordedAt) return 0;
    return new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime();
  });

  const totalCalories = calorieUtilService.getTotalCaloriesFromDailyData({
    dailyData,
    isRecorded: isRecordedIntakesShown,
  });

  return (
    <>
      <header className="intake-list__header" data-testid="intake-list-header">
        <h3 className="intake-list__header__title">
          {isRecordedIntakesShown ? "Recorded" : "Unrecorded"} Intakes
        </h3>
        <h4 className="intake-list__header__total-calories">total calories: {totalCalories}</h4>
      </header>

      {isLoadingUpdate && <SpinnerLoader />}
      {!isLoadingUpdate && (
        <List
          className="intake-list"
          items={sortedIntakes}
          render={(item, i) => {
            const recordedStr = item.recordedAt
              ? `- ${getCleanTime(item.recordedAt as unknown as string)}`
              : "";

            return (
              <li className="intake-list-item" key={item.id}>
                <h5 className="intake-list-item__title">
                  Intake {i + 1}# {recordedStr}
                </h5>
                <IntakePreview intake={item} />
              </li>
            );
          }}
        />
      )}
    </>
  );
};
