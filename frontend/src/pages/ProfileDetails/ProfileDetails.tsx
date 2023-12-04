import { Outlet } from "react-router-dom";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { WeightWaistChart } from "../../components/Charts/WeightWaistChart/WeightWaistChart";
import { useProfile } from "./ProfileContext";
import "./ProfileDetails.scss";
import { UserInfo } from "./UserInfo";
import { RecommendedWeightDisplay } from "./RecommendedWeightDisplay";
import { GoalCalender } from "./GoalCalender";
import { UserEdit } from "./UserEdit";
import { GoalIndicator } from "../../components/GoalIndicator/GoalIndicator";
import { WeightToLose } from "./WeightToLose";
import { GoalEdit } from "../../components/GoalEdit/GoalEdit";
import { UserGoalDisplay } from "./UserGoalDisplay";

const ProfileDetails = () => {
  const {
    user,
    userDailyStats,
    isLoading,
    isSuccess,
    isError,
    timeToMaxRecommendedWeight,
    timeToCurrentWeightLossGoal,
    isEditing,
  } = useProfile();

  if (isLoading) return <SpinnerLoader containerSize={{ width: "100%" }} />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;
  if (!isSuccess || !user) return null;

  return (
    <main className="page profile-details">
      {isEditing ? <UserEdit /> : <UserInfo />}
      {userDailyStats && <WeightWaistChart data={userDailyStats} />}
      <GoalIndicator />
      <UserGoalDisplay />
      <GoalEdit type="user" />
      {timeToCurrentWeightLossGoal && (
        <GoalCalender title="time to current weight loss goal" time={timeToCurrentWeightLossGoal} />
      )}
      <RecommendedWeightDisplay />
      <WeightToLose />
      {timeToMaxRecommendedWeight && (
        <GoalCalender title="time to max recommended weight" time={timeToMaxRecommendedWeight} />
      )}
      <Outlet />
    </main>
  );
};

export default ProfileDetails;
