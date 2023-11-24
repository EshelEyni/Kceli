import { FC } from "react";
import { useDayEdit } from "./DayEditContext";
import { formatDateToRelativeTime } from "../../../services/util/utilService";
import "./LastTimeYouAteTitle.scss";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { Intake } from "../../../../../shared/types/intake";

export const LastTimeYouAteTitle: FC = () => {
  const { dailyData } = useDayEdit();
  if (!dailyData) return null;
  const sortedIntakes = intakeUtilService.sortIntakesByRecordedAt(dailyData.intakes as Intake[]);
  const lastMeal = sortedIntakes.findLast(intake => intake.isRecorded && intake.type === "food");
  if (!lastMeal) return null;
  const lastMealTime = formatDateToRelativeTime(lastMeal.recordedAt as string);

  return <h5 className="last-time-you-ate-title">Last time you ate: {lastMealTime}</h5>;
};
