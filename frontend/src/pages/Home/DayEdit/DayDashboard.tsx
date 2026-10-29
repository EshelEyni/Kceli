import { getLocale } from "../../../i18n";
import { t } from "../../../i18n";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FiActivity, FiArrowRight, FiFeather } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import { MetricCard, PageIntro } from "../../../components/App/PageIntro/PageIntro";
import { DayEditTab, useDayEdit } from "./DayEditContext";

export function DayDashboard({ children }: { children: ReactNode }) {
  const { loggedInUser } = useAuth();
  const {
    dailyData,
    consumedCalories,
    remainingCalories,
    targetCaloricIntakePerDay,
    setOpenedTab,
    setSearchParams,
  } = useDayEdit();
  if (!dailyData) return null;
  const isToday = new Date(dailyData.date).toDateString() === new Date().toDateString();
  const savedDate = new Date(dailyData.date).toLocaleDateString(getLocale(), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const target = targetCaloricIntakePerDay || 0;
  const percentage = target > 0 ? Math.min(100, Math.max(0, (consumedCalories / target) * 100)) : 0;
  const weight = dailyData.weight || loggedInUser?.weight;
  const firstName = loggedInUser?.fullname?.split(" ")[0] || loggedInUser?.username || t("there");
  const scheduled =
    loggedInUser?.workoutSchedule?.find(day => day.value === new Date(dailyData.date).getDay())
      ?.workouts || [];
  const openTool = (tab: DayEditTab) => {
    setOpenedTab(tab);
    setSearchParams(new URLSearchParams({ tab }));
    document.getElementById("daily-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <>
      <PageIntro
        eyebrow={t("Your daily overview")}
        title={t("Good to see you, {{name}}.", { name: firstName })}
        description={
          isToday
            ? t("Small steps today. A healthier you tomorrow.")
            : t(
                "Viewing your saved day: {{date}}. Start a new day below to log today's activities.",
                { date: savedDate }
              )
        }
      />
      <div className="ui-metrics">
        <MetricCard
          label={t("Calories eaten")}
          value={Math.round(consumedCalories).toLocaleString()}
          unit={`/ ${target.toLocaleString(getLocale())} ${t("kcal")}`}
          description={t("{{count}} kcal {{status}}", {
            count: Math.round(Math.abs(remainingCalories)),
            status: t(remainingCalories >= 0 ? "remaining" : "above target"),
          })}
        />
        <MetricCard
          label={t("Current weight")}
          value={weight || "—"}
          unit={t("kg")}
          description={
            dailyData.weight
              ? t("From your daily check-in")
              : t("From your profile · check in for an update")
          }
        />
        <MetricCard
          label={isToday ? t("Today's movement") : t("Saved day's movement")}
          value={
            dailyData.workouts.filter(w => w.items.length > 0 && w.items.every(i => i.isCompleted))
              .length
          }
          unit={t("sessions completed")}
          description={t("{{count}} routines on this day’s plan", { count: scheduled.length })}
        />
      </div>
      <div className="ui-dashboard-grid">
        <div className="ui-stack">
          <section className="ui-card ui-hero">
            <div>
              <p className="ui-eyebrow">{t("A little consistency goes a long way")}</p>
              <h2>
                {" "}
                {t("You’re building")} <br /> {t("something good.")}{" "}
              </h2>
              <p>
                {" "}
                {t("Make room for a little nourishment,")} <br />{" "}
                {t("movement and time for yourself.")}{" "}
              </p>
              <Link className="ui-button ui-button-lime" to="/schedule">
                {" "}
                {t("See your progress")} <FiArrowRight />
              </Link>
            </div>
            <div
              className="ui-calorie-ring"
              style={{ background: `conic-gradient(var(--ui-lime) ${percentage}%, #ffffff22 0)` }}
              role="img"
              aria-label={t("{{count}} of {{target}} calories consumed", {
                count: Math.round(consumedCalories),
                target,
              })}
            >
              <div>
                <strong>{Math.round(Math.abs(remainingCalories)).toLocaleString()}</strong>
                <small>
                  {t("kcal")} {remainingCalories >= 0 ? t("remaining") : t("above target")}
                </small>
              </div>
            </div>
          </section>
          <section
            className="ui-card ui-daily-tools"
            id="daily-tools"
            aria-label={t("Daily logging tools")}
          >
            {children}
          </section>
        </div>
        <aside className="ui-stack">
          <section className="ui-card">
            <div className="ui-card-heading">
              <h2>{t("On your plan")}</h2>
              <Link to="/workouts">{t("View all ↗")}</Link>
            </div>
            {scheduled.length ? (
              scheduled.map(workout => (
                <div className="ui-planned-workout" key={workout.id}>
                  <span className="ui-activity-icon">
                    <FiActivity />
                  </span>
                  <div>
                    <small className="ui-eyebrow">
                      {isToday ? t("Today") : savedDate} ·{" "}
                      {workout.type === "aerobic" ? t("Cardio") : t("Strength")}
                    </small>
                    <h3>{workout.description || t("Your routine")}</h3>
                    <p>
                      {workout.items.length} {t("exercises")}{" "}
                      {"split" in workout
                        ? ` · ${t("Split {{split}}", { split: workout.split })}`
                        : ""}
                    </p>
                    <Link to={`/workouts/details/${workout.id}`} className="ui-text-link">
                      {" "}
                      {t("View & start")} <FiArrowRight />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="ui-empty">
                <FiActivity />
                <h3>{t("A little breathing room.")}</h3>
                <p>
                  {t("No workouts on your plan")} {isToday ? t("today") : t("for this day")}.
                </p>
                <Link to="/workouts" className="ui-button ui-button-secondary">
                  {" "}
                  {t("Explore your routines")}{" "}
                </Link>
              </div>
            )}
          </section>
          <section className="ui-card ui-intention">
            <FiFeather />
            <h2>{t("Your everyday intentions")}</h2>
            <p>{t("Check in with your goals, make time for movement, and notice how you feel.")}</p>
            <button className="ui-text-link" onClick={() => openTool(DayEditTab.Goals)}>
              {" "}
              {t("View daily goals ↗")}{" "}
            </button>
          </section>
        </aside>
      </div>
    </>
  );
}
