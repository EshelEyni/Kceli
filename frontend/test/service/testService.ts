import { User } from "../../../shared/types/user";
import { DayData } from "../../../shared/types/dayData";
import { act } from "@testing-library/react";
import { CombinedIntake, IntakeItem, MeasurementUnit } from "../../../shared/types/intake";
import { Workout, WorkoutItemAerobic } from "../../../shared/types/workout";
import { NutritionQueryState, SpellingSuggestion } from "../../src/types/app";
import { createId } from "../../src/services/util/utilService";
import { FormattedNinjaAPIResData, FormattedUSDAFoodObject } from "../../../shared/types/system";

type CreateTestNutritionQueryParams = {
  type: NutritionQueryState["type"];
  response?: string | FormattedNinjaAPIResData | FormattedUSDAFoodObject[] | null;
  status?: NutritionQueryState["status"];
  error?: NutritionQueryState["error"];
};

function createUser(): User {
  return {
    id: "test",
    username: "test",
    fullname: "test",
    email: "test@email.com",
    imgUrl: "test",
    isAdmin: false,
    weight: 100,
    height: 100,
    birthdate: new Date(),
    totalDailyEnergyExpenditure: 100,
    targetCaloricIntakePerDay: 100,
    weightLossGoal: {
      startingWeight: 100,
      weightGoal: 100,
    },
    gender: "female",
    createdAt: "test",
  };
}

function createDailyData(): DayData {
  return {
    id: createId(),
    userId: "test",
    date: new Date(),
    intakes: [createIntake({})],
    workouts: [createWorkout()],
    weight: 100,
    waist: 100,
    totalDailyEnergyExpenditure: 100,
    targetCaloricIntake: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createIntake({
  id = createId(),
  isRecorded = false,
  recordedAt = new Date(),
  items = [createIntakeItem()],
}: {
  id?: string;
  isRecorded?: boolean;
  recordedAt?: Date;
  items?: IntakeItem[];
}): CombinedIntake {
  return {
    id,
    isRecorded,
    recordedAt,
    items,
  };
}

function createIntakeItem(): IntakeItem {
  return {
    id: "test",
    name: "test",
    unit: MeasurementUnit.GRAM,
    quantity: 100,
    calories: 100,
  };
}

function createWorkout(): Workout {
  return {
    id: "test",
    userId: "test",
    description: "test",
    type: "aerobic",
    items: [createAerobicWorkoutItem()],
  };
}

function createAerobicWorkoutItem(): WorkoutItemAerobic {
  return {
    id: "test",
    name: "test",
    isStarted: false,
    isCompleted: false,
    type: "aerobic",
    durationInMin: 100,
  };
}

function createSpellingSuggestion(): SpellingSuggestion {
  return {
    original: "test",
    suggestions: ["suggestion1", "suggestion2"],
  };
}

function createNutritionQuery({
  type,
  response = null,
  status = "idle",
  error = null,
}: CreateTestNutritionQueryParams): NutritionQueryState {
  return {
    type,
    response,
    status,
    error,
  };
}

function createNutritionQueryResponse(
  type: NutritionQueryState["type"]
): string | FormattedNinjaAPIResData | FormattedUSDAFoodObject[] {
  switch (type) {
    case "chatGPT":
      return "test response from chatGPT";
    case "ninjaAPI":
      return [
        {
          name: "banana",
          calories: "89.4",
          "serving size": "100G",
          fat: "0.3 Total Gram",
          "fat saturated": "0.1G",
          protein: "1.1G",
          sodium: "1MG",
          potassium: "22MG",
          carbohydrates: "23.2 Total Gram",
          fiber: "2.6G",
          sugar: "12.3G",
        },
      ];
    case "usdaAPI":
      return [
        {
          description: "Banana, raw",
          Energy: "97 KCAL",
          "Carbohydrate, by difference": "22.7 G",
          Water: "75.6 G",
          "Sugars, total including NLEA": "15.8 G",
          "Fiber, total dietary": "1.7 G",
          "Calcium, Ca": "5 MG",
          "Magnesium, Mg": "28 MG",
          "Folate, DFE": "15 UG",
        },
        {
          description: "Bananas, raw",
          Energy: "371 kJ",
          "Vitamin A, IU": "64 IU",
          "Vitamin A, RAE": "3 UG",
          "Folate, food": "20 UG",
          "Fluoride, F": "2.2 UG",
          "Potassium, K": "358 MG",
          Sucrose: "2.39 G",
          Glucose: "4.98 G",
          Water: "74.9 G",
          "Lutein + zeaxanthin": "22 UG",
          "Selenium, Se": "1 UG",
        },
        {
          description: "Bananas, overripe, raw",
          Energy: "85 KCAL",
          "Carotene, alpha": "8 UG",
          "cis-beta-Carotene": "1 UG",
          "Carotene, beta": "10 UG",
          "trans-beta-Carotene": "9 UG",
          "Folate, total": "25 UG",
          Water: "78.3 G",
        },
      ];
  }
}

async function waitForTick() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

export default {
  createUser,
  createDailyData,
  createIntake,
  createIntakeItem,
  createWorkout,
  createAerobicWorkoutItem,
  createSpellingSuggestion,
  createNutritionQuery,
  createNutritionQueryResponse,
  waitForTick,
};
