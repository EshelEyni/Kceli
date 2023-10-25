import { FC } from "react";
import { useDayEdit } from "./DayEditContext";
import { AsyncList } from "../../../components/App/AsyncList/AsyncList";
import { Intake } from "../../../../../shared/types/intake";
import { IntakePreview } from "./IntakePreview";
import "./FavoriteIntakes.scss";

export const FavoriteIntakes: FC = () => {
  const {
    favoriteIntakes,
    isErrorFavoriteIntakes,
    isLoadingFavoriteIntakes,
    isSuccessFavoriteIntakes,
  } = useDayEdit();

  return (
    <section className="day-edit__favorite-intakes" data-testid="day-edit-favorite-intakes">
      <AsyncList
        entityName="favorite intake"
        items={favoriteIntakes as Intake[]}
        isLoading={isLoadingFavoriteIntakes}
        isError={isErrorFavoriteIntakes}
        isSuccess={isSuccessFavoriteIntakes}
        render={intake => (
          <li key={intake.id}>
            <IntakePreview intake={intake} isFavorite={true} />
          </li>
        )}
        isEmpty={favoriteIntakes?.length === 0}
        className="day-edit__favorite-intakes__list"
      />
    </section>
  );
};
