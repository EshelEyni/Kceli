import { User, UserWorkoutSchedule, WorkoutDay } from "../../../shared/types/user";
import { DayData } from "../../../shared/types/dayData";
import { act } from "@testing-library/react";
import { CombinedIntake, IntakeItem, MeasurementUnit } from "../../../shared/types/intake";
import {
  CombinedWorkoutItem,
  Split,
  SupersetItem,
  WeightUnit,
  Workout,
  WorkoutAnaerobic,
  WorkoutItemAerobic,
  WorkoutItemAnaerobic,
  WorkoutItemSuperset,
} from "../../../shared/types/workout";
import { NutritionQueryState, SpellingSuggestion } from "../../src/types/app";
import { createId } from "../../src/services/util/utilService";
import {
  FormattedNinjaAPIResData,
  FormattedUSDAFoodObject,
  Gender,
} from "../../../shared/types/system";

type CreateTestNutritionQueryParams = {
  type: NutritionQueryState["type"];
  response?: string | FormattedNinjaAPIResData | FormattedUSDAFoodObject[] | null;
  status?: NutritionQueryState["status"];
  error?: NutritionQueryState["error"];
};

type MockDayData = {
  id?: string;
  userId?: string;
  date?: Date;
  intakes?: CombinedIntake[];
  workouts?: Workout[];
  weight?: number;
  waist?: number;
  isWeightWaistIgnored?: boolean;
  totalDailyEnergyExpenditure?: number;
  targetCaloricIntake?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

type MockIntakeItem = {
  id?: string;
  name?: string;
  unit?: MeasurementUnit;
  quantity?: number;
  calories?: number;
};

type MockUser = {
  id?: string;
  username?: string;
  fullname?: string;
  email?: string;
  imgUrl?: string;
  isAdmin?: boolean;
  weight?: number;
  height?: number;
  birthdate?: Date;
  totalDailyEnergyExpenditure?: number;
  targetCaloricIntakePerDay?: number;
  weightLossGoal?: {
    startingWeight: number;
    weightGoal: number;
  };
  workoutSchedule?: UserWorkoutSchedule;
  gender?: Gender;
  createdAt?: string;
};

function createUser({
  id = "test",
  username = "test",
  fullname = "test",
  email = "test@email.com",
  imgUrl = "test",
  isAdmin = false,
  weight = 100,
  height = 100,
  birthdate = new Date(),
  totalDailyEnergyExpenditure = 100,
  targetCaloricIntakePerDay = 100,
  workoutSchedule = createWorkSchedule(),
  gender = "female",
  createdAt = "test",
}: MockUser): User {
  return {
    id,
    username,
    fullname,
    email,
    imgUrl,
    isAdmin,
    weight,
    height,
    birthdate,
    totalDailyEnergyExpenditure,
    targetCaloricIntakePerDay,
    workoutSchedule,
    gender,
    createdAt,
  };
}

function createWorkSchedule() {
  const defaultWorkoutSchedule: WorkoutDay[] = [
    {
      name: "sun",
      value: 0,
      workouts: [],
    },
    {
      name: "mon",
      value: 1,
      workouts: [],
    },
    {
      name: "tue",
      value: 2,
      workouts: [],
    },
    {
      name: "wed",
      value: 3,
      workouts: [],
    },
    {
      name: "thu",
      value: 4,
      workouts: [],
    },
    {
      name: "fri",
      value: 5,
      workouts: [],
    },
    {
      name: "sat",
      value: 6,
      workouts: [],
    },
  ];

  return defaultWorkoutSchedule;
}

function createDailyData({
  id = createId(),
  userId = "test",
  date = new Date(),
  intakes = [createIntake({})],
  workouts = [createWorkout({})],
  weight = 100,
  waist = 100,
  isWeightWaistIgnored = false,
  totalDailyEnergyExpenditure = 100,
  targetCaloricIntake = 100,
  createdAt = new Date(),
  updatedAt = new Date(),
}: MockDayData): DayData {
  return {
    id,
    userId,
    date,
    intakes,
    workouts,
    weight,
    waist,
    isWeightWaistIgnored,
    totalDailyEnergyExpenditure,
    targetCaloricIntake,
    createdAt,
    updatedAt,
  };
}

function createIntake({
  id = createId(),
  name = "test",
  sortOrder = 0,
  isRecorded = true,
  recordedAt = new Date(),
  items = [createIntakeItem({})],
  userId = "testUserId",
  type = "food",
}: {
  id?: string;
  name?: string;
  sortOrder?: number;
  isRecorded?: boolean;
  recordedAt?: Date | string | null;
  items?: IntakeItem[];
  userId?: string;
  type?: "food" | "drink";
}): CombinedIntake {
  return {
    id,
    name,
    sortOrder,
    isRecorded,
    recordedAt,
    items,
    userId,
    type,
  };
}

function createIntakeItem({
  id = "test",
  name = "test",
  unit = MeasurementUnit.GRAM,
  quantity = 100,
  calories = 100,
}: MockIntakeItem): IntakeItem {
  return { id, name, unit, quantity, calories };
}

function createWorkout({
  id = "test",
  userId = "test",
  description = "test",
  type = "aerobic",
  items = [createAerobicWorkoutItem({})],
  split,
}: {
  id?: string;
  userId?: string;
  description?: string;
  type?: "aerobic" | "anaerobic";
  items?: CombinedWorkoutItem[];
  split?: Split;
}): Workout {
  const workout = { id, userId, description, type, items } as Workout;
  if (split) (workout as WorkoutAnaerobic).split = split;
  return workout;
}

function createAerobicWorkoutItem({
  id = "test",
  name = "test",
  isStarted = false,
  isCompleted = false,
  durationInMin = 100,
}: {
  id?: string;
  name?: string;
  isStarted?: boolean;
  isCompleted?: boolean;
  durationInMin?: number;
}): WorkoutItemAerobic {
  return { id, name, isStarted, type: "aerobic", isCompleted, durationInMin } as WorkoutItemAerobic;
}

function createAnaerobicWorkoutItem({
  id = "test",
  name = "test",
  isStarted = false,
  isCompleted = false,
  sets = 100,
  reps = 100,
  weight = 100,
  weightUnit = WeightUnit.KG,
  restInSec = 100,
}: {
  id?: string;
  name?: string;
  isStarted?: boolean;
  isCompleted?: boolean;
  sets?: number;
  reps?: number;
  weight?: number;
  weightUnit?: WeightUnit;
  restInSec?: number;
}): WorkoutItemAnaerobic {
  return {
    id,
    name,
    isStarted,
    type: "anaerobic",
    isCompleted,
    sets,
    reps,
    weight,
    weightUnit,
    restInSec,
  } as WorkoutItemAnaerobic;
}

function createSupersetWorkoutItem({
  id = "test",
  name = "test",
  isStarted = false,
  isCompleted = false,
  sets = 3,
  restInSec = 100,
  items = [createSupersetItem({}), createSupersetItem({})],
}: {
  id?: string;
  name?: string;
  isStarted?: boolean;
  isCompleted?: boolean;
  sets?: number;
  restInSec?: number;
  items?: SupersetItem[];
}): WorkoutItemSuperset {
  return {
    id,
    name,
    isStarted,
    type: "superset",
    isCompleted,
    sets,
    restInSec,
    items,
  } as WorkoutItemSuperset;
}

function createSupersetItem({
  id = "test",
  name = "test",
  reps = 3,
  weight = 25,
  weightUnit = WeightUnit.KG,
}: {
  id?: string;
  name?: string;
  reps?: number;
  weight?: number;
  weightUnit?: WeightUnit;
}): SupersetItem {
  return {
    id,
    name,
    reps,
    weight,
    weightUnit,
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
  createAnaerobicWorkoutItem,
  createSupersetWorkoutItem,
  createSupersetItem,
  createSpellingSuggestion,
  createNutritionQuery,
  createNutritionQueryResponse,
  createWorkSchedule,
  waitForTick,
};
