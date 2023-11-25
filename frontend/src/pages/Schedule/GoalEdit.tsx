import { FC, useState } from "react";
import { useSchedule } from "./ScheduleContext";
import { Goal } from "../../types/app";
import goalUtilService from "../../services/goal/goalUtilService";
import "./GoalEdit.scss";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { Button } from "../../components/App/Button/Button";
import classnames from "classnames";

type GoalEditProps = {
  type: "week" | "month";
};

export const GoalEdit: FC<GoalEditProps> = ({ type }) => {
  const { addGoal, isAddGoalLoading } = useSchedule();
  const [goal, setGoal] = useState<Goal>(goalUtilService.getDefaultGoal());

  function handleDescInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setGoal({ ...goal, description: e.target.value });
  }

  function handleAddGoal() {
    goal.type = type;
    addGoal(goal);
  }

  if (isAddGoalLoading)
    return <SpinnerLoader withContainer={true} containerSize={{ height: "50px" }} />;
  return (
    <form className="goal-edit">
      <input
        type="text"
        className="goal-edit__input"
        value={goal.description}
        onChange={handleDescInputChanged}
      />
      <Button
        className={classnames("goal-edit__btn ", {
          active: goal.description,
        })}
        onClickFn={handleAddGoal}
      >
        Add Goal
      </Button>
    </form>
  );
};
