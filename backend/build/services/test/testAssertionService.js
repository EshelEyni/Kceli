"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIntakeItem = exports.assertIntake = exports.assertDailyData = exports.assertUser = void 0;
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
function assertIntakeItem(item) {
    expect(item).toEqual(expect.objectContaining({
        name: expect.any(String),
        quantity: expect.any(Number),
        unit: expect.any(String),
        calories: expect.any(Number),
    }));
}
exports.assertIntakeItem = assertIntakeItem;
//# sourceMappingURL=testAssertionService.js.map