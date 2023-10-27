/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import {
  formatNinjaAPIResData,
  formatUSDAAPIData,
  queryChatGPT,
  queryNinjaAPI,
  queryUSDA,
} from "./nutritionController";
import {
  getMockNinjaApiResponse,
  getMockUSDAApiResponse,
} from "../../services/test/testUtilService";
import axios from "axios";
import openAIService from "../../services/openAI/openAIService";

jest.mock("axios");
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

  describe("queryNinjaAPI", () => {
    beforeEach(() => {
      req = { query: { query: "apple" } };
      res = { send: jest.fn() };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should return the data from the ninja api", async () => {
      const mockRes = getMockNinjaApiResponse();
      const axiosRes = _mockAxiosGet(mockRes);
      const formattedRes = formatNinjaAPIResData(axiosRes.data);
      const sut = queryNinjaAPI as any;
      await sut(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: formattedRes,
      });
    });

    it("should throw an error if query is not provided", async () => {
      req = { query: {} };
      const sut = queryNinjaAPI as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("Please provide query"));
    });

    it("should throw an error if query is not a string", async () => {
      req = { query: { query: ["test"] } };
      const sut = queryNinjaAPI as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("query must be a string"));
    });

    it("should throw an error if NINJA_API_KEY is not defined", async () => {
      const originalNinjaAPIKey = process.env.NINJA_API_KEY;
      process.env.NINJA_API_KEY = "";
      const sut = queryNinjaAPI as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("NINJA_API_KEY is not defined"));
      process.env.NINJA_API_KEY = originalNinjaAPIKey;
    });
  });

  describe("queryUSDA", () => {
    beforeEach(() => {
      req = { query: { query: "apple" } };
      res = { send: jest.fn() };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should return the data from the usda api", async () => {
      const mockRes = getMockUSDAApiResponse();
      const axiosRes = _mockAxiosGet(mockRes);
      const formattedRes = formatUSDAAPIData(axiosRes.data);
      const sut = queryUSDA as any;
      await sut(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: formattedRes,
      });
    });

    it("should throw an error if query is not provided", async () => {
      req = { query: {} };
      const sut = queryUSDA as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("Please provide query"));
    });

    it("should throw an error if query is not a string", async () => {
      req = { query: { query: ["test"] } };
      const sut = queryUSDA as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("query must be a string"));
    });

    it("should throw an error if USDA_NUTRIENTS_API_KEY is not defined", async () => {
      const originalUSDA_API_KEY = process.env.USDA_NUTRIENTS_API_KEY;
      process.env.USDA_NUTRIENTS_API_KEY = "";
      const sut = queryUSDA as any;
      await sut(req as Request, res as Response);

      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith(new Error("USDA_API_KEY is not defined"));
      process.env.USDA_NUTRIENTS_API_KEY = originalUSDA_API_KEY;
    });
  });
});

function _mockAxiosGet(value: any) {
  (axios.get as jest.Mock).mockResolvedValue(value);
  return value;
}
