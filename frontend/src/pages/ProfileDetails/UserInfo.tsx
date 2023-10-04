import { FC } from "react";
import { useProfile } from "../../contexts/ProfileContex";
import { Button } from "../../components/App/Button/Button";

export const UserInfo: FC = () => {
  const { user, userDailyStats, setIsEditing } = useProfile();
  if (!user || !userDailyStats) return null;

  const {
    username,
    fullname,
    birthdate,
    height,
    weight,
    totalDailyEnergyExpenditure,
    targetCaloricIntakePerDay,
    weightLossGoal,
  } = user;

  function handleBtnEditClick() {
    setIsEditing(true);
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
        <h2>Current Weight Loss Goal:</h2>
        <p>{`${weightLossGoal.weightGoal} kg`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>days in process:</h2>
        <p>{userDailyStats.length}</p>
      </div>

      <Button className="user-info__edit-btn" onClickFn={handleBtnEditClick}>
        Edit
      </Button>
    </section>
  );
};
