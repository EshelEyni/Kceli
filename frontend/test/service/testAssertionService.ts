import { expect } from "vitest";
import { NewIntake, NewIntakeItem } from "../../../shared/types/intake";
import { CombinedWorkoutItem, SupersetItem } from "../../../shared/types/workout";

function assertNewIntake(intake: NewIntake) {
  expect(intake).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      isRecorded: expect.any(Boolean),
      items: expect.any(Array),
    })
  );

  if (intake.recordedAt) expect(intake.recordedAt).toEqual(expect.any(Date));
  else expect(intake.recordedAt).toEqual(null);

  for (const item of intake.items) {
    assertNewIntakeItem(item);
  }
}

function assertNewIntakeItem(item: NewIntakeItem) {
  expect(item).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      unit: expect.any(String),
      quantity: expect.any(Number),
      name: expect.any(String),
    })
  );

  if (item.calories) expect(item.calories).toEqual(expect.any(Number));
  if (item.caloriesPer100g) expect(item.caloriesPer100g).toEqual(expect.any(Number));
}

function assertWorkoutItem(item: CombinedWorkoutItem) {
  expect(item).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      isStarted: expect.any(Boolean),
      isCompleted: expect.any(Boolean),
    })
  );

  expect(item.type === "aerobic" || item.type === "anaerobic" || item.type === "superset").toBe(
    true
  );
}

function assetSupersetItem(item: SupersetItem) {
  expect(item).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      reps: expect.any(Number),
      weight: expect.any(Number),
      weightUnit: expect.any(String),
    })
  );
}

export { assertNewIntake, assertNewIntakeItem, assertWorkoutItem, assetSupersetItem };
