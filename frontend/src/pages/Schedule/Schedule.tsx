import { FC } from "react";
import { ScheduleGrid } from "../../components/Schedule/ScheduleGrid/ScheduleGrid";
import "./Schedule.scss";

const SchedulePage: FC = () => {
  return (
    <main className="schedule-page">
      <ScheduleGrid />
    </main>
  );
};

export default SchedulePage;
