import { FC, useEffect, useRef, useState } from "react";
import "./Timer.scss";

type TimerProps = {
  minutes: number;
  isRunning: boolean;
};

export const Timer: FC<TimerProps> = ({ minutes, isRunning }) => {
  const [time, setTime] = useState(minutes * 60);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sound = new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            sound.play();
            clearInterval(id);
            return 0;
          }
          return prevTime - 0.01;
        });
      }, 10);

      intervalIdRef.current = id;
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning]);

  const minutesDisplay = Math.floor(time / 60);
  const secondsDisplay = Math.floor(time % 60);
  const fractionDisplay = ((time % 1) * 100).toFixed(0).padStart(2, "0");

  return (
    <section className="timer">
      <span>
        {minutesDisplay}:{secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay}.
        {fractionDisplay}
      </span>
    </section>
  );
};
