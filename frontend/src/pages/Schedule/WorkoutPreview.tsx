import { t } from "../../i18n";
import { FC, Fragment } from "react";
import { Workout } from "../../../../shared/types/workout";
import workoutUtilService from "../../services/workout/workoutUtilService";
import "./WorkoutPreview.scss";
import { Header } from "../../components/App/Header/Header";
import { FaCheck } from "react-icons/fa";

type WorkoutPreviewProps = {
  workout: Workout;
  isTableShown?: boolean;
};

export const WorkoutPreview: FC<WorkoutPreviewProps> = ({ workout, isTableShown = true }) => {
  const { description, type, items } = workout;
  const duration = workoutUtilService.calcWorkoutDuration({ workout }) + " min";
  const completedPercantage = Math.round(
    (items.filter(item => item.isCompleted).length / items.length) * 100
  );

  return (
    <article className="day-report__workout-preview">
      <Header className="day-report__workout-preview__header">
        <h3>
          {description} - {type} - {duration} - {completedPercantage}
          {t("% completed")}{" "}
        </h3>
      </Header>
      {isTableShown && (
        <table className="day-report__workout-preview__table">
          <thead className="day-report__workout-preview__table__header">
            <tr>
              <th>{t("Exercise")}</th>
              <th>{t("Duration")}</th>
              <th>{t("Reps")}</th>
              <th>{t("Sets")}</th>
              <th>{t("Weight")}</th>
              <th className="day-report__workout-preview__table__header__completed">
                {t("Completed")}
              </th>
            </tr>
          </thead>
          <tbody className="day-report__workout-preview__table__body">
            {items.map((item, index) => {
              const duration = workoutUtilService.calcItemDuration(item) + " min";

              if (item.type === "superset")
                return (
                  <Fragment key={`superset-${index}`}>
                    <tr>
                      <td>{item.name}</td>
                      <td>{duration}</td>
                      <td />
                      <td>{item.sets}</td>
                      <td />
                      <td className="completed">{item.isCompleted ? <FaCheck /> : ""}</td>
                    </tr>

                    {item.items.map((subItem, subIndex) => {
                      return (
                        <tr key={`superset-${index}-subitem-${subIndex}`}>
                          <td>{subItem.name}</td>
                          <td />
                          <td>{subItem.reps}</td>
                          <td />
                          <td>
                            {subItem.weight} {t(subItem.weightUnit)}
                          </td>
                          <td className="completed" />
                        </tr>
                      );
                    })}
                  </Fragment>
                );

              if (item.type === "anaerobic")
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{duration}</td>
                    <td>{item.reps}</td>
                    <td>{item.sets}</td>
                    <td>
                      {item.weight} {t(item.weightUnit)}
                    </td>
                    <td className="completed">{item.isCompleted ? <FaCheck /> : ""}</td>
                  </tr>
                );

              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{duration}</td>
                  <td />
                  <td />
                  <td />
                  <td className="completed">{item.isCompleted ? <FaCheck /> : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </article>
  );
};
