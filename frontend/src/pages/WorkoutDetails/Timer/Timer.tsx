import { FC, useState } from "react";
import { useWorkout } from "../WorkoutContext";
import { Button } from "../../../components/App/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa";
import { SecondsCircle } from "./SecondsCircle";
import { ItemDurationCircle } from "./ItemDurationCircle";
import { TotalDurationCircle } from "./TotalDurationCircle";
import { FaArrowRotateLeft, FaClockRotateLeft } from "react-icons/fa6";
import { MdOutlineTimer10Select } from "react-icons/md";
import { LuTimerOff, LuTimer } from "react-icons/lu";
import "./Timer.scss";
import { getTimeCount } from "../../../services/util/utilService";
import { HIITTimer } from "./HIITTimer";
import { useWorkerTimer } from "../../../hooks/useWorkerTimer";

const sound = new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");

export const Timer: FC = () => {
  const [isHIITShown, setIsHIITShown] = useState(false);
  const { time, setTime, isRunning, setIsRunning, onResetTimer, setInitialTime } = useWorkout();
  useWorkerTimer({
    sound,
    time,
    setTime,
    isRunning,
    onEndTime: () => {
      sound.volume = 0.5;
      sound.play();
      setIsRunning(false);
      setTime(0);

      // this boolean is in charge of stopping the timer
      return true;
    },
  });

  function handleToggleIsRunningBtnClick() {
    if (time <= 0) return;
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

  function handleToggleHIITModeBtnClick() {
    setIsHIITShown(prev => !prev);
  }

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

      {isHIITShown && <HIITTimer />}

      <div className="timer__controls">
        <Button className="timer__controls__btn" onClickFn={handleToggleHIITModeBtnClick}>
          {isHIITShown ? (
            <LuTimerOff data-testid="timer-off-icon" />
          ) : (
            <LuTimer data-testid="timer-on-icon" />
          )}
        </Button>
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
