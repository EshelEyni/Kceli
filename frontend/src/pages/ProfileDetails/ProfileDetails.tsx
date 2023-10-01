import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { useState } from "react";
import { Button } from "../../components/App/Button/Button";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import { useProfile } from "../../contexts/ProfileContex";
import "./ProfileDetails.scss";
import { UserInfo } from "./UserInfo";

const ProfileDetails = () => {
  const { user, isLoading, isSuccess, isError, updateUser, isLoadingUpdateUser } = useProfile();
  const [currWeightLossGoal, setCurrWeightLossGoal] = useState(0);

  function calculateRecommendedWeight(heightInMeters: number) {
    /**
     * Calculate the recommended body weight based on BMI.
     * The formula to calculate recommended weight is:
     * Recommended Weight = BMI * (Height in meters)^2
     * We use a "normal" BMI range of 18.5 to 24.9 to calculate the recommended weight.
     */

    const minNormalBMI = 18.5;
    const maxNormalBMI = 24.9;

    const minRecommendedWeight = minNormalBMI * Math.pow(heightInMeters, 2);
    const maxRecommendedWeight = maxNormalBMI * Math.pow(heightInMeters, 2);

    return {
      minRecommendedWeight: Number(minRecommendedWeight.toFixed(2)),
      maxRecommendedWeight: Number(maxRecommendedWeight.toFixed(2)),
    };
  }

  function calculateHowManyDaysToGetToMaxRecommendedWeight() {
    if (!user) return;
    const dailyRecommednedWeightLoss = 0.075;
    const deficit = user?.weight - maxRecommendedWeight;
    const daysToGetToMaxRecommendedWeight = Math.round(deficit / dailyRecommednedWeightLoss);
    return daysToGetToMaxRecommendedWeight;
  }

  function calculateHowManyDaysToGetToCurrentWeightLossGoal() {
    if (!user) return;
    const dailyRecommednedWeightLoss = 0.075;
    const daysToGetToCurrentWeightLossGoal = Math.round(
      user.currentWeightLossGoal / dailyRecommednedWeightLoss
    );
    return daysToGetToCurrentWeightLossGoal;
  }

  if (isLoading) return <SpinnerLoader withContainer={true} containerSize={{ width: "100%" }} />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;
  if (!isSuccess || !user) return null;

  function handleWeightLossGoalInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setCurrWeightLossGoal(Number(value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !currWeightLossGoal) return;
    const userToUpdate = { ...user, currentWeightLossGoal: currWeightLossGoal };
    updateUser(userToUpdate);
  }

  const { minRecommendedWeight, maxRecommendedWeight } = calculateRecommendedWeight(
    user.height / 100
  );
  const CALORIES_PER_KG_BODY_FAT = 7700;
  const caloriesToLose = Math.round(
    (user.weight - maxRecommendedWeight) * CALORIES_PER_KG_BODY_FAT
  );

  const howManyDaysToGetToMaxRecommendedWeight = calculateHowManyDaysToGetToMaxRecommendedWeight();
  const howManyDaysToGetToCurrentWeightLossGoal =
    calculateHowManyDaysToGetToCurrentWeightLossGoal();

  return (
    <main className="page profile-details">
      <UserInfo />
      <WeightWaistChart />
      <div>
        <h5>recommended weight</h5>
        <div>
          <p>minRecommendedWeight: {minRecommendedWeight}</p>
          <p>maxRecommendedWeight: {maxRecommendedWeight}</p>
        </div>
      </div>

      <div>
        <h3>calories to lose</h3>
        <h4>{caloriesToLose.toLocaleString()} Kcal</h4>
      </div>
      <div>
        <h3>calories to lose as days</h3>
        <h4>{(caloriesToLose / 7700).toLocaleString()} </h4>
        <h4>days you can maintain energy on body fat</h4>
      </div>

      {howManyDaysToGetToMaxRecommendedWeight && (
        <div>
          <h3>days to get to max recommended weight</h3>
          <h4>{howManyDaysToGetToMaxRecommendedWeight}</h4>

          <h3>weeks to get to max recommended weight</h3>
          <h4>{Math.round(howManyDaysToGetToMaxRecommendedWeight / 7)}</h4>

          <h3>months to get to max recommended weight</h3>
          <h4>{Math.round(howManyDaysToGetToMaxRecommendedWeight / 30)}</h4>
        </div>
      )}
      {howManyDaysToGetToCurrentWeightLossGoal && (
        <div>
          <h3>days to get to Current Weight Loss Goal</h3>
          <h4>{howManyDaysToGetToCurrentWeightLossGoal}</h4>

          <h3>weeks to get to Current Weight Loss Goal</h3>
          <h4>{Math.round(howManyDaysToGetToCurrentWeightLossGoal / 7)}</h4>

          <h3>months to get to Current Weight Loss Goal</h3>
          <h4>{Math.round(howManyDaysToGetToCurrentWeightLossGoal / 30)}</h4>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="curr-goal">
          <h3>current weight loss goal</h3>
          <input
            type="number"
            name="curr-goal"
            id="curr-goal"
            value={currWeightLossGoal}
            onChange={handleWeightLossGoalInputChange}
          />
        </label>
        <Button type="submit">Save</Button>
        {isLoadingUpdateUser && <SpinnerLoader />}
      </form>
      <Outlet />
    </main>
  );
};

export default ProfileDetails;
