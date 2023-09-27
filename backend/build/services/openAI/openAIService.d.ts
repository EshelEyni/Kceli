import { IIntakeItem } from "../../types/iTypes";
import { IntakeItem } from "../../../../shared/types/intake";
declare function getText(prompt: string, model?: string): Promise<string>;
declare function getCaloriesForIntakeItem(intakeItem: IIntakeItem | IntakeItem): Promise<number>;
declare const _default: {
    getText: typeof getText;
    getCaloriesForIntakeItem: typeof getCaloriesForIntakeItem;
};
export default _default;
