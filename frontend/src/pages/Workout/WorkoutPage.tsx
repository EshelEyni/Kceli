import { FC } from "react";
import { useGetWorkouts } from "../../hooks/useGetWorkouts";
import { AsyncList } from "../../components/App/AsyncList/AsyncList";
import { Workout } from "../../../../shared/types/workout";

const WorkoutPage: FC = () => {
  const { workouts, isLoading, isSuccess, isError, isEmpty } = useGetWorkouts();
  return (
    <main>
      <h1>WorkoutPage</h1>

      <AsyncList
        items={workouts as Workout[]}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        isEmpty={isEmpty}
        entityName="workouts"
        render={(workout: Workout) => (
          <div key={workout.id}>
            <h3>{workout.type}</h3>
          </div>
        )}
      />
    </main>
  );
};

export default WorkoutPage;
