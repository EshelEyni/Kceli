import { UserModel } from "../../models/user/userModel";
import userService from "./userService";
import { User } from "../../../../shared/types/user";

jest.mock("../openAI/openAIService", () => ({ __esModule: true, default: {} }));
afterEach(() => jest.restoreAllMocks());

describe("User language preference", () => {
  it("defaults existing documents without a preference to English and returns it in JSON", () => {
    const user = UserModel.hydrate({ username: "alex" });
    expect(user.language).toBe("en");
    expect(user.toJSON().language).toBe("en");
  });

  it("accepts Hebrew and rejects unsupported or empty language preferences", () => {
    expect(new UserModel({ language: "he" }).validateSync()?.errors.language).toBeUndefined();
    for (const language of ["fr", "", null]) {
      expect(new UserModel({ language }).validateSync()?.errors.language).toBeDefined();
    }
  });

  it("writes the language preference with validation and returns the saved user", async () => {
    const saved = { id: "user-id", language: "he" };
    const update = jest.spyOn(UserModel, "findByIdAndUpdate").mockReturnValue({
      exec: jest.fn().mockResolvedValue(saved),
    } as never);
    const result = await userService.update("user-id", { language: "he", isAdmin: true } as User);
    expect(update).toHaveBeenCalledWith(
      "user-id",
      { language: "he" },
      { new: true, runValidators: true }
    );
    expect(result).toBe(saved);
  });
});
