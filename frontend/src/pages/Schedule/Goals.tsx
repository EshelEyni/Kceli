import { FC } from "react";
import "./Goals.scss";
import { GoalEdit } from "../../components/GoalEdit/GoalEdit";
import { useSchedule } from "./ScheduleContext";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { GoalDisplay } from "./GoalDisplay";
import { Goal } from "../../types/app";

type GoalsProps = {
  type: "week" | "month";
};

export const Goals: FC<GoalsProps> = ({ type }) => {
  const {
    weekGoals,
    isWeekGoalsLoading,
    isWeekGoalsSuccess,
    isWeekGoalsError,
    isWeekGoalsEmpty,
    isWeekGoalsEditEnabled,
    monthGoals,
    isMonthGoalsLoading,
    isMonthGoalsSuccess,
    isMonthGoalsError,
    isMonthGoalsEmpty,
    isMonthGoalsEditEnabled,
  } = useSchedule();

  if (type === "month")
    return (
      <section className="goals">
        {isMonthGoalsEditEnabled && <GoalEdit type="month" />}
        <AsyncList
          className="goals__list"
          items={monthGoals as Goal[]}
          render={goal => <GoalDisplay goal={goal} key={goal.id} />}
          isLoading={isMonthGoalsLoading}
          isError={isMonthGoalsError}
          isSuccess={isMonthGoalsSuccess}
          isEmpty={isMonthGoalsEmpty}
          entityName="goal"
        />
      </section>
    );

  if (type === "week")
    return (
      <section className="goals">
        {isWeekGoalsEditEnabled && <GoalEdit type="week" />}
        <AsyncList
          className="goals__list"
          items={weekGoals as Goal[]}
          render={goal => <GoalDisplay goal={goal} key={goal.id} />}
          isLoading={isWeekGoalsLoading}
          isError={isWeekGoalsError}
          isSuccess={isWeekGoalsSuccess}
          isEmpty={isWeekGoalsEmpty}
          entityName="goal"
        />
      </section>
    );

  return null;
};
