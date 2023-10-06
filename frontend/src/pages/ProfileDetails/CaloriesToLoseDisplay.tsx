import { FC } from "react";
import { useProfile } from "../../contexts/ProfileContext";

export const CaloriesToLoseDisplay: FC = () => {
  const { caloriesToLose } = useProfile();
  if (!caloriesToLose) return null;

  const items = Object.entries(caloriesToLose).map(([key, value]) => {
    if (key === "dailyIntakes") return ["daily intakes", value];
    return [key, value];
  });

  return (
    <section className="profile-details__items-list">
      <h2 className="profile-details__items-list__title">Expendable Energy</h2>
      <ul className="profile-details__items-list__items-container">
        {items.map(([key, value]) => (
          <li className="profile-details__items-list__item" key={key}>
            <h3 className="profile-details__items-list__item__title">{key}</h3>
            <p className="profile-details__items-list__item__value">{value}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
