import { FC } from "react";
import { CalenderDay } from "../../types/app";
import "./DaysReport.scss";

type DaysReportProps = {
  days: CalenderDay[];
};

export const DaysReport: FC<DaysReportProps> = ({ days }) => {
  return (
    <section className="days-report">
      {days.map(day => {
        return (
          <div className="day-report" key={day.date.toISOString()}>
            <h3 className="day-report__date">
              {day.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
        );
      })}
    </section>
  );
};
