import { User } from "../../../../shared/types/user";
import { DayData } from "../../../../shared/types/dayData";
import {
  FavoriteIntake,
  Intake,
  IntakeItem,
  NewIntake,
  NewIntakeItem,
} from "../../../../shared/types/intake";
import { BasicWorkoutItem, Workout } from "../../../../shared/types/workout";

function assertUser(user: User) {
  expect(user).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      username: expect.any(String),
      fullname: expect.any(String),
      email: expect.any(String),
      imgUrl: expect.any(String),
      isAdmin: expect.any(Boolean),
    })
  );

  expect(typeof user.createdAt === "string" || typeof user.createdAt === "object").toBeTruthy();
}

function assertDailyData(dailyData: DayData) {
  expect(dailyData).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      // date: expect.any(Date),
      userId: expect.any(String),
      intakes: expect.any(Array),
    })
  );

  dailyData.intakes.forEach(assertIntake);
}

function assertIntake(intake: NewIntake | Intake) {
  expect(intake).toEqual(
    expect.objectContaining({
      items: expect.any(Array),
      isRecorded: expect.any(Boolean),
    })
  );

  intake.items.forEach(assertIntakeItem);
}

function assertFavoriteIntake(intake: FavoriteIntake) {
  assertIntake(intake);
  expect(intake.userId).toEqual(expect.any(Object));
  expect(intake.sortOrder).toEqual(expect.any(Number));
}

function assertIntakeItem(item: NewIntakeItem | IntakeItem) {
  expect(item).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      quantity: expect.any(Number),
      unit: expect.any(String),
      calories: expect.any(Number),
    })
  );
}

function assertWorkout(workout: Workout) {
  expect(workout).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      userId: expect.any(String),
      description: expect.any(String),
      items: expect.any(Array),
    })
  );

  for (const item of workout.items) {
    assertWorkoutItem(item);
  }
}

function assertWorkoutItem(item: BasicWorkoutItem) {
  expect(item).toEqual(
    expect.objectContaining({
      name: expect.any(String),
      isStarted: expect.any(Boolean),
      isCompleted: expect.any(Boolean),
    })
  );
}

export {
  assertUser,
  assertDailyData,
  assertIntake,
  assertIntakeItem,
  assertFavoriteIntake,
  assertWorkout,
  assertWorkoutItem,
};
