import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiActivity, FiArrowRight, FiDroplet, FiFeather, FiPlus } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import { MetricCard, PageIntro } from "../../../components/App/PageIntro/PageIntro";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { MeasurementUnit } from "../../../../../shared/types/intake";

export function DayDashboard({ children }: { children: ReactNode }) {
  const { loggedInUser } = useAuth();
  const {
    dailyData,
    consumedCalories,
    remainingCalories,
    targetCaloricIntakePerDay,
    setOpenedTab,
    setSearchParams,
    updateDailyData,
    isLoadingUpdate,
  } = useDayEdit();
  if (!dailyData) return null;
  const isToday = new Date(dailyData.date).toDateString() === new Date().toDateString();
  const savedDate = new Date(dailyData.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const target = targetCaloricIntakePerDay || 0;
  const percentage = target > 0 ? Math.min(100, Math.max(0, (consumedCalories / target) * 100)) : 0;
  const weight = dailyData.weight || loggedInUser?.weight;
  const firstName = loggedInUser?.fullname?.split(" ")[0] || loggedInUser?.username || "there";
  const scheduled =
    loggedInUser?.workoutSchedule?.find(day => day.value === new Date(dailyData.date).getDay())
      ?.workouts || [];
  const waterMl = dailyData.intakes
    .filter(i => i.isRecorded)
    .reduce(
      (sum, intake) =>
        sum +
        intake.items.reduce((total, item) => {
          if (item.name.toLowerCase() !== "water") return total;
          return (
            total + Number(item.quantity) * (item.unit === "cup" ? 250 : item.unit === "ml" ? 1 : 0)
          );
        }, 0),
      0
    );
  const waterTarget = Math.round((weight || 0) * 33);
  const openTool = (tab: DayEditTab) => {
    setOpenedTab(tab);
    setSearchParams(new URLSearchParams({ tab }));
    document.getElementById("daily-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  function addWater() {
    if (!dailyData || isLoadingUpdate || !isToday) return;
    const intake = intakeUtilService.getDefaultIntake();
    intake.type = "drink";
    intake.name = "Water";
    intake.recordedAt = new Date();
    intake.items[0] = {
      ...intake.items[0],
      name: "water",
      quantity: 250,
      unit: MeasurementUnit.MILLILITER,
      calories: 0,
    };
    updateDailyData({ id: dailyData.id, data: { intakes: [...dailyData.intakes, intake] } });
  }
  return (
    <>
      <PageIntro
        eyebrow="Your daily overview"
        title={`Good to see you, ${firstName}.`}
        description={
          isToday
            ? "Small steps today. A healthier you tomorrow."
            : `Viewing your saved day: ${savedDate}. Start a new day below to log today's activities.`
        }
        action={
          <button
            className="ui-button"
            disabled={!isToday}
            onClick={() => openTool(DayEditTab.IntakeEdit)}
          >
            <FiPlus />
            Log a meal
          </button>
        }
      />
      <div className="ui-metrics">
        <MetricCard
          label="Calories eaten"
          value={Math.round(consumedCalories).toLocaleString()}
          unit={`/ ${target.toLocaleString()} kcal`}
          description={`${Math.round(Math.abs(remainingCalories)).toLocaleString()} kcal ${
            remainingCalories >= 0 ? "remaining" : "above target"
          }`}
        />
        <MetricCard
          label="Current weight"
          value={weight || "—"}
          unit="kg"
          description={
            dailyData.weight
              ? "From your daily check-in"
              : "From your profile · check in for an update"
          }
        />
        <MetricCard
          label={isToday ? "Today's movement" : "Saved day's movement"}
          value={
            dailyData.workouts.filter(w => w.items.length > 0 && w.items.every(i => i.isCompleted))
              .length
          }
          unit="sessions completed"
          description={`${scheduled.length} ${scheduled.length === 1 ? "routine" : "routines"} on ${
            isToday ? "today's" : "this day's"
          } plan`}
        />
      </div>
      <div className="ui-dashboard-grid">
        <div className="ui-stack">
          <section className="ui-card ui-hero">
            <div>
              <p className="ui-eyebrow">A little consistency goes a long way</p>
              <h2>
                You’re building
                <br />
                something good.
              </h2>
              <p>
                Make room for a little nourishment,
                <br />
                movement and time for yourself.
              </p>
              <Link className="ui-button ui-button-lime" to="/schedule">
                See your progress <FiArrowRight />
              </Link>
            </div>
            <div
              className="ui-calorie-ring"
              style={{ background: `conic-gradient(var(--ui-lime) ${percentage}%, #ffffff22 0)` }}
              role="img"
              aria-label={`${Math.round(consumedCalories)} of ${target} calories consumed`}
            >
              <div>
                <strong>{Math.round(Math.abs(remainingCalories)).toLocaleString()}</strong>
                <small>kcal {remainingCalories >= 0 ? "remaining" : "above target"}</small>
              </div>
            </div>
          </section>
          <section
            className="ui-card ui-daily-tools"
            id="daily-tools"
            aria-label="Daily logging tools"
          >
            {children}
          </section>
        </div>
        <aside className="ui-stack">
          <section className="ui-card">
            <div className="ui-card-heading">
              <h2>On your plan</h2>
              <Link to="/workouts">View all ↗</Link>
            </div>
            {scheduled.length ? (
              scheduled.map(workout => (
                <div className="ui-planned-workout" key={workout.id}>
                  <span className="ui-activity-icon">
                    <FiActivity />
                  </span>
                  <div>
                    <small className="ui-eyebrow">
                      {isToday ? "Today" : savedDate} ·{" "}
                      {workout.type === "aerobic" ? "Cardio" : "Strength"}
                    </small>
                    <h3>{workout.description || "Your routine"}</h3>
                    <p>
                      {workout.items.length} exercises
                      {"split" in workout ? ` · Split ${workout.split}` : ""}
                    </p>
                    <Link to={`/workouts/details/${workout.id}`} className="ui-text-link">
                      View & start <FiArrowRight />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="ui-empty">
                <FiActivity />
                <h3>A little breathing room.</h3>
                <p>No workouts on your plan {isToday ? "today" : "for this day"}.</p>
                <Link to="/workouts" className="ui-button ui-button-secondary">
                  Explore your routines
                </Link>
              </div>
            )}
          </section>
          <section className="ui-card ui-water-card">
            <div className="ui-card-heading">
              <h2>Stay hydrated</h2>
              <FiDroplet />
            </div>
            <p className="ui-subtitle">A little refresh goes a long way.</p>
            <div className="ui-cups" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <span
                  className={waterTarget > 0 && i < (waterMl / waterTarget) * 8 ? "filled" : ""}
                  key={i}
                />
              ))}
            </div>
            <div className="ui-water-total">
              <div>
                <strong>{Number((waterMl / 1000).toFixed(2))}</strong>
                <small> / {Number((waterTarget / 1000).toFixed(2))} L</small>
              </div>
              <button
                className="ui-button ui-button-secondary"
                onClick={addWater}
                disabled={isLoadingUpdate || !isToday}
              >
                + 250 ml
              </button>
            </div>
            <button className="ui-text-link" onClick={() => openTool(DayEditTab.Water)}>
              More water options ↗
            </button>
          </section>
          <section className="ui-card ui-intention">
            <FiFeather />
            <h2>Your everyday intentions</h2>
            <p>Check in with your goals, make time for movement, and notice how you feel.</p>
            <button className="ui-text-link" onClick={() => openTool(DayEditTab.Goals)}>
              View daily goals ↗
            </button>
            <button className="ui-text-link" onClick={() => openTool(DayEditTab.HungerMeter)}>
              Log a hunger check-in ↗
            </button>
          </section>
        </aside>
      </div>
    </>
  );
}
