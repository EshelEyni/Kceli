"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertWorkoutItem = exports.assertWorkout = exports.assertFavoriteIntake = exports.assertIntakeItem = exports.assertIntake = exports.assertDailyData = exports.assertUser = void 0;
function assertUser(user) {
    expect(user).toEqual(expect.objectContaining({
        id: expect.any(String),
        username: expect.any(String),
        fullname: expect.any(String),
        email: expect.any(String),
        imgUrl: expect.any(String),
        isAdmin: expect.any(Boolean),
    }));
    expect(typeof user.createdAt === "string" || typeof user.createdAt === "object").toBeTruthy();
}
exports.assertUser = assertUser;
function assertDailyData(dailyData) {
    expect(dailyData).toEqual(expect.objectContaining({
        id: expect.any(String),
        // date: expect.any(Date),
        userId: expect.any(String),
        intakes: expect.any(Array),
    }));
    dailyData.intakes.forEach(assertIntake);
}
exports.assertDailyData = assertDailyData;
function assertIntake(intake) {
    expect(intake).toEqual(expect.objectContaining({
        items: expect.any(Array),
        isRecorded: expect.any(Boolean),
    }));
    intake.items.forEach(assertIntakeItem);
}
exports.assertIntake = assertIntake;
function assertFavoriteIntake(intake) {
    assertIntake(intake);
    expect(intake.userId).toEqual(expect.any(Object));
    expect(intake.sortOrder).toEqual(expect.any(Number));
}
exports.assertFavoriteIntake = assertFavoriteIntake;
function assertIntakeItem(item) {
    expect(item).toEqual(expect.objectContaining({
        name: expect.any(String),
        quantity: expect.any(Number),
        unit: expect.any(String),
        calories: expect.any(Number),
    }));
}
exports.assertIntakeItem = assertIntakeItem;
function assertWorkout(workout) {
    const { id, userId } = workout;
    expect(typeof id === "string" || typeof id === "object").toBeTruthy();
    expect(typeof userId === "string" || typeof userId === "object").toBeTruthy();
    expect(workout).toEqual(expect.objectContaining({
        description: expect.any(String),
        items: expect.any(Array),
    }));
    for (const item of workout.items) {
        assertWorkoutItem(item);
    }
}
exports.assertWorkout = assertWorkout;
function assertWorkoutItem(item) {
    expect(item).toEqual(expect.objectContaining({
        name: expect.any(String),
        isStarted: expect.any(Boolean),
        isCompleted: expect.any(Boolean),
    }));
}
exports.assertWorkoutItem = assertWorkoutItem;
//# sourceMappingURL=testAssertionService.js.map