import { FC } from "react";
import "./DayGoals.scss";
import { GoalEdit } from "../../../components/GoalEdit/GoalEdit";
import { AsyncList } from "../../../components/App/AsyncList/AsyncList";
import { Goal } from "../../../types/app";
import { GoalDisplay } from "../../Schedule/GoalDisplay";
import { useDayEdit } from "./DayEditContext";

export const DayGoals: FC = () => {
  const { dailyData, goals, isLoadingGoals, isSuccessGoals, isErrorGoals, isEmptyGoals } =
    useDayEdit();

  if (!dailyData) return null;

  return (
    <section className="day-goals">
      <GoalEdit type="day" date={dailyData.date} />
      <AsyncList
        className="day-goals__list"
        items={goals as Goal[]}
        render={goal => <GoalDisplay goal={goal} key={goal.id} isEditEnabled={true} />}
        isLoading={isLoadingGoals}
        isError={isErrorGoals}
        isSuccess={isSuccessGoals}
        isEmpty={isEmptyGoals}
        entityName="goal"
      />
    </section>
  );
};
