/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import {
  formatNinjaAPIResData,
  formatUSDAAPIData,
  queryNinjaAPI,
  queryUSDA,
} from "./nutritionController";
import {
  getMockNinjaApiResponse,
  getMockUSDAApiResponse,
} from "../../services/test/testUtilService";
import axios from "axios";

jest.mock("axios");

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

  // describe("queryChatGPT", () => {});

  describe("queryNinjaAPI", () => {
    beforeEach(() => {
      req = { query: { query: "apple" } };
      res = { send: jest.fn() };
    });

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it("should return the data from the ninja api", async () => {
      const mockRes = getMockNinjaApiResponse();
      const axiosRes = _mockAxiosGet(mockRes);
      const formattedRes = formatNinjaAPIResData(axiosRes);
      const sut = queryNinjaAPI as any;
      await sut(req as Request, res as Response);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith({
        status: "success",
        data: formattedRes,
      });
    });
  });

  fdescribe("queryUSDA", () => {
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
  });
});

function _mockAxiosGet(value: any) {
  (axios.get as jest.Mock).mockResolvedValue(value);
  return value;
}
