import { UserCaloricData } from "../../../../shared/types/system";
declare function calcTargetCaloricIntakePerDay({ TDEE }: {
    TDEE: number;
}): number;
declare function calcTotalDailyEnergyExpenditure({ weight, height, age, gender, }: UserCaloricData): number;
declare const _default: {
    calcTargetCaloricIntakePerDay: typeof calcTargetCaloricIntakePerDay;
    calcTotalDailyEnergyExpenditure: typeof calcTotalDailyEnergyExpenditure;
};
export default _default;
