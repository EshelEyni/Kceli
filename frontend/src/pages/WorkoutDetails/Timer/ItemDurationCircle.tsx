import { FC, useState, useEffect, useRef } from "react";
import { useWorkout } from "../WorkoutContext";
import "./ItemDurationCircle.scss";

type ItemDurationCircleProps = {
  children: React.ReactNode;
};

export const ItemDurationCircle: FC<ItemDurationCircleProps> = ({ children }) => {
  const { initialTime, time, isRunning } = useWorkout();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [background, setBackground] = useState(_generateGradient(1));

  useEffect(() => {
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        const passedTime = Math.abs((time - initialTime) * 60);
        const percentage = (passedTime / (initialTime * 60)) * 100;
        setBackground(_generateGradient(percentage));
      }, 10);

      intervalIdRef.current = id;
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, initialTime, time]);

  useEffect(() => {
    const passedTime = Math.abs((time - initialTime) * 60);
    const percentage = (passedTime / (initialTime * 60)) * 100;
    setBackground(_generateGradient(percentage));
  }, [initialTime, time]);

  return (
    <div className="item-duration-circle" style={{ background }}>
      <div className="item-duration-circle__border">{children}</div>
    </div>
  );
};

function _generateGradient(percentage: number) {
  const clampedPercentage = Math.max(percentage, 0.25);
  return `conic-gradient(var(--color-info) ${clampedPercentage}%, var(--color-background-light) 0)`;
}
