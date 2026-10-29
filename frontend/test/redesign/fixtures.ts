import { User } from "../../../shared/types/user";
import { Workout, WeightUnit } from "../../../shared/types/workout";
import { DayData } from "../../../shared/types/dayData";
import { MeasurementUnit } from "../../../shared/types/intake";

// Fictional data shared by integration tests and the isolated local UI review.
export function createFixtures() {
  const now = new Date();
  const workouts: Workout[] = [
    {
      id: "strength-a",
      userId: "review-user",
      description: "Full body strength",
      type: "anaerobic",
      split: "A",
      items: ["Goblet squat", "Dumbbell bench press", "Bent-over row", "Reverse lunge"].map(
        (name, i) => ({
          id: `exercise-${i}`,
          name,
          type: "anaerobic",
          sets: 3,
          reps: 12,
          weight: 16,
          weightUnit: WeightUnit.KG,
          restInSec: 60,
          isStarted: false,
          isCompleted: false,
        })
      ),
    },
    {
      id: "cardio-a",
      userId: "review-user",
      description: "Easy outdoor run",
      type: "aerobic",
      durationInMin: 30,
      items: [
        {
          id: "run",
          name: "Easy run",
          type: "aerobic",
          durationInMin: 30,
          isStarted: false,
          isCompleted: false,
        },
      ],
    },
  ];
  const user: User = {
    id: "review-user",
    username: "alex",
    fullname: "Alex Morgan",
    email: "alex@example.com",
    imgUrl: "",
    isAdmin: false,
    weight: 84,
    height: 178,
    gender: "male",
    birthdate: new Date(1994, 5, 12),
    totalDailyEnergyExpenditure: 2600,
    targetCaloricIntakePerDay: 2100,
    targetCaloricDeficitPerDay: 500,
    createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 3).toISOString(),
    workoutSchedule: (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const).map(
      (name, value) => ({
        name,
        value: value as 0 | 1 | 2 | 3 | 4 | 5 | 6,
        workouts: value === now.getDay() ? [workouts[0]] : [],
      })
    ),
  };
  const today: DayData = {
    id: "today",
    userId: user.id,
    date: now,
    createdAt: now,
    updatedAt: now,
    weight: 78.4,
    waist: 88,
    isWeightWaistIgnored: false,
    totalDailyEnergyExpenditure: 2600,
    targetCaloricIntake: 2100,
    hungerEvents: [],
    workouts: [],
    intakes: [
      ...[
        { name: "Greek yogurt & berry bowl", calories: 420 },
        { name: "Chicken & quinoa salad", calories: 680 },
        { name: "Apple & almond butter", calories: 380 },
      ].map((entry, i) => ({
        id: `meal-${i}`,
        name: entry.name,
        type: "food" as const,
        isRecorded: true,
        recordedAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8 + i * 3),
        items: [
          {
            id: `food-${i}`,
            name: entry.name,
            quantity: 1,
            unit: MeasurementUnit.UNIT,
            calories: entry.calories,
          },
        ],
      })),
      {
        id: "water",
        name: "Water",
        type: "drink",
        isRecorded: true,
        recordedAt: now,
        items: [
          {
            id: "water-item",
            name: "water",
            quantity: 1500,
            unit: MeasurementUnit.MILLILITER,
            calories: 0,
          },
        ],
      },
    ],
  };
  const history = Array.from({ length: 8 }, (_, i) => ({
    ...today,
    id: `history-${i}`,
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - (7 - i) * 3),
    weight: Number((84 - i * 0.8).toFixed(1)),
    waist: 95 - i,
  }));
  history[history.length - 1] = today;
  return { user: JSON.parse(JSON.stringify(user)) as User, today, workouts, history };
}
