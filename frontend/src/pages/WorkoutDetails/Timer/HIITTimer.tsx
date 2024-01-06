import { FC, useEffect, useRef, useState } from "react";
import { Button } from "../../../components/App/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa6";
import { getTimeCount } from "../../../services/util/utilService";
type HIITSettings = {
  work: number;
  rest: number;
};

type HIITState = {
  isActive: boolean;
  isSettingShown: boolean;
  settings: HIITSettings;
  time: number;
  isRunning: boolean;
  currTimeKey: "work" | "rest";
};

const buzzerSound = new Audio("/assets/sounds/Buzzer.mp3");

export const HIITTimer: FC = () => {
  const HIITIntervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const [HIITState, setHIITState] = useState<HIITState>({
    isActive: false,
    isSettingShown: false,
    settings: {
      work: 13,
      rest: 30,
    },
    time: 0,
    isRunning: false,
    currTimeKey: "work",
  });

  function handleToggleHIITIsRunningBtnClick() {
    if (HIITState.time <= 0) return;
    setHIITState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }

  useEffect(() => {
    const { current: intervalId } = HIITIntervalIdRef;

    if (HIITState.isRunning) {
      const id = setInterval(() => {
        setHIITState(prevState => {
          if (prevState.time >= 0) return { ...prevState, time: prevState.time - 0.01 };
          buzzerSound.volume = 0.5;
          buzzerSound.play();
          const currTimeKey = prevState.currTimeKey === "work" ? "rest" : "work";
          return {
            ...prevState,
            time: prevState.settings[currTimeKey],
            currTimeKey,
          };
        });
      }, 10);

      HIITIntervalIdRef.current = id;
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [HIITState]);

  return (
    <>
      <div className="hiit-timer">
        <Button className="hiit-timer__btn" onClickFn={handleToggleHIITIsRunningBtnClick}>
          {HIITState.isRunning ? (
            <FaPause data-testid="pause-icon" />
          ) : (
            <FaPlay data-testid="play-icon" />
          )}
        </Button>
        <span className="timer__count">{getTimeCount(HIITState.time)}</span>
      </div>

      {HIITState.isSettingShown && (
        <div className="timer__hiit-settings">
          <div className="timer__hiit-settings__work">
            <span className="timer__hiit-settings__work__label">Work</span>
            <input
              className="timer__hiit-settings__work__input"
              type="number"
              value={HIITState.settings.work}
            />
          </div>
          <div className="timer__hiit-settings__rest">
            <span className="timer__hiit-settings__rest__label">Rest</span>
            <input
              className="timer__hiit-settings__rest__input"
              type="number"
              value={HIITState.settings.rest}
            />
          </div>
        </div>
      )}
    </>
  );
};
