import { FC } from "react";
import { useProfile } from "./ProfileContext";
import { Controller, useForm } from "react-hook-form";
import { WeightLossGoal } from "../../../../shared/types/user";
import { Button } from "../../components/App/Button/Button";

type FormData = {
  username: string;
  fullname: string;
  birthdate: Date;
  height: number;
  weight: number;
  weightLossGoal: WeightLossGoal;
  targetCaloricDeficitPerDay: number;
};

export const UserEdit: FC = () => {
  const { user, updateUser, setIsEditing } = useProfile();

  const defaultValues = {
    username: user?.username || "",
    fullname: user?.fullname || "",
    birthdate: user?.birthdate || new Date(),
    height: user?.height || 0,
    weight: user?.weight || 0,
    totalDailyEnergyExpenditure: user?.totalDailyEnergyExpenditure || 0,
    targetCaloricIntakePerDay: user?.targetCaloricIntakePerDay || 0,
    targetCaloricDeficitPerDay: user?.targetCaloricDeficitPerDay || 0,
  };

  const { control, handleSubmit } = useForm<FormData>({ defaultValues });

  if (!user) return null;

  function handleBtnCancelClick() {
    setIsEditing(false);
  }

  function onSubmit(data: FormData) {
    if (!user) return;
    const userToUpdate = { ...user, ...data };
    updateUser(userToUpdate);
    setIsEditing(false);
  }

  return (
    <form className="user-edit-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="user-edit__item-container">
        <label htmlFor="username">user name:</label>
        <Controller
          name="username"
          control={control}
          render={({ field }) => <input id="username" {...field} />}
        />
      </div>

      <div className="user-edit__item-container">
        <label htmlFor="fullname">full name:</label>
        <Controller
          name="fullname"
          control={control}
          render={({ field }) => <input id="fullname" {...field} />}
        />
      </div>

      <div className="user-edit__item-container">
        <label htmlFor="birthdate">birthdate:</label>
        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => (
            <input
              id="birthdate"
              type="date"
              value={new Date(field.value).toISOString().split("T")[0]}
              onChange={e => field.onChange(new Date(e.target.value))}
            />
          )}
        />
      </div>

      <div className="user-edit__item-container">
        <label htmlFor="height">height:</label>
        <Controller
          name="height"
          control={control}
          render={({ field }) => <input id="height" type="number" {...field} />}
        />
      </div>

      <div className="user-edit__item-container">
        <label htmlFor="weight">weight:</label>
        <Controller
          name="weight"
          control={control}
          render={({ field }) => <input id="weight" type="number" {...field} />}
        />
      </div>

      <div className="user-edit__item-container">
        <label htmlFor="targetCaloricDeficitPerDay">Target Caloric Deficit Per Day:</label>
        <Controller
          name="targetCaloricDeficitPerDay"
          control={control}
          render={({ field }) => <input id="targetCaloricDeficitPerDay" type="number" {...field} />}
        />
      </div>

      <div className="user-edit__btns-container">
        <Button onClickFn={handleBtnCancelClick}>cancel</Button>
        <Button type="submit">update</Button>
      </div>
    </form>
  );
};
