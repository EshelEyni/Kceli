import { UserCaloricData } from "../../../../shared/types/system";
declare function calculateTargetCaloricIntakePerDay({ TDEE }: {
    TDEE: number;
}): number;
declare function calculateTotalDailyEnergyExpenditure({ weight, height, age, gender, }: UserCaloricData): number;
declare const _default: {
    calculateTargetCaloricIntakePerDay: typeof calculateTargetCaloricIntakePerDay;
    calculateTotalDailyEnergyExpenditure: typeof calculateTotalDailyEnergyExpenditure;
};
export default _default;
