import { FC, useState } from "react";
import { useDayEdit } from "./DayEditContext";
import "./HungerMeter.scss";
import { Button } from "../../../components/App/Button/Button";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { HungerTimer } from "./HungerTimer";

export const HungerMeter: FC = () => {
  const { dailyData, updateDailyData, isLoadingUpdate } = useDayEdit();
  const [level, setLevel] = useState(1);
  if (!dailyData) return null;

  const sortedHungerEvents = dailyData.hungerEvents.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  function changeHungerLevel(n: number) {
    if (!dailyData) return null;
    setLevel(prev => {
      const newLevel = prev + n;
      if (newLevel < 1 || newLevel > 5) return prev;
      return newLevel;
    });
  }

  function addHungerEvent() {
    if (!dailyData || isLoadingUpdate) return null;
    updateDailyData({
      id: dailyData.id,
      data: {
        hungerEvents: [...dailyData.hungerEvents, { level, date: new Date() }],
      },
    });
  }

  return (
    <section className="hunger-meter">
      <p className="hunger-meter__desc">
        This is the <strong>hunger meter</strong>.
        <br /> The point is to track your hunger level throughout the day. You can set the level by
        clicking the buttons below, add a hunger event by clicking the button below.
      </p>
      <section className="hunger-meter__level-setter">
        <h3>hunger level</h3>
        {isLoadingUpdate ? (
          <SpinnerLoader containerSize={{ height: "50px" }} />
        ) : (
          <>
            <div className="hunger-meter__level-setter__btns">
              <Button onClickFn={() => changeHungerLevel(-1)}>
                <FaMinus />
              </Button>
              <span>{level}</span>
              <Button onClickFn={() => changeHungerLevel(1)}>
                <FaPlus />
              </Button>
            </div>
            <Button onClickFn={addHungerEvent}>add hunger event</Button>
          </>
        )}
      </section>

      {sortedHungerEvents.length > 0 && (
        <section className="hunger-meter__events">
          <h3>hunger events</h3>
          <div className="hunger-meter__events__table-container">
            <table>
              <thead>
                <tr>
                  <th>time</th>
                  <th>level</th>
                </tr>
              </thead>
              <tbody>
                {sortedHungerEvents.map((event, i) => {
                  const formattedDate = new Intl.DateTimeFormat("en-GB", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  }).format(new Date(event.date));

                  return (
                    <tr key={i}>
                      <td>{formattedDate}</td>
                      <td>{event.level}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <HungerTimer />
    </section>
  );
};
