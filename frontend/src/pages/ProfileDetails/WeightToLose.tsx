import { FC } from "react";
import { useProfile } from "./ProfileContext";

export const WeightToLose: FC = () => {
  const { weightToLose } = useProfile();
  if (!weightToLose) return null;
  const items = Object.entries(weightToLose);
  return (
    <section className="profile-details__items-list">
      <h2 className="profile-details__items-list__title">Weight To Lose</h2>
      <ul className="profile-details__items-list__items-container">
        {items.map(([key, value]) => (
          <li className="profile-details__items-list__item" key={key}>
            <h3 className="profile-details__items-list__item__title">{key}</h3>
            <p className="profile-details__items-list__item__value">{value} kg</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
