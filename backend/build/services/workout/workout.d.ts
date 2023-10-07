import { BasicWorkoutItem, WorkoutItemAerobic, WorkoutItemAnaerobic, WorkoutItemSuperset } from "../../../../shared/types/workout";
declare function validateBasicWorkoutItem(item: unknown): item is BasicWorkoutItem;
declare function validateWorkoutItemAerobic(item: unknown): item is WorkoutItemAerobic;
declare function validateWorkoutItemAnaerobic(item: unknown): item is WorkoutItemAnaerobic;
declare function validateWorkoutItemSuperset(item: unknown): item is WorkoutItemSuperset;
declare const _default: {
    validateBasicWorkoutItem: typeof validateBasicWorkoutItem;
    validateWorkoutItemAerobic: typeof validateWorkoutItemAerobic;
    validateWorkoutItemAnaerobic: typeof validateWorkoutItemAnaerobic;
    validateWorkoutItemSuperset: typeof validateWorkoutItemSuperset;
};
export default _default;
