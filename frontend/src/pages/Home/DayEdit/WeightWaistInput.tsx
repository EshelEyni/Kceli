import { FC, useState, useEffect } from "react";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import { Button } from "../../../components/App/Button/Button";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { Controller, useForm } from "react-hook-form";
import "./WeightWaistInput.scss";
import { useAuth } from "../../../hooks/useAuth";
import { useGetUserDailyStats } from "../../../hooks/useGetUserDailyStats";
import userUtilService from "../../../services/user/userUtilService";
import { GoalIndicator } from "../../../components/GoalIndicator/GoalIndicator";

interface WeightWaistIFormInput {
  weight: number | string;
  waist: number | string;
}

export const WeightWaistInput: FC = () => {
  const { dailyData, isLoading, updateDailyData, isLoadingUpdate, setOpenedTab } = useDayEdit();
  const { loggedInUser } = useAuth();
  const { userDailyStats } = useGetUserDailyStats();

  const { control, handleSubmit } = useForm<WeightWaistIFormInput>({
    defaultValues: { weight: dailyData?.weight || "", waist: dailyData?.waist || "" },
  });

  const [isReachedGoalWeight, setIsReachedGoalWeight] = useState(false);
  const [isFormShown, setIsFormShown] = useState(
    !dailyData?.weight && !dailyData?.waist && !isLoading
  );

  function handleDismissBtnClick() {
    if (!dailyData) return;
    setIsFormShown(false);
    if (dailyData.isWeightWaistIgnored) return;
    updateDailyData({ id: dailyData.id, data: { isWeightWaistIgnored: true } });
    setOpenedTab(DayEditTab.IntakeEdit);
  }

  function onSubmit(data: WeightWaistIFormInput) {
    if (!dailyData) return;

    updateDailyData({
      id: dailyData.id,
      data: { weight: Number(data.weight), waist: Number(data.waist) },
    });

    setIsFormShown(false);
  }

  function handleToggleFormBtnClick() {
    setIsFormShown(true);
  }

  useEffect(() => {
    if (!loggedInUser || !userDailyStats) return;
    setIsReachedGoalWeight(userUtilService.isReachedGoalWeight({ loggedInUser, userDailyStats }));
  }, [loggedInUser, userDailyStats]);

  if (isLoading || isLoadingUpdate) return <SpinnerLoader containerSize={{ height: "75px" }} />;

  if (!dailyData) return null;
  if (isFormShown)
    return (
      <form
        className="weight-waist-form"
        data-testid="weight-waist-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="weight"
          render={({ field }) => (
            <label className="weight-waist-form__label">
              <h3>Weight</h3>
              <input
                {...field}
                type="number"
                className="weight-waist-form__input"
                placeholder="Enter your weight"
                required
              />
            </label>
          )}
        />
        <Controller
          control={control}
          name="waist"
          render={({ field }) => (
            <label className="weight-waist-form__label">
              <h3>Waist</h3>
              <input
                {...field}
                type="number"
                className="weight-waist-form__input"
                placeholder="Enter your waist size"
                required
              />
            </label>
          )}
        />

        <div className="weight-waist-form__btns-container">
          <Button className="btn" type="submit">
            update
          </Button>

          <Button className="btn" onClickFn={handleDismissBtnClick}>
            dissmis
          </Button>
        </div>
      </form>
    );

  return (
    <>
      <div className="weight-waist-details" data-testid="weight-waist-details">
        <p className="weight-waist-details__title">weight:</p>
        <p className="weight-waist-details__text">{dailyData.weight} kg</p>
        <p className="weight-waist-details__title">waist:</p>
        <p className="weight-waist-details__text">{dailyData.waist} cm</p>
      </div>
      <Button className="btn" onClickFn={handleToggleFormBtnClick}>
        update
      </Button>

      {isReachedGoalWeight && <GoalIndicator />}
    </>
  );
};
