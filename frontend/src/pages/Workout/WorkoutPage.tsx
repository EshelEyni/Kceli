import { t } from "../../i18n";
import { FC, useState } from "react";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import "./WorkoutPage.scss";
import workoutUtilService from "../../services/workout/workoutUtilService";
import { useWorkouts } from "./WorkoutsContext";
import { WorkoutList } from "./WorkoutList/WorkoutList";
import { Goal } from "../../types/app";
import { GoalEdit } from "../../components/GoalEdit/GoalEdit";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { GoalDisplay } from "../Schedule/GoalDisplay";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import { MetricCard, PageIntro } from "../../components/App/PageIntro/PageIntro";
import { FiPlus } from "react-icons/fi";

const WorkoutPage: FC = () => {
  usePageLoaded({ title: "Workouts / Kceli" });
  const {
    createWorkout,
    isLoadingCreateWorkout,
    workouts,
    goals,
    isLoadingGoals,
    isSuccessGoals,
    isErrorGoals,
    isEmptyGoals,
  } = useWorkouts();
  const [filter, setFilter] = useState<"all" | "anaerobic" | "aerobic">("all");

  function handleCreateWorkoutBtn() {
    createWorkout(workoutUtilService.getDefaultWorkout());
  }

  return (
    <main className="page workout-page">
      <PageIntro
        eyebrow={t("Move with purpose")}
        title={t("Your space to get stronger.")}
        description={t("Simple routines. A plan that works for you.")}
        action={
          <button
            className="ui-button"
            disabled={isLoadingCreateWorkout}
            onClick={handleCreateWorkoutBtn}
          >
            <FiPlus /> {t("Create workout")}{" "}
          </button>
        }
      />
      <div className="ui-metrics">
        <MetricCard
          label={t("Your library")}
          value={workouts?.length ?? "—"}
          unit={t("routines")}
          description={t("Built around your own exercises")}
        />
        <MetricCard
          label={t("Strength routines")}
          value={workouts?.filter(w => w.type === "anaerobic").length ?? "—"}
          description={t("Sets, reps, weights and supersets")}
        />
        <MetricCard
          label={t("Cardio routines")}
          value={workouts?.filter(w => w.type === "aerobic").length ?? "—"}
          description={t("Make time for movement")}
        />
      </div>
      <section className="ui-workout-library">
        <div className="ui-card-heading">
          <h2>{t("Your workout library")}</h2>
          <div className="ui-tabs" aria-label={t("Filter workouts")}>
            {(
              [
                { value: "all", label: "All workouts" },
                { value: "anaerobic", label: "Strength" },
                { value: "aerobic", label: "Cardio" },
              ] as const
            ).map(item => (
              <button
                key={item.value}
                className={filter === item.value ? "active" : ""}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {t(item.label)}
              </button>
            ))}
          </div>
        </div>
        {isLoadingCreateWorkout ? (
          <SpinnerLoader />
        ) : (
          <WorkoutList filter={filter} />
        )}
      </section>
      <div className="ui-card workout-page__goals">
        <h2>{t("A goal worth showing up for")}</h2>
        <GoalEdit type="workout" />
        <AsyncList
          className="workout-page__goals__list"
          items={goals as Goal[]}
          render={goal => <GoalDisplay goal={goal} key={goal.id} isEditEnabled={true} />}
          isLoading={isLoadingGoals}
          isError={isErrorGoals}
          isSuccess={isSuccessGoals}
          isEmpty={isEmptyGoals}
          entityName={t("goal")}
        />
      </div>
    </main>
  );
};

export default WorkoutPage;
