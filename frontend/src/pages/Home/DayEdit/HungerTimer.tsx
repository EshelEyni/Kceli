import { FC, useEffect, useRef, useState } from "react";
import "./HungerTimer.scss";
import { Button } from "../../../components/App/Button/Button";
import { getTimeCount } from "../../../services/util/utilService";
import { FaPlay, FaPause } from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
const sound = new Audio("/assets/sounds/SamsungRingtoneSoundEffect.mp3");

export const HungerTimer: FC = () => {
  const [time, setTime] = useState(0.1 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  function handleAddTenMinBtnClick() {
    setTime(prevTime => prevTime + 10 * 60);
    setIsRunning(false);
  }

  function handleResetBtnClick() {
    setTime(5 * 60);
    setIsRunning(false);
  }

  function handlePlayBtnClick() {
    setIsRunning(p => !p);
  }

  useEffect(() => {
    const { current: intervalId } = intervalIdRef;

    if (isRunning) {
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime >= 0) return prevTime - 0.01;
          setIsRunning(false);
          sound.volume = 0.5;
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
    <section className="hunger-timer">
      <div className="hunger-timer__time">
        <span>{getTimeCount(time)}</span>
      </div>
      <div className="hunger-timer__controls">
        <Button className="hunger-timer__controls__btn" onClickFn={handleAddTenMinBtnClick}>
          <span>+10m</span>
        </Button>
        <Button className="hunger-timer__controls__btn" onClickFn={handleResetBtnClick}>
          <LuTimerReset />
        </Button>
        <Button className="hunger-timer__controls__btn" onClickFn={handlePlayBtnClick}>
          {isRunning ? <FaPause /> : <FaPlay />}
        </Button>
      </div>
    </section>
  );
};
