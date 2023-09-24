import { FC } from "react";
import { ToggledElement, useTodayData } from "../../../contexts/TodayDataContext";
import { Button } from "../../App/Button/Button";

export const Filter: FC = () => {
  const { setOpenedElement } = useTodayData();

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
  ];
  return (
    <ul className="filter">
      {filterBy.map(filter => (
        <li className="filter__item" key={filter.value}>
          <Button onClickFn={() => setOpenedElement(filter.value)}>{filter.name}</Button>
        </li>
      ))}
    </ul>
  );
};
