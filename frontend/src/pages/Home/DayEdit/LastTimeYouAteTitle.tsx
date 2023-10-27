import { FC } from "react";
import { useDayEdit } from "./DayEditContext";
import { formatDateToRelativeTime } from "../../../services/util/utilService";
import "./LastTimeYouAteTitle.scss";

export const LastTimeYouAteTitle: FC = () => {
  const { dailyData } = useDayEdit();
  if (!dailyData) return null;
  const lastMeal = dailyData.intakes.findLast(
    intake => intake.isRecorded && intake.type === "food"
  );
  if (!lastMeal) return null;
  const lastMealTime = formatDateToRelativeTime(lastMeal.recordedAt as unknown as string);

  return <h5 className="last-time-you-ate-title">Last time you ate: {lastMealTime}</h5>;
};
