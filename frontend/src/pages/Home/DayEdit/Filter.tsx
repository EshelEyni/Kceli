import { FC } from "react";
import { ToggledElement, useDayEdit } from "./DayEditContext";
import { Button } from "../../../components/App/Button/Button";
import "./Filter.scss";

export const Filter: FC = () => {
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
    },
    {
      name: "unrecorded",
      value: ToggledElement.UnRecordedIntakeList,
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
    <ul className="day-edit__filter">
      {filterBy.map(filter => {
        if (filter.isShown === false) return null;
        return (
          <li className="filter__item" key={filter.value}>
            <Button className="btn" onClickFn={() => setOpenedElement(filter.value)}>
              {filter.name}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};
