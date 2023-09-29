import { Outlet, useParams } from "react-router-dom";
import "./ProfileDetails.scss";
import { useGetUser } from "../../hooks/useGetUser";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { useState } from "react";
import { Button } from "../../components/App/Button/Button";
import { useUpdateUser } from "../../hooks/useUpdateUser";

const ProfileDetails = () => {
  const params = useParams();
  const { username } = params as { username: string };
  const { user, isLoading, isSuccess, isError } = useGetUser(username);
  const [currWeightLossGoal, setCurrWeightLossGoal] = useState(0);
  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();

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
  return (
    <main className="profile-details">
      <div style={{ alignSelf: "flex-start" }}>
        <p>{user.fullname}</p>
        <p>{user.username}</p>
        <p>{new Date(user.birthdate).toLocaleDateString()}</p>
        <p>{user.weight}</p>
        <p>{user.height}</p>
        <p>{user.gender}</p>
        <p>{user.currentWeightLossGoal}</p>
      </div>

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
