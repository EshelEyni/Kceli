import { FC, useState, useEffect, useRef } from "react";
import "./TotalDurationCircle.scss";
import { useWorkout } from "../../contexts/WorkoutContext";
import workoutUtilService from "../../services/workout/workoutUtilService";

type TotalDurationCircleProps = {
  children: React.ReactNode;
};

export const TotalDurationCircle: FC<TotalDurationCircleProps> = ({ children }) => {
  const { duration, completedDuration, currTime, time, isRunning } = useWorkout();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const intialPercentage = (completedDuration / duration) * 100;
  const [background, setBackground] = useState(_generateGradient(intialPercentage || 1));

  useEffect(() => {
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        const passedTime = Math.abs(time - currTime * 60);
        const currItemPercentage = (passedTime / (currTime * 60)) * 100;
        const currItemDuration = workoutUtilService.calcItemDuration(time);
        const percentage = (completedDuration / duration) * 100 + currItemPercentage;
        setBackground(_generateGradient(currItemPercentage));
      }, 10);

      intervalIdRef.current = id;
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, currTime, time]);

  return (
    <div className="total-duration-circle" style={{ background }}>
      <div className="border">{children}</div>
    </div>
  );
};

function _generateGradient(percentage: number) {
  return `conic-gradient(#6A0DAD ${percentage}%, var(--color-background-light) 0)`;
}
