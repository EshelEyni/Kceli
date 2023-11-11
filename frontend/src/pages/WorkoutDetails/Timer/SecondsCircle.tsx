import { FC, useEffect, useRef, useState } from "react";
import { useWorkout } from "../WorkoutContext";
import "./SecondsCircle.scss";

type SecondsCircleProps = {
  children: React.ReactNode;
};

export const SecondsCircle: FC<SecondsCircleProps> = ({ children }) => {
  const { isRunning } = useWorkout();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const prevValue = useRef(0);
  const [background, setBackground] = useState(_generateGradient(1));

  useEffect(() => {
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        setBackground(_generateGradient(prevValue.current));
        prevValue.current = prevValue.current === 100 ? 0 : prevValue.current + 1;
      }, 10);

      intervalIdRef.current = id;
    } else {
      if (intervalId) clearInterval(intervalId);
      setBackground(_generateGradient(0));
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  return (
    <div className="seconds-circle" data-testid="seconds-circle" style={{ background }}>
      {children}
    </div>
  );
};

function _generateGradient(percentage: number) {
  return `radial-gradient(closest-side,  var(--color-background) 85%, transparent 87%),
        conic-gradient(var(--color-text-gray) ${percentage}%, var(--color-background-light) 0)`;
}
