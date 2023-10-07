"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateBasicWorkoutItem(item) {
    if (typeof item !== "object" || item === null)
        return false;
    return ("name" in item &&
        typeof item.name === "string" &&
        "isStarted" in item &&
        typeof item.isStarted === "boolean" &&
        "isCompleted" in item &&
        typeof item.isCompleted === "boolean");
}
function validateWorkoutItemAerobic(item) {
    return (validateBasicWorkoutItem(item) &&
        "type" in item &&
        item.type === "aerobic" &&
        "durationInMin" in item &&
        typeof item.durationInMin === "number");
}
function validateWorkoutItemAnaerobic(item) {
    if (typeof item !== "object" || item === null)
        return false;
    return (validateBasicWorkoutItem(item) &&
        "type" in item &&
        item.type === "anaerobic" &&
        "sets" in item &&
        Array.isArray(item.sets) &&
        item.sets.every(set => typeof set.isCompleted === "boolean") &&
        "reps" in item &&
        typeof item.reps === "number" &&
        "weight" in item &&
        typeof item.weight === "number" &&
        "weightUnit" in item &&
        (item.weightUnit === "kg" ||
            item.weightUnit === "lbs") &&
        "restInSec" in item &&
        typeof item.restInSec === "number");
}
function validateWorkoutItemSuperset(item) {
    if (typeof item !== "object" || item === null)
        return false;
    return (validateBasicWorkoutItem(item) &&
        "type" in item &&
        item.type === "superset" &&
        "items" in item &&
        Array.isArray(item.items) &&
        item.items.every(subItem => typeof subItem.id === "string" &&
            typeof subItem.name === "string" &&
            typeof subItem.reps === "number" &&
            typeof subItem.weight === "number" &&
            (subItem.weightUnit === "kg" || subItem.weightUnit === "lbs")) &&
        "sets" in item &&
        Array.isArray(item.sets) &&
        item.sets.every(set => typeof set.isCompleted === "boolean") &&
        "restInSec" in item &&
        typeof item.restInSec === "number");
}
exports.default = {
    validateBasicWorkoutItem,
    validateWorkoutItemAerobic,
    validateWorkoutItemAnaerobic,
    validateWorkoutItemSuperset,
};
//# sourceMappingURL=workout.js.map