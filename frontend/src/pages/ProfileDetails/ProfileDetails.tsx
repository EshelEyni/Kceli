import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import { useProfile } from "../../contexts/ProfileContex";
import "./ProfileDetails.scss";
import { UserInfo } from "./UserInfo";
import { RecommendedWeightDisplay } from "./RecommendedWeightDisplay";
import { CaloriesToLoseDisplay } from "./CaloriesToLoseDisplay";
import { GoalCalender } from "./GoalCalender";
import { UserEdit } from "./UserEdit";

const ProfileDetails = () => {
  const {
    user,
    isLoading,
    isSuccess,
    isError,
    timeToMaxRecommendedWeight,
    timeToCurrentWeightLossGoal,
    isEditing,
  } = useProfile();

  if (isLoading) return <SpinnerLoader withContainer={true} containerSize={{ width: "100%" }} />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;
  if (!isSuccess || !user) return null;

  return (
    <main className="page profile-details">
      {isEditing ? <UserEdit /> : <UserInfo />}
      <WeightWaistChart />

      {timeToCurrentWeightLossGoal && (
        <GoalCalender title="time to current weight loss goal" time={timeToCurrentWeightLossGoal} />
      )}

      <RecommendedWeightDisplay />
      <CaloriesToLoseDisplay />

      {timeToMaxRecommendedWeight && (
        <GoalCalender title="time to max recommended weight" time={timeToMaxRecommendedWeight} />
      )}

      <Outlet />
    </main>
  );
};

export default ProfileDetails;
