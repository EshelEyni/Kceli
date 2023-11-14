import { FC, useState } from "react";
import { Intake } from "../../../../shared/types/intake";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import "./IntakePreview.scss";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Header } from "../../components/App/Header/Header";

type IntakePreviewProps = {
  intake: Intake;
};

export const IntakePreview: FC<IntakePreviewProps> = ({ intake }) => {
  const [isTableShown, setIsTableShown] = useState(false);
  const title = intake.name || intake.items.map(item => item.name).join(", ");
  const totalCalories = calorieUtilService.getTotalCalories(intake);

  function handleHeaderClick() {
    setIsTableShown(!isTableShown);
  }

  return (
    <article className="day-report__intake-preview">
      <Header className="day-report__intake-preview__header" onClickFn={handleHeaderClick}>
        <h3 className="day-report__intake-preview__header__title">
          {title} {totalCalories} kcal
        </h3>
        <div>{isTableShown ? <FaChevronUp /> : <FaChevronDown />}</div>
      </Header>
      {isTableShown && (
        <table className="day-report__intake-preview__table">
          <thead className="day-report__intake-preview__table__head">
            <tr>
              <th>Item</th>
              <th>Calories</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody className="day-report__intake-preview__table__body">
            {intake.items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.calories}</td>
                <td>
                  {item.quantity} {item.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  );
};
