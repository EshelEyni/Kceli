import { t } from "../../../i18n";
import { FC } from "react";
import { useWorkouts } from "../WorkoutsContext";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { Workout } from "../../../../../shared/types/workout";
import { WorkoutPreview } from "../../../components/Workout/WorkoutPreview/WorkoutPreview";
import { Empty } from "../../../components/App/Empty/Empty";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import "./WorkoutList.scss";

export const WorkoutList: FC<{
  filter?: "all" | "anaerobic" | "aerobic";
}> = ({ filter = "all" }) => {
  const { workouts, isLoading, isSuccess, isError, isEmpty } = useWorkouts();

  return (
    <div className="workout-list-container" data-testid="workout-list">
      {isLoading && <SpinnerLoader />}
      {isSuccess && !isEmpty && (
        <ul className="workout-list">
          {(workouts as Workout[])
            .filter(workout => filter === "all" || workout.type === filter)
            .map(workout => (
              <li key={workout.id} className="workout-list__item">
                <WorkoutPreview workout={workout} />
              </li>
            ))}
        </ul>
      )}
      {isSuccess && isEmpty && <Empty entityName={t("workouts")} />}
      {isSuccess &&
        !isEmpty &&
        filter !== "all" &&
        !workouts?.some(workout => workout.type === filter) && (
          <p className="ui-empty">
            {" "}
            {t("No")} {filter === "aerobic" ? t("cardio") : t("strength")}{" "}
            {t("routines yet. Create one to get started.")}{" "}
          </p>
        )}
      {isError && <ErrorMsg msg={t("Couldn't get workouts. Please try again later")} />}
    </div>
  );
};
