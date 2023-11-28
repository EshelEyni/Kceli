import { Goal, TimeGoal, UserGoal } from "../../types/app";
import { createId } from "../util/utilService";

function getDefaultGoal(type: Goal["type"]): Goal {
  const basicGoal = {
    id: createId(),
    userId: "",
    description: "",
    type,
    isCompleted: false,
    date: new Date(),
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
