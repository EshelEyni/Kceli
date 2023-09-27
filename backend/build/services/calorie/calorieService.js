"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateTargetCaloricIntakePerDay({ TDEE }) {
    const targetCaloricIntake = TDEE - 550;
    return Math.round(targetCaloricIntake);
}
function calculateTotalDailyEnergyExpenditure({ weight, height, age, gender, }) {
    // BMR (Basal Metabolic Rate) is the number of calories your body needs to function at rest.
    // This includes basic functions like breathing, circulating blood, and regulating body temperature.
    let BMR;
    // Calculate BMR using the Mifflin-St Jeor Equation
    if (gender === "male")
        BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    else
        BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    // TDEE (Total Daily Energy Expenditure) is the total number of calories you burn in a day.
    // It's calculated by multiplying your BMR by an activity factor. Here, we use 1.2 for a sedentary lifestyle.
    const TDEE = BMR * 1.2;
    return Math.round(TDEE);
}
exports.default = { calculateTargetCaloricIntakePerDay, calculateTotalDailyEnergyExpenditure };
//# sourceMappingURL=calorieService.js.map