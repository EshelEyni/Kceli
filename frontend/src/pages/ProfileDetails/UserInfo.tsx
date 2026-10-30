import { t } from "../../i18n";
import { FC } from "react";
import { useProfile } from "./ProfileContext";
import { Button } from "../../components/App/Button/Button";
import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../types/app";

export const UserInfo: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, userDailyStats, count, setIsEditing } = useProfile();
  if (!user) return null;

  const {
    username,
    fullname,
    birthdate,
    height,
    weight,
    totalDailyEnergyExpenditure,
    targetCaloricIntakePerDay,
    targetCaloricDeficitPerDay,
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
        <h2>{t("User name:")}</h2>
        <p>{username}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Full name:")}</h2>
        <p>{fullname}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Interface language")}</h2>
        <p>{user.language === "he" ? "עברית" : "English"}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Birth date:")}</h2>
        <p>{new Date(birthdate).toLocaleDateString()}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Height:")}</h2>
        <p>{`${height} ${t("cm")}`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Weight:")}</h2>
        <p>{`${weight} ${t("kg")}`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Total Daily Energy Expenditure:")}</h2>
        <p>{`${totalDailyEnergyExpenditure} ${t("kcal")}`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Target Caloric Intake Per Day:")}</h2>
        <p>{`${targetCaloricIntakePerDay} ${t("kcal")}`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("Target Caloric Deficit Per Day:")}</h2>
        <p>{`${targetCaloricDeficitPerDay} ${t("kcal")}`}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("days in process:")}</h2>
        <p>{count}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("total weight loss:")}</h2>
        <p>{calcTotalWeightLoss()}</p>
      </div>

      <div className="user-info__item-container">
        <h2>{t("weight loss per day:")}</h2>
        <p>{calcWeightLossPerDay()}</p>
      </div>

      <div className="user-info__btn-container">
        <Button onClickFn={handleBtnLogoutClick}>{t("Logout")}</Button>
        <Button onClickFn={handleBtnEditClick}>{t("Edit")}</Button>
      </div>
    </section>
  );
};
