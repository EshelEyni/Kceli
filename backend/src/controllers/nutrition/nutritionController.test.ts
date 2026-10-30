/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { queryChatGPT } from "./nutritionController";
import openAIService from "../../services/openAI/openAIService";

jest.mock("../../services/openAI/openAIService");

const nextMock = jest.fn() as jest.MockedFunction<NextFunction>;

jest.mock("../../services/error/errorService", () => {
  const originalModule = jest.requireActual("../../services/error/errorService");
  return {
    ...originalModule,
    asyncErrorCatcher: jest.fn().mockImplementation(fn => {
      return async (...args: unknown[]) => {
        try {
          return await fn(...args);
        } catch (error) {
          return nextMock(error);
        }
      };
    }),
  };
});

describe("Nutrition Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  describe("queryChatGPT", () => {
    beforeEach(() => {
      req = { query: { prompt: "apple" } };
      res = { send: jest.fn() };
      (openAIService.getText as jest.Mock).mockResolvedValue("test");
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return the data from the openAI api", async () => {
      const sut = queryChatGPT as any;
      await sut(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: "test",
      });
    });

    it("should throw an error if prompt is not provided", async () => {
      req = { query: {} };
      const sut = queryChatGPT as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("Please provide prompt"));
    });

    it("should throw an error if prompt is not a string", async () => {
      req = { query: { prompt: ["test"] } };
      const sut = queryChatGPT as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("prompt must be a string"));
    });
  });

});
