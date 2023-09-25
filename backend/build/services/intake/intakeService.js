"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dailyDataModel_1 = require("../../models/day/dailyDataModel");
function getAllIntakeItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const intakeItems = yield dailyDataModel_1.DailyDataModel.aggregate([
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
    });
}
function getExistingIntakeItem(newIntakeItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const intakeItems = yield dailyDataModel_1.DailyDataModel.aggregate([
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
    });
}
exports.default = { getAllIntakeItems, getExistingIntakeItem };
// Path: src/services/intake/intakeService.ts
//# sourceMappingURL=intakeService.js.map