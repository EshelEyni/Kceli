import { FC } from "react";
import { useProfile } from "../../contexts/ProfileContex";

export const UserInfo: FC = () => {
  const { user } = useProfile();
  if (!user) return null;

  const execludeKeys = new Set([
    "id",
    "email",
    "imgUrl",
    "isAdmin",
    "createdAt",
    "updatedAt",
    "__v",
  ]);

  const userInfoItems = Object.entries(user).reduce((acc, [key, value]) => {
    if (execludeKeys.has(key)) return acc;
    if (key === "username") key = "User name";
    if (key === "fullname") key = "Full name";
    if (key === "birthdate") {
      key = "Birth date";
      value = new Date(value).toLocaleDateString();
    }
    if (key === "height") value = `${value} cm`;
    if (key === "weight") value = `${value} kg`;
    if (key === "totalDailyEnergyExpenditure") {
      key = "Total Daily Energy Expenditure";
      value = `${value} kcal`;
    }
    if (key === "targetCaloricIntakePerDay") {
      key = "Target Caloric Intake Per Day";
      value = `${value} kcal`;
    }
    if (key === "currentWeightLossGoal") {
      key = "Current Weight Loss Goal";
      value = `${value} kg`;
    }

    return [...acc, { key, value }];
  }, [] as { key: string; value: string | number }[]);

  return (
    <section className="profile-details__user-info">
      {userInfoItems.map(({ key, value }) => (
        <div className="user-info__item-container" key={key}>
          <h2>{key}:</h2>
          <p>{value}</p>
        </div>
      ))}
    </section>
  );
};
