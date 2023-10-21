import { expect } from "vitest";
import { NewIntake, NewIntakeItem } from "../../../shared/types/intake";

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

export { assertNewIntake, assertNewIntakeItem };
