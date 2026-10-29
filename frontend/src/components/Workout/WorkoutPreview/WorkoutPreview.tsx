import { t } from "../../../i18n";
import { FC } from "react";
import { Workout } from "../../../../../shared/types/workout";
import { Button } from "../../App/Button/Button";
import "./WorkoutPreview.scss";
import workoutUtilService from "../../../services/workout/workoutUtilService";
import { useNavigate } from "react-router-dom";
import { useDeleteWorkout } from "../../../hooks/useDeleteWorkout";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { UseMutateFunction } from "@tanstack/react-query";
import { DayData } from "../../../../../shared/types/dayData";
import { FiActivity, FiArrowRight, FiClock } from "react-icons/fi";

type WorkoutPreviewProps = {
  workout: Workout;
  onSchedule?: (workout: Workout, day: string) => void;
  isSavingSchedule?: boolean;
  updateDailyData?: UseMutateFunction<
    DayData,
    unknown,
    { id: string; data: Partial<DayData> },
    unknown
  >;
};

export const WorkoutPreview: FC<WorkoutPreviewProps> = ({
  workout,
  updateDailyData,
  onSchedule,
  isSavingSchedule,
}) => {
  const { removeWorkout } = useDeleteWorkout();
  const { dailyData } = useGetTodayData();
  const navigate = useNavigate();
  const duration =
    workoutUtilService.calcWorkoutDuration({ workout: workout as Workout }) ||
    workout?.durationInMin ||
    0;

  function handleBtnEditClick(workoutId: string) {
    navigate(`/workouts/edit/${workoutId}`);
  }

  function handleBtnDeleteClick(workoutId: string) {
    if (!updateDailyData) return removeWorkout(workoutId);
    if (!dailyData) return;
    const updatedDailyData = { ...dailyData };
    const workouts = updatedDailyData.workouts.filter(w => w.id !== workoutId);
    updateDailyData({ id: updatedDailyData.id, data: { workouts } });
  }

  function handleBtnOpenClick(workoutId: string) {
    navigate(`/workouts/details/${workoutId}`);
  }

  return (
    <article className="workout-preview" data-testid="workout-preview">
      <div
        className={`ui-workout-cover ${workout.type === "aerobic" ? "cardio" : ""}`}
        aria-hidden="true"
      >
        <FiActivity />
      </div>
      <section className="workout-preview__info">
        <span className="ui-badge">
          {workout.type === "aerobic" ? t("Cardio") : t("Strength")}
          {"split" in workout ? ` · ${t("Split {{split}}", { split: workout.split })}` : ""}
        </span>
        <h3>{workout.description || t("Untitled routine")}</h3>
        <p className="ui-subtitle">
          <FiClock /> {duration > 0 ? `${duration} ${t("min")} · ` : ""}
          {workout.items.length} {t("exercises")}{" "}
        </p>
      </section>
      {onSchedule && (
        <label className="ui-schedule-select">
          {" "}
          {t("Add to day")}{" "}
          <select
            value=""
            disabled={isSavingSchedule}
            aria-label={t("Schedule {{name}}", { name: workout.description || t("Your routine") })}
            onChange={event => {
              if (event.target.value) onSchedule(workout, event.target.value);
            }}
          >
            <option value="">{t("Choose a weekday…")}</option>
            {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(day => (
              <option key={day} value={day}>
                {t(day)}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="workout-preview__btns">
        <Button
          className="btn workout-page__btn"
          onClickFn={() => handleBtnDeleteClick(workout.id)}
        >
          {" "}
          {t("delete")}{" "}
        </Button>
        {!updateDailyData && (
          <Button
            className="btn workout-page__btn"
            onClickFn={() => handleBtnEditClick(workout.id)}
          >
            {" "}
            {t("edit")}{" "}
          </Button>
        )}
        <Button className="btn workout-page__btn" onClickFn={() => handleBtnOpenClick(workout.id)}>
          {" "}
          {t("View & start")} <FiArrowRight />
        </Button>
      </div>
    </article>
  );
};
