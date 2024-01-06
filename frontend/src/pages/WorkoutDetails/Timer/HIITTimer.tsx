import { FC, useRef, useState } from "react";
import { Button } from "../../../components/App/Button/Button";
import { FaPause, FaPlay } from "react-icons/fa6";
import { getTimeCount } from "../../../services/util/utilService";
import { useWorkerTimer } from "../../../hooks/useWorkerTimer";
import { IoSettingsSharp } from "react-icons/io5";
import "./HIITTimer.scss";

type HIITSettings = {
  work: number;
  rest: number;
};

const sound = new Audio("/assets/sounds/Buzzer.mp3");

const defaultSettings: HIITSettings = {
  work: 60,
  rest: 120,
};

export const HIITTimer: FC = () => {
  const [isSettingShown, setIsSettingShown] = useState(false);
  const [settings, setSettings] = useState<HIITSettings>(defaultSettings);
  const [time, setTime] = useState(settings.work);
  const [isRunning, setIsRunning] = useState(false);
  const currTimeKeyRef = useRef<"work" | "rest">("work");
  const settingRef = useRef<HIITSettings>(defaultSettings);
  useWorkerTimer({
    sound,
    time,
    setTime,
    isRunning,
    onEndTime: () => {
      sound.volume = 0.5;
      sound.play();
      const nextTimeKey = currTimeKeyRef.current === "work" ? "rest" : "work";
      currTimeKeyRef.current = nextTimeKey;
      setTime(settingRef.current[nextTimeKey]);

      // this boolean is in charge of stopping the timer
      return false;
    },
  });

  function handleToggleHIITIsRunningBtnClick() {
    if (time <= 0) return;
    setIsRunning(prev => !prev);
  }

  function handleToggleHIITSettingsBtnClick() {
    setIsSettingShown(prev => !prev);
    if (isSettingShown) {
      setTime(settings.work);
      settingRef.current = settings;
    }
  }

  function handleWorkInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSettings(prev => ({ ...prev, work: +e.target.value }));
  }

  function handleRestInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSettings(prev => ({ ...prev, rest: +e.target.value }));
  }

  return (
    <>
      <div className="hiit-timer">
        <Button className="hiit-timer__btn" onClickFn={handleToggleHIITIsRunningBtnClick}>
          {isRunning ? <FaPause data-testid="pause-icon" /> : <FaPlay data-testid="play-icon" />}
        </Button>
        <span className="timer__count">{getTimeCount(time)}</span>
        <Button className="hiit-timer__btn" onClickFn={handleToggleHIITSettingsBtnClick}>
          <IoSettingsSharp />
        </Button>
      </div>

      {isSettingShown && (
        <div className="hiit-settings">
          <div className="hiit-settings__input">
            <label htmlFor="work" className="hiit-settings__input__label">
              Work
            </label>
            <input
              className="hiit-settings__input__input"
              type="number"
              value={settings.work}
              onChange={handleWorkInputChange}
              id="work"
            />
          </div>
          <div className="hiit-settings__input">
            <label htmlFor="rest" className="hiit-settings__input__label">
              Rest
            </label>
            <input
              className="hiit-settings__input__input"
              type="number"
              value={settings.rest}
              onChange={handleRestInputChange}
              id="rest"
            />
          </div>
        </div>
      )}
    </>
  );
};
