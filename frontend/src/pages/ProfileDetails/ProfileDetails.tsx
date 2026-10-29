import { Link, Outlet } from "react-router-dom";
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
import { usePageLoaded } from "../../hooks/usePageLoaded";
import { PageIntro } from "../../components/App/PageIntro/PageIntro";
import { FiFeather } from "react-icons/fi";

const ProfileDetails = () => {
  usePageLoaded({ title: "Profile / Kceli" });
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
  const measurements = userDailyStats?.filter(day => day.weight > 0) || [];
  const currentWeight = measurements.at(-1)?.weight || user.weight;
  const startingWeight = measurements[0]?.weight || user.weight;
  const weightChange = startingWeight - currentWeight;
  const initials = (user.fullname || user.username)
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="page profile-details">
      <PageIntro
        eyebrow="Your journey, your pace"
        title="Look how far you’ve come."
        description="A place for your progress, goals and personal details."
        action={
          <Link className="ui-button" to="/home?tab=WeightWaistInput">
            Log a check-in ↗
          </Link>
        }
      />
      <section className="ui-card ui-profile-banner">
        <div className="ui-avatar">{initials}</div>
        <div>
          <h2>{user.fullname || user.username}</h2>
          <p className="ui-subtitle">
            Building better habits since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="ui-profile-metrics">
            <div>
              <strong>
                {startingWeight} <small>kg</small>
              </strong>
              <span>Starting weight</span>
            </div>
            <div>
              <strong>
                {currentWeight} <small>kg</small>
              </strong>
              <span>Current weight</span>
            </div>
            <div>
              <strong>
                {Math.abs(Number(weightChange.toFixed(2)))} <small>kg</small>
              </strong>
              <span>{weightChange >= 0 ? "Weight lost" : "Weight gained"}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="ui-profile-grid">
        <div className="ui-stack">
          <section className="ui-card">
            <div className="ui-card-heading">
              <h2>Every check-in tells a story</h2>
              <span className="ui-badge">Your progress</span>
            </div>
            {measurements.length ? (
              <WeightWaistChart data={measurements} isProgressBarShown={true} />
            ) : (
              <div className="ui-empty">
                <p>
                  Your story starts with one check-in. Record your weight and waist to see your
                  progress here.
                </p>
                <Link to="/home?tab=WeightWaistInput" className="ui-text-link">
                  Record a check-in ↗
                </Link>
              </div>
            )}
          </section>
          <section className="ui-card ui-personal-details">
            <h2>Personal details</h2>
            {isEditing ? <UserEdit /> : <UserInfo />}
          </section>
        </div>
        <aside className="ui-stack">
          <section className="ui-card ui-intention">
            <FiFeather />
            <h2>Your personal milestone</h2>
            <p>Your chosen goal, at your own pace.</p>
            <UserGoalDisplay />
            <GoalEdit type="user" />
            <GoalIndicator />
          </section>
          <section className="ui-card">
            <h2>Your daily targets</h2>
            <dl className="ui-targets">
              <div>
                <dt>Estimated TDEE</dt>
                <dd>{user.totalDailyEnergyExpenditure.toLocaleString()} kcal</dd>
              </div>
              <div>
                <dt>Calorie target</dt>
                <dd>{user.targetCaloricIntakePerDay.toLocaleString()} kcal</dd>
              </div>
              <div>
                <dt>Planned deficit</dt>
                <dd>{user.targetCaloricDeficitPerDay.toLocaleString()} kcal</dd>
              </div>
            </dl>
            <p className="ui-subtitle">
              Estimates from your profile. Adjust your personal details as your needs change.
            </p>
          </section>
        </aside>
      </div>
      <details className="ui-card ui-details ui-legacy-insights">
        <summary>Additional weight and goal insights</summary>
        <div className="ui-insights-grid">
          {timeToCurrentWeightLossGoal && (
            <GoalCalender
              title="time to current weight loss goal"
              time={timeToCurrentWeightLossGoal}
            />
          )}
          <RecommendedWeightDisplay />
          <WeightToLose />
          {timeToMaxRecommendedWeight && (
            <GoalCalender
              title="time to max recommended weight"
              time={timeToMaxRecommendedWeight}
            />
          )}
        </div>
      </details>
      <Outlet />
    </main>
  );
};

export default ProfileDetails;
