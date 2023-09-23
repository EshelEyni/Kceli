import { NewIntake, NewIntakeItem, MeasurementUnit } from "../../../../shared/types/intake";
import { createId } from "../util/utilService";

const units: MeasurementUnit[] = Object.values(MeasurementUnit);

function getDefaultBasicIntake(): NewIntake {
  return {
    tempId: createId(),
    items: [getDefaultBasicIntakeItem()],
    name: "",
  };
}

function getDefaultBasicIntakeItem(): NewIntakeItem {
  return {
    tempId: createId(),
    unit: MeasurementUnit.UNIT,
    quantity: 1,
    name: "",
  };
}

function getUnitDefaultQuantity(unit: MeasurementUnit): number {
  switch (unit) {
    case "g":
      return 100;
    case "ml":
      return 100;
    case "unit":
      return 1;
    case "cup":
      return 1;
    case "tbsp":
      return 1;
    case "tsp":
      return 1;
    default:
      return 1;
  }
}

function getQuantityStepPerUnit(unit: MeasurementUnit): number {
  switch (unit) {
    case "g":
      return 25;
    case "ml":
      return 25;
    case "unit":
      return 1;
    case "cup":
      return 1;
    case "tbsp":
      return 1;
    case "tsp":
      return 1;
    default:
      return 1;
  }
}

export default {
  getDefaultBasicIntake,
  getDefaultBasicIntakeItem,
  getUnitDefaultQuantity,
  getQuantityStepPerUnit,
  units,
};
