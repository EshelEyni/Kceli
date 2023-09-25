import { IIntakeItem } from "../../types/iTypes";
declare function getText(prompt: string, model?: string): Promise<string>;
declare function getCaloriesForIntakeItem(intakeItem: IIntakeItem): Promise<number>;
declare const _default: {
    getText: typeof getText;
    getCaloriesForIntakeItem: typeof getCaloriesForIntakeItem;
};
export default _default;
