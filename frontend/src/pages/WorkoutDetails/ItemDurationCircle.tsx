import { FC, useState, useEffect, useRef } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import "./ItemDurationCircle.scss";

type ItemDurationCircleProps = {
  children: React.ReactNode;
};

export const ItemDurationCircle: FC<ItemDurationCircleProps> = ({ children }) => {
  const { currTime, time, isRunning } = useWorkout();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [background, setBackground] = useState(_generateGradient(1));

  useEffect(() => {
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        const passedTime = Math.abs(time - currTime * 60);
        const percentage = (passedTime / (currTime * 60)) * 100;
        setBackground(_generateGradient(percentage));
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
    <div className="item-duration-circle" style={{ background }}>
      <div className="border">{children}</div>
    </div>
  );
};

function _generateGradient(percentage: number) {
  return `conic-gradient(var(--color-info) ${percentage}%, var(--color-background-light) 0)`;
}
