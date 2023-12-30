import { ExistingIntakeItemData, NewIntakeItem } from "../../../../shared/types/intake";
import { UserCaloricData } from "../../../../shared/types/system";
import { IIntakeItem } from "../../types/iTypes";
declare function calcTargetCaloricIntakePerDay({ TDEE }: {
    TDEE: number;
}): number;
declare function calcTotalDailyEnergyExpenditure({ weight, height, age, gender }: UserCaloricData): number;
declare function calcCaloriesFromExistingItem({ existingItemData, intakeItem, }: {
    existingItemData: ExistingIntakeItemData;
    intakeItem: IIntakeItem | NewIntakeItem;
}): number;
declare const _default: {
    calcTargetCaloricIntakePerDay: typeof calcTargetCaloricIntakePerDay;
    calcTotalDailyEnergyExpenditure: typeof calcTotalDailyEnergyExpenditure;
    calcCaloriesFromExistingItem: typeof calcCaloriesFromExistingItem;
};
export default _default;
