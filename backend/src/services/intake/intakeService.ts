import { ExistingIntakeItemData } from "../../../../shared/types/intake";
import { DailyDataModel } from "../../models/day/dailyDataModel";
import { IIntakeItem } from "../../types/iTypes";

async function getAllIntakeItems() {
  const intakeItems = await DailyDataModel.aggregate([
    {
      $unwind: "$intakes",
    },
    {
      $unwind: "$intakes.items",
    },
    {
      $project: {
        _id: 0,
        name: "$intakes.items.name",
        calories: "$intakes.items.calories",
        unit: "$intakes.items.unit",
        quantity: "$intakes.items.quantity",
      },
    },
  ]);

  return intakeItems;
}

async function getExistingIntakeItem(newIntakeItem: IIntakeItem): Promise<ExistingIntakeItemData> {
  const intakeItems = await DailyDataModel.aggregate([
    {
      $unwind: "$intakes",
    },
    {
      $unwind: "$intakes.items",
    },
    {
      $match: {
        "intakes.items.name": newIntakeItem.name,
        "intakes.items.unit": newIntakeItem.unit,
      },
    },
    {
      $project: {
        _id: 0,
        name: "$intakes.items.name",
        calories: "$intakes.items.calories",
        unit: "$intakes.items.unit",
        quantity: "$intakes.items.quantity",
      },
    },
    {
      $limit: 1,
    },
  ]);

  const intakeItem = intakeItems[0] || null;
  return intakeItem;
}

export default { getAllIntakeItems, getExistingIntakeItem };

// Path: src/services/intake/intakeService.ts
