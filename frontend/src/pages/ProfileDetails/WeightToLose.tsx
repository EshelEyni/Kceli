import { FC } from "react";
import { useProfile } from "../../contexts/ProfileContext";

export const WeightToLose: FC = () => {
  const { weightToLose } = useProfile();
  return (
    <section className="profile-details__items-list">
      <h2 className="profile-details__items-list__title">Weight To Lose</h2>
      <ul className="profile-details__items-list__items-container">
        <li className="profile-details__items-list__item">
          <p className="profile-details__items-list__item__value">{weightToLose} kg</p>
        </li>
      </ul>
    </section>
  );
};
