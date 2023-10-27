import { FC } from "react";
import toast from "react-hot-toast";
import classnames from "classnames";
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
import { useGetColorByCalories } from "../../../hooks/useGetColorByCalories";
import "./IntakeEdit.scss";

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
  const { backgroundColor } = useGetColorByCalories();

  const isLoading =
    isLoadingDailyData || isLoadingUpdate || isLoadingAddToFav || isLoadingUpdateFav;

  const isTimeInputShown = intake.recordedAt && intake.isRecorded;

  function handleIntakeNameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value: name } = e.target;
    setIntake(prev => ({ ...prev, name }));
  }

  function handleToggleIntakeType() {
    const newType = intake.type === "food" ? "drink" : "food";
    setIntake(prev => ({ ...prev, type: newType }));
  }

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
    if (!iValidIntake) return toast.error("Please fill all intake items");
    intake.recordedAt = new Date();
    if ("userId" in intake) updateFavoriteIntake(intake as FavoriteIntake);
    else addFavoriteIntake(intake);
    setIntake(intakeUtilService.getDefaultIntake());
  }

  function handleSaveLaterButtonClick() {
    setIntake(prev => ({
      ...prev,
      recordedAt: null,
      isRecorded: !prev.isRecorded,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dailyData) return;
    const iValidIntake = intake.items.every(item => item.name.length && item.quantity > 0);
    if (!iValidIntake) return toast.error("Please fill all intake items");
    intake.recordedAt = new Date();
    const isNewIntake = !dailyData.intakes.some(i => i.id === intake.id);
    const updatedIntakes = isNewIntake
      ? [...dailyData.intakes, intake]
      : dailyData.intakes.map(i => (i.id === intake.id ? intake : i));
    updateDailyData({ ...dailyData, intakes: updatedIntakes });
    setIntake(intakeUtilService.getDefaultIntake());
  }

  return (
    <form className="intake-edit" onSubmit={handleSubmit} data-testid="intake-edit">
      {isLoading && (
        <SpinnerLoader withContainer={true} containerSize={{ height: "75px", width: "100%" }} />
      )}

      {!isLoading && (
        <>
          <header className="intake-edit__header">
            <input
              type="text"
              placeholder="Name your intake"
              autoComplete="off"
              value={intake.name || ""}
              onChange={handleIntakeNameInputChange}
              className="intake-edit__header__name-input"
            />
            <Button onClickFn={handleToggleIntakeType} className="intake-edit-btn">
              <span>{intake.type}</span>
            </Button>

            {isTimeInputShown && (
              <input
                className="intake-edit__header__time-input"
                type="time"
                value={new Date(intake.recordedAt as string).toISOString().slice(11, 16)}
                onChange={handleTimeInputChange}
              />
            )}
          </header>
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

      <div className="intake-edit__info-container">
        <LastTimeYouAteTitle />
        <PreSaveCalorieCount />
      </div>

      <div className="intake-edit-btns-container" style={{ backgroundColor }}>
        <Button onClickFn={handleClearButtonClick} className="intake-edit-btn">
          clear
        </Button>
        <Button
          onClickFn={handleSaveToFavoriteButtonClick}
          className="intake-edit-btn"
          type="submit"
        >
          Save To Fav
        </Button>
        <Button
          onClickFn={handleSaveLaterButtonClick}
          className={
            "intake-edit-btn btn-toggle-save-later " + classnames({ clicked: !intake.isRecorded })
          }
        >
          Save Later
        </Button>

        <Button onClickFn={e => handleSubmit(e)} className="intake-edit-btn" type="submit">
          Save Intake
        </Button>
      </div>
    </form>
  );
};
