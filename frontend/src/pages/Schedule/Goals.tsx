import { FC } from "react";
import "./Goals.scss";
import { GoalEdit } from "../../components/GoalEdit/GoalEdit";
import { useSchedule } from "./ScheduleContext";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { GoalDisplay } from "./GoalDisplay";
import { Goal } from "../../types/app";

type GoalsProps = {
  type: "week" | "month";
  currDate?: Date;
};

export const Goals: FC<GoalsProps> = ({ type, currDate }) => {
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
  console.log({ isMonthGoalsEditEnabled });
  if (type === "month")
    return (
      <section className="goals">
        {isMonthGoalsEditEnabled && <GoalEdit type="month" />}
        <AsyncList
          className="goals__list"
          items={monthGoals as Goal[]}
          render={goal => (
            <GoalDisplay goal={goal} key={goal.id} isEditEnabled={isMonthGoalsEditEnabled} />
          )}
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
        {isWeekGoalsEditEnabled && <GoalEdit type="week" date={currDate} />}
        <AsyncList
          className="goals__list"
          items={weekGoals as Goal[]}
          render={goal => (
            <GoalDisplay goal={goal} key={goal.id} isEditEnabled={isWeekGoalsEditEnabled} />
          )}
          isLoading={isWeekGoalsLoading}
          isError={isWeekGoalsError}
          isSuccess={isWeekGoalsSuccess}
          isEmpty={isWeekGoalsEmpty}
          entityName="goals"
        />
      </section>
    );

  return null;
};
