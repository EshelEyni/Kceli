import { IIntakeItem } from "../../types/iTypes";
import { IntakeItem } from "../../../../shared/types/intake";
import { User } from "../../../../shared/types/user";
import { CombinedWorkoutItem } from "../../../../shared/types/workout";
declare function getText(prompt: string): Promise<string>;
declare function getCaloriesForIntakeItem(intakeItem: IIntakeItem | IntakeItem): Promise<number>;
type getCalBurnParams = {
    user: User;
    workoutItem: CombinedWorkoutItem;
    weight?: number;
};
declare function getCalorieBurnForWorkoutItem({ user, workoutItem, weight }: getCalBurnParams): Promise<number>;
declare const _default: {
    getText: typeof getText;
    getCaloriesForIntakeItem: typeof getCaloriesForIntakeItem;
    getCalorieBurnForWorkoutItem: typeof getCalorieBurnForWorkoutItem;
};
export default _default;
