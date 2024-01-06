import { FC, useEffect, useRef, useState } from "react";
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
import Worker from "../../../workers/timerWorker?worker";

const sound = new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");

export const Timer: FC = () => {
  const [isHIITShown, setIsHIITShown] = useState(false);
  const { time, setTime, isRunning, setIsRunning, onResetTimer, setInitialTime } = useWorkout();
  const workerRef = useRef<Worker>();
  const timeRef = useRef(time);

  function handleToggleIsRunningBtnClick() {
    if (time <= 0) return;
    console.log("handleToggleIsRunningBtnClick", new Date().toLocaleTimeString());
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

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    // Initialize the web worker
    workerRef.current = new Worker();
    if (!workerRef.current) return;

    workerRef.current.onmessage = e => {
      if (e.data === "tick" && timeRef.current >= 0.01) {
        setTime(prevTime => prevTime - 0.01);
      } else {
        setIsRunning(false);
        setTime(0);
        sound.volume = 0.5;
        sound.play();
        console.log("stop from inside", new Date().toLocaleTimeString());
        if (!workerRef.current) return;
        workerRef.current.postMessage({ action: "stop" });
      }
    };

    return () => {
      if (workerRef.current) workerRef.current.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!workerRef.current) return;
    if (isRunning) workerRef.current.postMessage({ action: "start", interval: 10 });
    else workerRef.current.postMessage({ action: "stop" });
  }, [isRunning]);

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
