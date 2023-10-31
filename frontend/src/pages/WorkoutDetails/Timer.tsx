import { FC, useEffect, useRef } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import { Button } from "../../components/App/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa";
import "./Timer.scss";
import { SecondsCircle } from "./SecondsCircle";
import { ItemDurationCircle } from "./ItemDurationCircle";
import { TotalDurationCircle } from "./TotalDurationCircle";

export const Timer: FC = () => {
  const { time, setTime, isRunning, setIsRunning } = useWorkout();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const minutesDisplay = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const secondsDisplay = Math.floor(time % 60);
  const fractionDisplay = ((time % 1) * 100).toFixed(0).padStart(2, "0");

  function handleToggleIsRunning() {
    setIsRunning(prev => !prev);
  }

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
  }, [isRunning, setTime]);

  return (
    <section className="timer">
      <TotalDurationCircle>
        <ItemDurationCircle>
          <SecondsCircle>
            <div className="clock-wrapper">
              <span className="timer__count">
                {minutesDisplay}:{secondsDisplay < 10 ? `0${secondsDisplay}` : secondsDisplay}.
                {fractionDisplay}
              </span>
            </div>
          </SecondsCircle>
        </ItemDurationCircle>
      </TotalDurationCircle>

      <div className="timer__controls">
        <Button className="timer__controls__btn" onClickFn={handleToggleIsRunning}>
          {isRunning ? <FaPause /> : <FaPlay />}
        </Button>
      </div>
    </section>
  );
};
