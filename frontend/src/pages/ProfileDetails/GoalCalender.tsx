import { FC } from "react";
import { TimeToWeightGoal } from "../../types/app";
import { Footer } from "../../components/App/Footer/Footer";

type GoalCalenderProps = {
  time: TimeToWeightGoal;
  title: string;
};

export const GoalCalender: FC<GoalCalenderProps> = ({ title, time }) => {
  const items = Object.entries(time);

  return (
    <section className="profile-details__goal-calender">
      <h2 className="profile-details__goal-calender__title">{title}</h2>

      <div className="profile-details__goal-calender__list">
        {items.map(([key, value]) => (
          <div className="profile-details__goal-calender__list__item" key={key}>
            <div className="profile-details__goal-calender__list__item__value-cotnainer">
              <h4>{value}</h4>
            </div>
            <Footer className="profile-details__goal-calender__list__item__footer">
              <h4>{key}</h4>
            </Footer>
          </div>
        ))}
      </div>
    </section>
  );
};
