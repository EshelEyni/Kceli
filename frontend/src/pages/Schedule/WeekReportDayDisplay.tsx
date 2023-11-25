import { FC, useState } from "react";
import "./WeekReportDayDisplay.scss";
import { Header } from "../../components/App/Header/Header";
import { CalenderDay } from "../../types/app";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import { List } from "../../components/App/List/List";
import { Intake } from "../../../../shared/types/intake";
import { IntakePreview } from "./IntakesPreview";
import { Button } from "../../components/App/Button/Button";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

type WeekReportDayDisplayProps = {
  calenderDay: CalenderDay;
};

export const WeekReportDayDisplay: FC<WeekReportDayDisplayProps> = ({ calenderDay }) => {
  const { backgroundColor, data, date } = calenderDay;
  const isSmallScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const [isExpanded, setIsExpanded] = useState(!isSmallScreen);
  const [isIntakesExpanded, setIsIntakesExpanded] = useState(false);
  if (!data) return null;
  const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });

  const consumedCalories = calorieUtilService.getTotalCalories(data);
  const remainingCalories = calorieUtilService.calcRemainingCaloriesFromDayData(data);
  const calConsumedSufix = remainingCalories > 0 ? "remaining" : "over your limit";
  const exceededPerc = calorieUtilService.getDailyExcessRate({
    remainingCalories,
    targetCaloricIntake: data.targetCaloricIntake,
  });
  const calConsumedTitle = ` calories ${calConsumedSufix}`;
  const numOfIntakes = data.intakes.length;

  function handleExpandBtnClick() {
    setIsExpanded(p => !p);
  }

  return (
    <article className="week-report-day-display">
      <Header className="week-report-day-display__header" style={{ backgroundColor }}>
        <h3>{dayName}</h3>
      </Header>
      {isExpanded && (
        <div className="week-report-day-display__wrapper">
          <div className="week-report-day-display__calories">
            <table>
              <tbody>
                <tr>
                  <th>Consumed Calories</th>
                  <td>{consumedCalories}</td>
                </tr>
                <tr>
                  <th>{calConsumedTitle}</th>
                  <td>{Math.abs(remainingCalories)}</td>
                </tr>
                <tr>
                  <th>Target Caloric Intake</th>
                  <td>{data.targetCaloricIntake}</td>
                </tr>
                <tr>
                  <th>Exceeded By</th>
                  <td>{exceededPerc}%</td>
                </tr>
                <tr>
                  <th>workouts</th>
                  <td>{data.workouts.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button
            className="week-report-day-display__show-intakes-btn"
            onClickFn={() => setIsIntakesExpanded(!isIntakesExpanded)}
          >
            <span>{numOfIntakes} Intakes</span>
            {isIntakesExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </Button>
          {isIntakesExpanded && (
            <List
              className="week-report-day-display__intakes-list"
              items={data.intakes as Intake[]}
              render={intake => <IntakePreview intake={intake} key={intake.id} />}
            />
          )}

          {data.workouts.length > 0 && (
            <div className="week-report-day-display__workouts">
              <h3>Workouts:</h3>
              <List
                className="week-report-day-display__workouts__list"
                items={data.workouts}
                render={(workout, i) => {
                  const { items, description } = workout;
                  const completedPercantage = Math.round(
                    (items.filter(item => item.isCompleted).length / items.length) * 100
                  );
                  return (
                    <p key={i}>
                      <strong>{description}</strong> ({completedPercantage}% completed)
                    </p>
                  );
                }}
              />
            </div>
          )}
        </div>
      )}
      {isSmallScreen && (
        <Button className="week-report-day-display__expand-btn" onClickFn={handleExpandBtnClick}>
          {isExpanded ? "Hide" : "Show"}
        </Button>
      )}
    </article>
  );
};
