import { User } from "../../../shared/types/user";
import { DayData } from "../../../shared/types/dayData";
import { act } from "@testing-library/react";
import { CombinedIntake, IntakeItem, MeasurementUnit } from "../../../shared/types/intake";
import { Workout, WorkoutItemAerobic } from "../../../shared/types/workout";
import { SpellingSuggestion } from "../../src/types/app";

function createTestUser(): User {
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

function createTestDailyData(): DayData {
  return {
    id: "test",
    userId: "test",
    date: new Date(),
    intakes: [createTestIntake({})],
    workouts: [createTestWorkout()],
    weight: 100,
    waist: 100,
    totalDailyEnergyExpenditure: 100,
    targetCaloricIntake: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createTestIntake({
  id = "test",
  isRecorded = false,
  recordedAt = new Date(),
  items = [createTestIntakeItem()],
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

function createTestIntakeItem(): IntakeItem {
  return {
    id: "test",
    name: "test",
    unit: MeasurementUnit.GRAM,
    quantity: 100,
    calories: 100,
  };
}

function createTestWorkout(): Workout {
  return {
    id: "test",
    userId: "test",
    description: "test",
    type: "aerobic",
    items: [createTestAerobicWorkoutItem()],
  };
}

function createTestAerobicWorkoutItem(): WorkoutItemAerobic {
  return {
    id: "test",
    name: "test",
    isStarted: false,
    isCompleted: false,
    type: "aerobic",
    durationInMin: 100,
  };
}

function createTestSpellingSuggestion(): SpellingSuggestion {
  return {
    original: "test",
    suggestions: ["suggestion1", "suggestion2"],
  };
}

async function waitForTick() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

export default {
  createTestUser,
  createTestDailyData,
  createTestIntake,
  createTestIntakeItem,
  createTestWorkout,
  createTestAerobicWorkoutItem,
  createTestSpellingSuggestion,
  waitForTick,
};
