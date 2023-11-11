import { FC, useEffect, useRef } from "react";
import { useWorkout } from "../WorkoutContext";
import { Button } from "../../../components/App/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa";
import { SecondsCircle } from "./SecondsCircle";
import { ItemDurationCircle } from "./ItemDurationCircle";
import { TotalDurationCircle } from "./TotalDurationCircle";
import { FaArrowRotateLeft, FaClockRotateLeft } from "react-icons/fa6";
import { MdOutlineTimer10Select } from "react-icons/md";
import "./Timer.scss";
const sound = new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");
export function getTimeCount(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const fractions = Math.floor((time % 1) * 100);

  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const formattedFractions = fractions.toString().padStart(2, "0").slice(-2);

  return `${formattedMinutes}:${formattedSeconds}.${formattedFractions}`;
}

export const Timer: FC = () => {
  const { time, setTime, isRunning, setIsRunning, onResetTimer, setInitialTime } = useWorkout();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  function handleToggleIsRunningBtnClick() {
    setIsRunning(prev => !prev);
  }

  function handleClearTimerBtnClick() {
    setTime(0);
    setInitialTime(0);
    setIsRunning(false);
  }

  function handleIncrementTimerBtnClick() {
    setTime(prevTime => prevTime + 10);
    setInitialTime(prevTime => prevTime + 10);
  }

  useEffect(() => {
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime >= 0) return prevTime - 0.01;
          setIsRunning(false);
          sound.play();
          clearInterval(id);
          return 0;
        });
      }, 10);

      intervalIdRef.current = id;
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, setTime, setIsRunning]);

  return (
    <section className="timer" data-testid="timer">
      <TotalDurationCircle>
        <ItemDurationCircle>
          <SecondsCircle>
            <div className="clock-wrapper">
              <span className="timer__count">{getTimeCount(time)}</span>
            </div>
          </SecondsCircle>
        </ItemDurationCircle>
      </TotalDurationCircle>

      <div className="timer__controls">
        <Button className="timer__controls__btn" onClickFn={handleClearTimerBtnClick}>
          <FaArrowRotateLeft data-testid="clear-icon" />
        </Button>
        <Button className="timer__controls__btn" onClickFn={handleIncrementTimerBtnClick}>
          <MdOutlineTimer10Select data-testid="increment-icon" />
        </Button>
        <Button className="timer__controls__btn" onClickFn={handleToggleIsRunningBtnClick}>
          {isRunning ? <FaPause data-testid="pause-icon" /> : <FaPlay data-testid="play-icon" />}
        </Button>
        <Button className="timer__controls__btn" onClickFn={onResetTimer}>
          <FaClockRotateLeft data-testid="reset-icon" />
        </Button>
      </div>
    </section>
  );
};
