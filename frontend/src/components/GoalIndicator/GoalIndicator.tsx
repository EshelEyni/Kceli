import { FC } from "react";
import { GiTrophyCup } from "react-icons/gi";
import { useAuth } from "../../hooks/useAuth";
import { useGetUserDailyStats } from "../../hooks/useGetUserDailyStats";
import "./GoalIndicator.scss";
import { User, UserDailyStatsResult } from "../../../../shared/types/user";

type CalcPercentageParams = {
  loggedInUser: User;
  userDailyStats: UserDailyStatsResult[];
};

export const GoalIndicator: FC = () => {
  const { loggedInUser } = useAuth();
  const { userDailyStats } = useGetUserDailyStats();
  if (!loggedInUser || !userDailyStats) return null;

  const percentage = _calcPercentage({ loggedInUser, userDailyStats });
  const background = _generateGradient(percentage);

  return (
    <section className="goal-indicator">
      <h2 className="goal-indicator__title">goal indicator</h2>
      <div className="goal-indicator-circle" style={{ background }}>
        <GiTrophyCup className="goal-indicator__icon" />
      </div>
      <strong className="goal-indicator__text">
        You achieved <span>{percentage}%</span> of your goal
      </strong>
    </section>
  );
};

function _calcPercentage({ loggedInUser, userDailyStats }: CalcPercentageParams) {
  const { weightLossGoal, weight } = loggedInUser;
  const { startingWeight, weightGoal } = weightLossGoal;
  const goalWeight = startingWeight - weightGoal;
  const currentWeight = userDailyStats.at(-1)?.weight || weight;

  const weightDiff = currentWeight - goalWeight;
  return Math.round((weightDiff / (startingWeight - goalWeight)) * 100);
}

function _generateGradient(percentage: number) {
  return `radial-gradient(closest-side,  var(--color-primary) 85%, transparent 87%),
      conic-gradient(var(--color-success) ${
        percentage > 100 ? 100 : percentage
      }%, rgb(239,243,244) 0)`;
}
