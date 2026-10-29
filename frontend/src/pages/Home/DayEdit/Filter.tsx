import { FC } from "react";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import { Button } from "../../../components/App/Button/Button";
import "./Filter.scss";

export const DayEditFilter: FC = () => {
  const { dailyData, setOpenedTab, setSearchParams, openedTab } = useDayEdit();
  if (!dailyData) return null;

  function handleBtnClick(value: DayEditTab) {
    setOpenedTab(value);
    const searchParams = new URLSearchParams({ tab: value });
    setSearchParams(searchParams);
  }

  const filterBy = [
    {
      name: "Log meal",
      value: DayEditTab.IntakeEdit,
    },
    {
      name: "Diary",
      value: DayEditTab.IntakeList,
    },
    {
      name: "Drafts",
      value: DayEditTab.UnRecordedIntakeList,
      isShown: dailyData?.intakes.some(intake => intake.isRecorded === false),
    },
    {
      name: "Saved meals",
      value: DayEditTab.FavoriteIntake,
    },
    {
      name: "Check-in",
      value: DayEditTab.WeightWaistInput,
    },
    {
      name: "Nutrition help",
      value: DayEditTab.Query,
    },
    {
      name: "Goals",
      value: DayEditTab.Goals,
    },
  ];

  return (
    <ul className="day-edit__filter" data-testid="day-edit-filter">
      {filterBy.map(item => {
        if (item.isShown === false) return null;
        return (
          <li className="filter__item" key={item.value}>
            <Button
              className={openedTab === item.value ? "active" : ""}
              aria-pressed={openedTab === item.value}
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
