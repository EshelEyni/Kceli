/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./calorieRouter";
import { errorHandler } from "../../services/error/errorService";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  createTestUser,
  getLoginTokenStrForTest,
  getNewMockIntake,
} from "../../services/test/testUtilService";
import setupAsyncLocalStorage from "../../middlewares/setupALS/setupALSMiddleware";
import openAIService from "../../services/openAI/openAIService";
import intakeService from "../../services/intake/intakeService";
import calorieService from "../../services/calorie/calorieService";

jest.mock("../../services/openAI/openAIService");
jest.mock("../../services/intake/intakeService");
jest.mock("../../services/calorie/calorieService");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.all("*", setupAsyncLocalStorage);
app.use(router);
app.use(errorHandler);

describe("Calorie Router: POST Actions", () => {
  let validUser: any, token: string;

  beforeAll(async () => {
    await connectToTestDB();
    validUser = await createTestUser({});
    token = getLoginTokenStrForTest(validUser.id);
  });

  afterAll(async () => {
    await disconnectFromTestDB();
  });

  describe("POST /item", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and the calories for the item", async () => {
      mockGetExistingIntakeItem(null);
      mockGetCaloriesForIntakeItem();
      const intake = getNewMockIntake();
      const res = await request(app).post("/item").set("Cookie", [token]).send(intake);
      expect(intakeService.getExistingIntakeItem).toHaveBeenCalledWith(intake);
      expect(calorieService.calcCaloriesFromExistingItem).not.toHaveBeenCalled();
      expect(openAIService.getCaloriesForIntakeItem).toHaveBeenCalledWith(intake);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: 100,
      });
    });

    it("should return 200 and the calories for the item from cache", async () => {
      mockGetExistingIntakeItem();
      mockCalcCaloriesFromExistingItem();

      const intake = getNewMockIntake();
      const res = await request(app).post("/item").set("Cookie", [token]).send(intake);
      expect(intakeService.getExistingIntakeItem).toHaveBeenCalledWith(intake);
      expect(calorieService.calcCaloriesFromExistingItem).toHaveBeenCalledWith({
        existingItemData: mockGetExistingIntakeItem(),
        intakeItem: intake,
      });
      expect(openAIService.getCaloriesForIntakeItem).not.toHaveBeenCalledWith(intake);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: 100,
      });
    });

    it("should return 400 if intake is an empty object", async () => {
      const res = await request(app).post("/item").set("Cookie", [token]).send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual(
        expect.objectContaining({
          status: "fail",
          message: "Empty body provided",
        })
      );
    });
  });
});

function mockGetExistingIntakeItem(value?: any) {
  const resolvedVal = value !== undefined ? value : { calories: 100 };
  (intakeService.getExistingIntakeItem as jest.Mock).mockResolvedValue(resolvedVal);
  return resolvedVal;
}

function mockCalcCaloriesFromExistingItem(value?: any) {
  const resolvedVal = value !== undefined ? value : 100;
  (calorieService.calcCaloriesFromExistingItem as jest.Mock).mockReturnValue(resolvedVal);
  return resolvedVal;
}

function mockGetCaloriesForIntakeItem(value?: any) {
  const resolvedVal = value !== undefined ? value : 100;
  (openAIService.getCaloriesForIntakeItem as jest.Mock).mockResolvedValue(resolvedVal);
  return resolvedVal;
}
