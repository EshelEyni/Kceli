import cookieParser from "cookie-parser";
import express from "express";
import { errorHandler } from "../../services/error/errorService";
import router from "./nutritionRouter";
import request from "supertest";
import { connectToTestDB, disconnectFromTestDB } from "../../services/test/testDBService";
import {
  createTestUser,
  deleteTestUser,
  getLoginTokenStrForTest,
} from "../../services/test/testUtilService";
import { User } from "../../../../shared/types/user";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorHandler);

describe("Nutrition Router", () => {
  let validUser: User, token: string;

  beforeAll(async () => {
    await connectToTestDB();
    validUser = await createTestUser({});
    token = getLoginTokenStrForTest(validUser.id);
  });

  afterAll(async () => {
    await deleteTestUser(validUser.id);
    await disconnectFromTestDB();
  });

  describe("GET /usda", () => {
    it("should return 200 and an array of foods", async () => {
      const res = await request(app).get("/usda?query=apple").set("Cookie", [token]);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        status: "success",
        data: expect.any(Array),
      });
    });
  });
});
