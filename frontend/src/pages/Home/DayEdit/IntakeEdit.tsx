import { t } from "../../../i18n";
import { FC } from "react";
import toast from "react-hot-toast";
import { FavoriteIntake, NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { List } from "../../../components/App/List/List";
import { IntakeItemEdit } from "./IntakeItemEdit";
import { Button } from "../../../components/App/Button/Button";
import { useDayEdit } from "./DayEditContext";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { IntakeItemEditProvider } from "./IntakeItemEditContext";
import { useAddFavoriteIntake } from "../../../hooks/useAddFavoriteIntake";
import { useUpdateFavoriteIntake } from "../../../hooks/useUpdateFavoriteIntake";
import { LastTimeYouAteTitle } from "./LastTimeYouAteTitle";
import { PreSaveCalorieCount } from "./PreSaveCalorieCount";
import "./IntakeEdit.scss";
import "./MealEntry.scss";
import { FoodScanner } from "./FoodScanner";

export const IntakeEdit: FC = () => {
  const {
    dailyData,
    isLoading: isLoadingDailyData,
    isLoadingUpdate,
    intake,
    updateDailyData,
    setIntake,
  } = useDayEdit();
  const { addFavoriteIntake, isLoading: isLoadingAddToFav } = useAddFavoriteIntake();
  const { updateFavoriteIntake, isLoading: isLoadingUpdateFav } = useUpdateFavoriteIntake();

  const isLoading =
    isLoadingDailyData || isLoadingUpdate || isLoadingAddToFav || isLoadingUpdateFav;

  const isTimeInputShown = intake.recordedAt && intake.isRecorded;

  function handleTimeInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value: time } = e.target;
    const [hours, minutes] = time.split(":");
    const recordedAt = new Date(intake.recordedAt as string);
    recordedAt.setHours(+hours);
    recordedAt.setMinutes(+minutes);
    setIntake(prev => ({ ...prev, recordedAt }));
  }

  function handleClearButtonClick() {
    setIntake(intakeUtilService.getDefaultIntake());
  }

  function handleSaveToFavoriteButtonClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const iValidIntake = intake.items.every(item => item.name.length && item.quantity > 0);
    if (!iValidIntake) return toast.error(t("Please fill all intake items"));

    (intake.recordedAt = null), (intake.isRecorded = false);
    if ("userId" in intake) updateFavoriteIntake(intake as FavoriteIntake);
    else addFavoriteIntake(intake);
    setIntake(intakeUtilService.getDefaultIntake());
  }

  function handleSaveLaterButtonClick() {
    setIntake(prev => ({
      ...prev,
      recordedAt: !prev.isRecorded ? null : new Date(),
      isRecorded: !prev.isRecorded,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dailyData) return;
    const iValidIntake = intake.items.every(item => item.name.length && item.quantity > 0);
    if (!iValidIntake) return toast.error(t("Please fill all intake items"));
    if (intake.isRecorded && !intake.recordedAt) intake.recordedAt = new Date();
    const isNewIntake = !dailyData.intakes.some(i => i.id === intake.id);
    const updatedIntakes = isNewIntake
      ? [...dailyData.intakes, intake]
      : dailyData.intakes.map(i => (i.id === intake.id ? intake : i));
    updateDailyData({ id: dailyData.id, data: { intakes: updatedIntakes } }, {
      onSuccess: () => {
        setIntake(intakeUtilService.getDefaultIntake());
        toast.success(t("Meal saved"));
      },
    });
  }

  function toLocalTime(isoString: string) {
    const date = new Date(isoString);
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);
    return date.toISOString().slice(11, 16);
  }

  return (
    <form className="intake-edit" onSubmit={handleSubmit} data-testid="intake-edit">
      {isLoading && <SpinnerLoader containerSize={{ height: "75px", width: "100%" }} />}

      {!isLoading && (
        <>
          {isTimeInputShown && (
            <header className="intake-edit__header" data-testid="intake-edit-header">
              <input
                className="intake-edit__header__time-input"
                type="time"
                aria-label={t("Meal time")}
                value={toLocalTime(intake.recordedAt as string)}
                onChange={handleTimeInputChange}
                data-testid="intake-edit-time-input"
              />
            </header>
          )}
          <div className="meal-entry-heading">
            <div>
              <h3>{t("What did you eat?")}</h3>
              <p>{t("Add your food and portion below.")}</p>
            </div>
            <FoodScanner />
          </div>
          <List
            items={intake.items}
            render={(item: NewIntakeItem) => {
              return (
                <IntakeItemEditProvider intakeItem={item} key={item.id}>
                  <IntakeItemEdit />
                </IntakeItemEditProvider>
              );
            }}
            className="intake-edit-item-list"
            dataTestId="intake-edit-item-list"
          />
        </>
      )}

      <div className="intake-edit__info-container" data-testid="intake-edit-info-container">
        <LastTimeYouAteTitle />
        <PreSaveCalorieCount />
      </div>

      <div
        className="intake-edit-btns-container meal-save-actions"
        data-testid="intake-edit-btns-container"
      >
        <Button className="intake-edit-btn meal-save-primary" type="submit" isDisabled={isLoading}>
          {intake.isRecorded ? t("Save meal") : t("Save draft")}
        </Button>
        <details className="meal-more-options">
          <summary>{t("More options")}</summary>
          <div className="meal-secondary-actions">
            <label className="meal-manual-toggle">
              <input
                type="checkbox"
                checked={!intake.isRecorded}
                onChange={handleSaveLaterButtonClick}
                disabled={isLoading}
              />
              {t("Save as draft")}
            </label>
            <Button onClickFn={handleSaveToFavoriteButtonClick} isDisabled={isLoading}>
              {t("Save To Fav")}
            </Button>
            <Button onClickFn={handleClearButtonClick} isDisabled={isLoading}>
              {t("clear")}
            </Button>
          </div>
        </details>
      </div>
    </form>
  );
};
