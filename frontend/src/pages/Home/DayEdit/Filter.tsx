import { FC } from "react";
import { ToggledElement, useDayEdit } from "./DayEditContext";
import { Button } from "../../../components/App/Button/Button";
import "./Filter.scss";

export const DayEditFilter: FC = () => {
  const { dailyData, setOpenedElement } = useDayEdit();
  if (!dailyData) return null;

  const filterBy = [
    {
      name: "add",
      value: ToggledElement.IntakeEdit,
    },
    {
      name: "intakes",
      value: ToggledElement.IntakeList,
      isShown: dailyData?.intakes.some(intake => intake.isRecorded === true),
    },
    {
      name: "unrecorded",
      value: ToggledElement.UnRecordedIntakeList,
      isShown: dailyData?.intakes.some(intake => intake.isRecorded === false),
    },
    {
      name: "favorites",
      value: ToggledElement.FavoriteIntake,
    },
    {
      name: "water",
      value: ToggledElement.Water,
    },
    {
      name: "weight",
      value: ToggledElement.WeightWaistInput,
    },
    {
      name: "workouts",
      value: ToggledElement.Workouts,
      isShown: dailyData?.workouts.length > 0,
    },
    {
      name: "query",
      value: ToggledElement.Query,
    },
  ];

  return (
    <ul className="day-edit__filter" data-testid="day-edit-filter">
      {filterBy.map(item => {
        if (item.isShown === false) return null;
        return (
          <li className="filter__item" key={item.value}>
            <Button className="btn" onClickFn={() => setOpenedElement(item.value)}>
              {item.name}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
