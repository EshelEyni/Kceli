import { FC } from "react";
import { useWorkout } from "../../contexts/WorkoutContex";
import { SpinnerLoader } from "../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../components/Msg/ErrorMsg/ErrorMsg";
import { Button } from "../../components/App/Button/Button";
import "./WorkoutDetails.scss";
import { Timer } from "../../components/Workout/Timer/Timer";

const WorkoutDetails: FC = () => {
  const { workout, isLoading, isSuccess, isError, duration, navigate } = useWorkout();

  if (isLoading) return <SpinnerLoader />;
  if (isError) return <ErrorMsg />;
  if (!isSuccess || !workout) return null;

  return (
    <main className="page workout-details">
      <section className="workout-details__info">
        <h2>description: {workout.description}</h2>
        <h2>duration (in min): {duration}</h2>
        <h2>type: {workout.type}</h2>
        {"split" in workout && <h2>split: {workout.split}</h2>}
      </section>

      <Button className="btn" onClickFn={() => navigate("/workouts")}>
        Go back
      </Button>
    </main>
  );
};

export default WorkoutDetails;
