import { RecommendedWeight } from "../../types/app";

function getDefaultUserImgUrl(): string {
  return "https://res.cloudinary.com/dng9sfzqt/image/upload/v1681677382/user-chirper_ozii7u.png";
}

function calcRecommendedWeight(heightInCM: number): RecommendedWeight {
  /**
   * Calculate the recommended body weight based on BMI.
   * The formula to calculate recommended weight is:
   * Recommended Weight = BMI * (Height in meters)^2
   * We use a "normal" BMI range of 18.5 to 24.9 to calculate the recommended weight.
   */

  const minNormalBMI = 18.5;
  const maxNormalBMI = 24.9;
  const heightInMeters = heightInCM / 100;

  const min = +(minNormalBMI * Math.pow(heightInMeters, 2)).toFixed(2);
  const max = +(maxNormalBMI * Math.pow(heightInMeters, 2)).toFixed(2);
  const avg = +((Number(min) + Number(max)) / 2).toFixed(2);

  return { min, avg, max };
}

function getUtilWeightLossGoal() {
  return {
    currentWeight: 0,
    weightGoal: 0,
  };
}

export default { getDefaultUserImgUrl, calcRecommendedWeight, getUtilWeightLossGoal };
