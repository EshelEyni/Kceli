import { FC } from "react";
import "./WeekGoals.scss";
import { WeekGoalEdit } from "./WeekGoalEdit";
import { useSchedule } from "./ScheduleContext";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { WeekGoalDisplay } from "./WeekGoalDisplay";
import { Goal } from "../../types/app";

export const WeekGoals: FC = () => {
  const {
    weekGoals,
    isGoalsEmpty,
    isGoalsError,
    isGoalsLoading,
    isGoalsSuccess,
    isWeekGoalsEditEnabled,
  } = useSchedule();

  return (
    <section className="week-goals">
      {isWeekGoalsEditEnabled && <WeekGoalEdit />}
      <AsyncList
        className="week-goals__list"
        items={weekGoals as Goal[]}
        render={weekGoal => <WeekGoalDisplay goal={weekGoal} key={weekGoal.id} />}
        isLoading={isGoalsLoading}
        isError={isGoalsError}
        isSuccess={isGoalsSuccess}
        isEmpty={isGoalsEmpty}
        entityName="goal"
      />
    </section>
  );
};
