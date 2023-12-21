import { FC } from "react";
import { useProfile } from "./ProfileContext";
import { Button } from "../../components/App/Button/Button";

export const UserInfo: FC = () => {
  const { user, userDailyStats, count, setIsEditing } = useProfile();
  if (!user || !userDailyStats) return null;

  const {
    username,
    fullname,
    birthdate,
    height,
    weight,
    totalDailyEnergyExpenditure,
    targetCaloricIntakePerDay,
  } = user;

  function handleBtnEditClick() {
    setIsEditing(true);
  }

  function calcWeightLossPerDay() {
    if (!userDailyStats || !userDailyStats.length || !count) return 0;
    const weightLossPerDay =
      (userDailyStats[0].weight - userDailyStats[userDailyStats.length - 1].weight) / count;
    return weightLossPerDay.toFixed(2);
  }

  return (
    <section className="profile-details__user-info">
      <div className="user-info__item-container">
        <h2>User name:</h2>
        <p>{username}</p>
      </div>

      <div className="user-info__item-container">
        <h2>Full name:</h2>
        <p>{fullname}</p>
      </div>

      <div className="user-info__item-container">
        <h2>Birth date:</h2>
        <p>{new Date(birthdate).toLocaleDateString()}</p>
      </div>

      <div className="user-info__item-container">
        <h2>Height:</h2>
        <p>{`${height} cm`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>Weight:</h2>
        <p>{`${weight} kg`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>Total Daily Energy Expenditure:</h2>
        <p>{`${totalDailyEnergyExpenditure} kcal`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>Target Caloric Intake Per Day:</h2>
        <p>{`${targetCaloricIntakePerDay} kcal`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>days in process:</h2>
        <p>{count}</p>
      </div>

      <div className="user-info__item-container">
        <h2>weight loss per day:</h2>
        <p>{calcWeightLossPerDay()}</p>
      </div>

      <Button className="user-info__edit-btn" onClickFn={handleBtnEditClick}>
        Edit
      </Button>
    </section>
  );
};
