import { UserModel } from "./userModel";
import { DailyMotivationModel } from "../motivation/dailyMotivationModel";
import userService from "../../services/user/userService";

test("existing and new profiles default to opt-out and automatic tone", () => {
 const user = new UserModel({});
 expect(user.dailyMotivationEnabled).toBe(false); expect(user.dailyMotivationTone).toBe("auto");
});
test("the daily cache has a unique user/date index", () => {
 expect(DailyMotivationModel.schema.indexes()).toEqual(expect.arrayContaining([
  [expect.objectContaining({ userId: 1, localDate: 1 }), expect.objectContaining({ unique: true })],
 ]));
});
test("profile updates persist explicit opt-in and independent tone with validation", async () => {
 const exec = jest.fn().mockResolvedValue({ dailyMotivationEnabled: true, dailyMotivationTone: "neutral" });
 const update = jest.spyOn(UserModel, "findByIdAndUpdate").mockReturnValue({ exec } as any);
 try {
  await userService.update("507f1f77bcf86cd799439011", { dailyMotivationEnabled: true, dailyMotivationTone: "neutral", isAdmin: true } as any);
  expect(update).toHaveBeenCalledWith("507f1f77bcf86cd799439011", { dailyMotivationEnabled: true, dailyMotivationTone: "neutral" }, { new: true, runValidators: true });
 } finally { update.mockRestore(); }
});
test.each(["true", 1, null])("profile update rejects non-boolean opt-in %p", async value => {
 await expect(userService.update("507f1f77bcf86cd799439011", { dailyMotivationEnabled: value } as any)).rejects.toMatchObject({ statusCode: 400 });
});
test("invalid tones fail schema validation", () => {
 const errors = new UserModel({ dailyMotivationTone: "aggressive" }).validateSync()?.errors;
 expect(errors?.dailyMotivationTone).toBeDefined();
});
