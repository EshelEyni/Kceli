import { Goal, TimeGoal, UserGoal } from "../../types/app";
import { createId } from "../util/utilService";

type GetDefaultGoal = {
  type: Goal["type"];
  date?: Date;
};

function getDefaultGoal({ type, date = new Date() }: GetDefaultGoal): Goal {
  const basicGoal = {
    id: createId(),
    userId: "",
    description: "",
    type,
    isCompleted: false,
    date,
  };

  if (type !== "user") return { ...basicGoal, type } as TimeGoal;
  return {
    ...basicGoal,
    userWeightLossGoal: {
      startingWeight: 0,
      weightGoal: 0,
    },
  } as UserGoal;
}

export default { getDefaultGoal };
