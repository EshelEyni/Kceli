import { FC, useState } from "react";
import { GiTrophyCup } from "react-icons/gi";
import { useAuth } from "../../hooks/useAuth";
import { useGetUserDailyStats } from "../../hooks/useGetUserDailyStats";
import "./GoalIndicator.scss";
import userUtilService from "../../services/user/userUtilService";

const sound = new Audio("/assets/sounds/WeAreTheChampions.mp3");

export const GoalIndicator: FC = () => {
  const { loggedInUser } = useAuth();
  const { userDailyStats } = useGetUserDailyStats();
  const [isCircleClicked, setIsCircleClicked] = useState(false);

  function handleCircleClick() {
    sound.play();
    setIsCircleClicked(true);
    setTimeout(() => setIsCircleClicked(false), 15000);
  }

  function handleFireworkContainerClick() {
    if (!isCircleClicked) return;
    sound.pause();
    sound.currentTime = 0;
    setIsCircleClicked(false);
  }

  if (!loggedInUser || !userDailyStats) return null;

  const percentage = userUtilService.calcPercentageWeightGoal({
    loggedInUser,
    userDailyStats,
  });
  const background = _generateGradient(percentage);

  return (
    <section className="goal-indicator">
      <h2 className="goal-indicator__title">goal indicator</h2>
      <div className="goal-indicator-circle" style={{ background }} onClick={handleCircleClick}>
        <GiTrophyCup className="goal-indicator__icon" />
      </div>
      <strong className="goal-indicator__text">
        You achieved <span>{percentage}%</span> of your goal
      </strong>

      {isCircleClicked && (
        <div className="firework-container" onClick={handleFireworkContainerClick}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="firework" />
          ))}
        </div>
      )}
    </section>
  );
};

function _generateGradient(percentage: number) {
  return `radial-gradient(closest-side,  var(--color-primary) 85%, transparent 87%),
      conic-gradient(var(--color-success) ${
        percentage > 100 ? 100 : percentage
      }%, rgb(239,243,244) 0)`;
}
