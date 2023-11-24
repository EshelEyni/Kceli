import { FC, useState } from "react";
import { useSchedule } from "./ScheduleContext";
import { Goal } from "../../types/app";
import goalUtilService from "../../services/goal/goalUtilService";
import "./WeekGoalEdit.scss";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { Button } from "../../components/App/Button/Button";
import classnames from "classnames";

export const WeekGoalEdit: FC = () => {
  const { addGoal, isAddGoalLoading } = useSchedule();
  const [goal, setGoal] = useState<Goal>(goalUtilService.getDefaultGoal());

  function handleDescInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setGoal({ ...goal, description: e.target.value });
  }

  function handleAddGoal() {
    goal.type = "weekly";
    addGoal(goal);
  }

  if (isAddGoalLoading)
    return <SpinnerLoader withContainer={true} containerSize={{ height: "50px" }} />;
  return (
    <form className="week-goal-edit">
      <input
        type="text"
        className="week-goal-edit__input"
        value={goal.description}
        onChange={handleDescInputChanged}
      />
      <Button
        className={classnames("week-goal-edit__btn ", {
          active: goal.description,
        })}
        onClickFn={handleAddGoal}
      >
        Add Goal
      </Button>
    </form>
  );
};
