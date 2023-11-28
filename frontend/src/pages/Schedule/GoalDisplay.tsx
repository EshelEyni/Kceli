import { FC, useState, useEffect } from "react";
import { Goal } from "../../types/app";
import { Checkbox } from "../../components/App/Checkbox/Checkbox";
import { useSchedule } from "./ScheduleContext";
import "./GoalDisplay.scss";
import { FaXmark, FaCheck, FaTrashCan } from "react-icons/fa6";
import { Button } from "../../components/App/Button/Button";

type WeekGoalDisplayProps = {
  goal: Goal;
  type: "week" | "month";
};

export const GoalDisplay: FC<WeekGoalDisplayProps> = ({ goal, type }) => {
  const { updateGoal, isWeekGoalsEditEnabled, isMonthGoalsEditEnabled, deleteGoal } = useSchedule();
  const [isEdit, setIsEdit] = useState(false);
  const [desc, setDesc] = useState(goal.description);
  const isEditEnabled = getIsEditEnabled();
  let lastTap = 0;

  function getIsEditEnabled() {
    if (type === "week") return isWeekGoalsEditEnabled;
    if (type === "month") return isMonthGoalsEditEnabled;
    return false;
  }
  function handleCheckboxClicked() {
    if (!isEditEnabled) return;
    updateGoal({ ...goal, isCompleted: !goal.isCompleted });
  }

  function handleDescDoubleClicked() {
    if (!isEditEnabled) return;
    setIsEdit(true);
  }

  function handleTouchEnd() {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      handleDescDoubleClicked();
    }
    lastTap = currentTime;
  }

  function handleDescInputChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setDesc(e.target.value);
  }

  function handleUpdateGoal() {
    updateGoal({ ...goal, description: desc }, { onSuccess: handleBtnCloseClick });
  }

  function handleDeleteGoal() {
    deleteGoal(goal.id);
  }

  function handleBtnCloseClick() {
    setDesc(goal.description);
    setIsEdit(false);
  }

  useEffect(() => {
    setDesc(goal.description);
  }, [goal.description]);

  return (
    <section
      className="week-goal-display"
      onDoubleClick={handleDescDoubleClicked}
      onTouchEnd={handleTouchEnd}
    >
      {!isEdit ? (
        <>
          <p>{goal.description}</p>
          <Checkbox isChecked={goal.isCompleted} onClickFn={handleCheckboxClicked} />
        </>
      ) : (
        <div className="week-goal-display__edit">
          <input
            type="text"
            className="week-goal-display__edit__input"
            value={desc}
            onChange={handleDescInputChanged}
          />
          <div className="week-goal-display__edit__btns">
            <Button onClickFn={handleUpdateGoal}>
              <FaCheck color="var(--color-text-gray)" />
            </Button>
            <Button onClickFn={handleDeleteGoal}>
              <FaTrashCan color="var(--color-text-gray)" />
            </Button>
            <Button onClickFn={handleBtnCloseClick}>
              <FaXmark color="var(--color-text-gray)" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
