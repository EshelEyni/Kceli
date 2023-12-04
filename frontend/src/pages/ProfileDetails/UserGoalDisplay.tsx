import { FC } from "react";
import { useProfile } from "./ProfileContext";
import "./UserGoalDisplay.scss";
import { Header } from "../../components/App/Header/Header";

export const UserGoalDisplay: FC = () => {
  const { userGoal } = useProfile();

  if (!userGoal) return null;
  const {
    userWeightLossGoal: { startingWeight, weightGoal },
    date,
  } = userGoal;
  const dateTitle = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(date));

  return (
    <section className="user-display-goal">
      <Header className="user-display-goal__header">
        <h1 className="user-display-goal__header__title">your goal</h1>
        <div className="user-display-goal__header__date">{dateTitle}</div>
      </Header>
      <div className="user-display-goal__info">
        <div className="user-display-goal__info__row">
          <span className="user-display-goal__info__row__value">{startingWeight} kg</span>
          <span className="user-display-goal__info__row__title">starting weight</span>
        </div>
        <div className="user-display-goal__info__row">
          <span className="user-display-goal__info__row__value">{weightGoal} kg</span>
          <span className="user-display-goal__info__row__title">goal weight</span>
        </div>
      </div>
    </section>
  );
};
