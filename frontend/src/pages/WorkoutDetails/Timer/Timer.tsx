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

export const Timer: FC = () => {
  const { time, setTime, isRunning, setIsRunning, onResetTimer, setInitialTime } = useWorkout();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const minutesDisplay = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const secondsDisplay = Math.floor(time % 60);
  const fractionDisplay = ((time % 1) * 100).toFixed(0).padStart(2, "0").slice(-2);

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
    const sound = new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            sound.play();
            clearInterval(id);
            setIsRunning(false);
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
  }, [isRunning, setTime, setIsRunning]);

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
        <Button className="timer__controls__btn" onClickFn={handleClearTimerBtnClick}>
          <FaArrowRotateLeft />
        </Button>
        <Button className="timer__controls__btn" onClickFn={handleIncrementTimerBtnClick}>
          <MdOutlineTimer10Select />
        </Button>
        <Button className="timer__controls__btn" onClickFn={handleToggleIsRunningBtnClick}>
          {isRunning ? <FaPause /> : <FaPlay />}
        </Button>
        <Button className="timer__controls__btn" onClickFn={onResetTimer}>
          <FaClockRotateLeft />
        </Button>
      </div>
    </section>
  );
};
