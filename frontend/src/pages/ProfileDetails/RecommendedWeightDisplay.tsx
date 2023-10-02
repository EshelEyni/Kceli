import { FC } from "react";
import { useProfile } from "../../contexts/ProfileContex";

export const RecommendedWeightDisplay: FC = () => {
  const { recommendedWeight } = useProfile();

  if (!recommendedWeight) return null;
  const items = Object.entries(recommendedWeight);
  return (
    <section className="profile-details__items-list">
      <h2 className="profile-details__items-list__title">Recommended Weight</h2>
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
