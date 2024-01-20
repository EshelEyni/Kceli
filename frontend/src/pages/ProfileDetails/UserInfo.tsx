import { FC } from "react";
import { useProfile } from "./ProfileContext";
import { Button } from "../../components/App/Button/Button";
import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../types/app";

export const UserInfo: FC = () => {
  const dispatch: AppDispatch = useDispatch();
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

  function handleBtnLogoutClick() {
    dispatch(logout());
  }

  function calcWeightLossPerDay() {
    if (!userDailyStats || !userDailyStats.length || !count) return 0;
    const weightLossPerDay =
      (userDailyStats[0].weight - userDailyStats[userDailyStats.length - 1].weight) / count;
    return weightLossPerDay.toFixed(2);
  }

  function calcTotalWeightLoss() {
    if (!userDailyStats || !userDailyStats.length) return 0;
    const totalWeightLoss =
      userDailyStats[0].weight - userDailyStats[userDailyStats.length - 1].weight;
    return totalWeightLoss.toFixed(2);
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
        <h2>total weight loss:</h2>
        <p>{calcTotalWeightLoss()}</p>
      </div>

      <div className="user-info__item-container">
        <h2>weight loss per day:</h2>
        <p>{calcWeightLossPerDay()}</p>
      </div>

      <div className="user-info__btn-container">
        <Button onClickFn={handleBtnLogoutClick}>Logout</Button>
        <Button onClickFn={handleBtnEditClick}>Edit</Button>
      </div>
    </section>
  );
};
