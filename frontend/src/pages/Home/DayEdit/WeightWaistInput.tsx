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
  const { dailyData, isLoading, updateDailyData, setOpenedTab } = useDayEdit();
  const { loggedInUser } = useAuth();
  const { userDailyStats } = useGetUserDailyStats();

  const { control, handleSubmit } = useForm<WeightWaistIFormInput>({
    defaultValues: { weight: "", waist: "" },
  });

  const [isReachedGoalWeight, setIsReachedGoalWeight] = useState(false);

  function handleDismissBtnClick() {
    if (!dailyData) return;
    updateDailyData({ ...dailyData, isWeightWaistIgnored: true });
    setOpenedTab(DayEditTab.IntakeEdit);
  }

  function onSubmit(data: WeightWaistIFormInput) {
    if (!dailyData || !loggedInUser) return;
    const { weightGoal } = loggedInUser.weightLossGoal;
    if (Number(data.weight) <= weightGoal) {
      return alert("Weight can't be greater than your goal");
    }
    updateDailyData({ ...dailyData, weight: Number(data.weight), waist: Number(data.waist) });
  }

  useEffect(() => {
    if (!loggedInUser || !userDailyStats) return;
    setIsReachedGoalWeight(userUtilService.isReachedGoalWeight({ loggedInUser, userDailyStats }));
  }, [loggedInUser, userDailyStats]);

  if (!dailyData) return null;
  const isFormShown = !dailyData.weight && !dailyData.waist && !isLoading;

  if (isLoading) return <SpinnerLoader withContainer={true} containerSize={{ height: "75px" }} />;

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
            <input
              {...field}
              type="number"
              className="weight-waist-form__input"
              placeholder="Enter your weight"
              required
            />
          )}
        />
        <Controller
          control={control}
          name="waist"
          render={({ field }) => (
            <input
              {...field}
              type="number"
              className="weight-waist-form__input"
              placeholder="Enter your waist size"
              required
            />
          )}
        />

        <div className="weight-waist-form__btns-container">
          <Button className="btn" type="submit">
            update
          </Button>

          {!dailyData.isWeightWaistIgnored && (
            <Button className="btn" onClickFn={handleDismissBtnClick}>
              dissmis
            </Button>
          )}
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
      {isReachedGoalWeight && <GoalIndicator />}
    </>
  );
};
