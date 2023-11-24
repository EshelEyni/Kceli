import { Goal } from "../../types/app";
import { createId } from "../util/utilService";

function getDefaultGoal(): Goal {
  return {
    id: createId(),
    userId: "",
    description: "",
    type: "user",
    isCompleted: false,
    date: new Date(),
  };
}

export default { getDefaultGoal };
