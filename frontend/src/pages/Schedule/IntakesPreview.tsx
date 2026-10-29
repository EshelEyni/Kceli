import { getLocale } from "../../i18n";
import { t } from "../../i18n";
import { FC, useState } from "react";
import { Intake } from "../../../../shared/types/intake";
import calorieUtilService from "../../services/calorieUtil/calorieUtilService";
import "./IntakePreview.scss";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Header } from "../../components/App/Header/Header";
import classnames from "classnames";

type IntakePreviewProps = {
  intake: Intake;
};

export const IntakePreview: FC<IntakePreviewProps> = ({ intake }) => {
  const [isTableShown, setIsTableShown] = useState(false);
  const title = intake.name || intake.items.map(item => item.name).join(", ");
  const totalCalories = calorieUtilService.getTotalCalories(intake);
  const time = intake.recordedAt
    ? new Date(intake.recordedAt).toLocaleTimeString(getLocale(), {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  function handleHeaderClick() {
    setIsTableShown(!isTableShown);
  }

  return (
    <article
      className={classnames("day-report__intake-preview", { unrecorded: !intake.isRecorded })}
    >
      <Header className="day-report__intake-preview__header" onClickFn={handleHeaderClick}>
        <h3 className="day-report__intake-preview__header__title">
          {title} - {totalCalories} {t("kcal -")} {time}
        </h3>
        <div>{isTableShown ? <FaChevronUp /> : <FaChevronDown />}</div>
      </Header>
      {isTableShown && (
        <>
          <table className="day-report__intake-preview__table">
            <thead className="day-report__intake-preview__table__head">
              <tr>
                <th>{t("Item")}</th>
                <th>{t("Calories")}</th>
                <th>{t("Weight")}</th>
              </tr>
            </thead>
            <tbody className="day-report__intake-preview__table__body">
              {intake.items.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.calories}</td>
                  <td>
                    {item.quantity} {t(item.unit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!intake.isRecorded && (
            <h4 className="day-report__intake-preview__unrecorded">{t("unrecorded")}</h4>
          )}
        </>
      )}
    </article>
  );
};
