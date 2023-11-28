import { FC } from "react";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import { Button } from "../../../components/App/Button/Button";
import "./Filter.scss";

export const DayEditFilter: FC = () => {
  const { dailyData, setOpenedTab, setSearchParams, color } = useDayEdit();
  if (!dailyData) return null;

  function handleBtnClick(value: DayEditTab) {
    setOpenedTab(value);
    const searchParams = new URLSearchParams({ tab: value });
    setSearchParams(searchParams);
  }

  const filterBy = [
    {
      name: "add",
      value: DayEditTab.IntakeEdit,
    },
    {
      name: "intakes",
      value: DayEditTab.IntakeList,
      isShown: dailyData?.intakes.some(intake => intake.isRecorded === true),
    },
    {
      name: "unrecorded",
      value: DayEditTab.UnRecordedIntakeList,
      isShown: dailyData?.intakes.some(intake => intake.isRecorded === false),
    },
    {
      name: "favorites",
      value: DayEditTab.FavoriteIntake,
    },
    {
      name: "water",
      value: DayEditTab.Water,
    },
    {
      name: "weight",
      value: DayEditTab.WeightWaistInput,
    },
    {
      name: "workouts",
      value: DayEditTab.Workouts,
    },
    {
      name: "query",
      value: DayEditTab.Query,
    },
  ];

  return (
    <ul className="day-edit__filter" data-testid="day-edit-filter">
      {filterBy.map(item => {
        if (item.isShown === false) return null;
        return (
          <li className="filter__item" key={item.value}>
            <Button
              style={{ color, border: `1px solid ${color}` }}
              onClickFn={() => handleBtnClick(item.value)}
            >
              {item.name}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
