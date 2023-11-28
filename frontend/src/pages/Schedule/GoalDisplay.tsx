import { FC } from "react";
import "./GoalDisplay.scss";
import { Goal } from "../../types/app";
import { Checkbox } from "../../components/App/Checkbox/Checkbox";
import { useSchedule } from "./ScheduleContext";

type WeekGoalDisplayProps = {
  goal: Goal;
};

export const GoalDisplay: FC<WeekGoalDisplayProps> = ({ goal }) => {
  const { updateGoal, isWeekGoalsEditEnabled } = useSchedule();

  function handleCheckboxClicked() {
    if (!isWeekGoalsEditEnabled) return;
    updateGoal({ ...goal, isCompleted: !goal.isCompleted });
  }

  return (
    <section className="week-goal-display">
      <p>{goal.description}</p>
      <Checkbox isChecked={goal.isCompleted} onClickFn={handleCheckboxClicked} />
    </section>
  );
};
