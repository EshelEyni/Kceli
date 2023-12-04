import { FC, useState } from "react";
import { Goal } from "../../types/app";
import goalUtilService from "../../services/goal/goalUtilService";
import "./GoalEdit.scss";
import { SpinnerLoader } from "../Loaders/SpinnerLoader/SpinnerLoader";
import { Button } from "../App/Button/Button";
import classnames from "classnames";
import { useAddGoal } from "../../hooks/useAddGoal";

type GoalEditProps = {
  type: Goal["type"];
  setIsGoalEditing?: React.Dispatch<React.SetStateAction<boolean>>;
  date?: Date;
};

export const GoalEdit: FC<GoalEditProps> = ({ type, setIsGoalEditing, date }) => {
  const { addGoal, isLoading } = useAddGoal();
  const [goal, setGoal] = useState<Goal>(goalUtilService.getDefaultGoal({ type, date }));

  function handleDescInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setGoal({ ...goal, description: e.target.value });
  }

  function handleStartingWeightInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!("userWeightLossGoal" in goal)) return;
    const startingWeight = Number(e.target.valueAsNumber);
    setGoal({ ...goal, userWeightLossGoal: { ...goal.userWeightLossGoal, startingWeight } });
  }

  function handleWeightGoalInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!("userWeightLossGoal" in goal)) return;
    const weightGoal = Number(e.target.valueAsNumber);
    setGoal({ ...goal, userWeightLossGoal: { ...goal.userWeightLossGoal, weightGoal } });
  }

  function handleAddGoal() {
    addGoal(goal);
    setGoal(goalUtilService.getDefaultGoal({ type, date }));
    setIsGoalEditing?.(false);
  }

  if (isLoading) return <SpinnerLoader containerSize={{ height: "50px" }} />;
  return (
    <form className="goal-edit">
      {type === "user" ? (
        <>
          <input
            type="number"
            className="goal-edit__input"
            placeholder="Enter your starting weight"
            onChange={handleStartingWeightInputChanged}
          />
          <input
            type="number"
            className="goal-edit__input"
            placeholder="Enter your goal weight"
            onChange={handleWeightGoalInputChanged}
          />
        </>
      ) : (
        <input
          type="text"
          className="goal-edit__input"
          placeholder="Enter your goal description"
          value={goal.description}
          onChange={handleDescInputChanged}
        />
      )}

      <div className="goal-edit__btns">
        <Button
          className={classnames("goal-edit__btns__btn ", {
            active:
              goal.description ||
              ("userWeightLossGoal" in goal &&
                goal.userWeightLossGoal.startingWeight &&
                goal.userWeightLossGoal.weightGoal),
          })}
          isDisabled={
            "userWeightLossGoal" in goal
              ? !goal.userWeightLossGoal.startingWeight || !goal.userWeightLossGoal.weightGoal
              : !goal.description
          }
          onClickFn={handleAddGoal}
        >
          Add Goal
        </Button>
        {setIsGoalEditing && (
          <Button className="dismiss" onClickFn={() => setIsGoalEditing(false)}>
            dismiss
          </Button>
        )}
      </div>
    </form>
  );
};
