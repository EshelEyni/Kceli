import { FC, useState, useEffect } from "react";
import "./TotalDurationCircle.scss";
import { useWorkout } from "../WorkoutContext";

type TotalDurationCircleProps = {
  children: React.ReactNode;
};

export const TotalDurationCircle: FC<TotalDurationCircleProps> = ({ children }) => {
  const { duration, completedDuration } = useWorkout();
  const intialPercentage = (completedDuration / duration) * 100;
  const [background, setBackground] = useState(_generateGradient(intialPercentage || 1));

  useEffect(() => {
    const percentage = (completedDuration / duration) * 100;
    setBackground(_generateGradient(percentage));
  }, [completedDuration, duration]);

  return (
    <div
      className="total-duration-circle"
      data-testid="total-duration-circle"
      style={{ background }}
    >
      <div className="total-duration-circle__border">{children}</div>
    </div>
  );
};

function _generateGradient(percentage: number) {
  const clampedPercentage = Math.max(percentage, 0.25);
  return `conic-gradient(#6A0DAD ${clampedPercentage}%, var(--color-background-light) 0)`;
}
