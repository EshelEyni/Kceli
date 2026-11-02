import { Request, Response, NextFunction } from "express";
import { createDay, getToday } from "./dayController";
import { ensureToday } from "../../services/dayRolloverService";
import { getLoggedInUserIdFromReq } from "../../services/ALSService";
jest.mock("../../services/dayRolloverService", () => ({ ensureToday: jest.fn() }));
jest.mock("../../services/ALSService", () => ({ getLoggedInUserIdFromReq: jest.fn() }));
const ensure = ensureToday as jest.Mock;
beforeEach(() => {
  jest.clearAllMocks();
  (getLoggedInUserIdFromReq as jest.Mock).mockReturnValue("507f1f77bcf86cd799439011");
});
async function call(handler: typeof getToday, query = {}, body = {}) {
  const req = { query, body } as Request;
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const next = jest.fn();
  handler(req, res as unknown as Response, next as NextFunction);
  await new Promise(resolve => setImmediate(resolve));
  return { res, next };
}
it("passes the browser zone and returns an existing day", async () => {
  ensure.mockResolvedValueOnce({ doc: { id: "today" }, created: false });
  const { res } = await call(getToday, { timeZone: "America/New_York" });
  expect(ensure).toHaveBeenCalledWith("507f1f77bcf86cd799439011", "America/New_York");
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.send).toHaveBeenCalledWith({ status: "success", data: { id: "today" } });
});
it("returns 201 only for a new record", async () => {
  ensure.mockResolvedValueOnce({ doc: {}, created: true });
  const { res } = await call(getToday);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(ensure).toHaveBeenCalledWith(expect.any(String), "Asia/Jerusalem");
});
it("makes legacy POST requests idempotent and ignores submitted date and contents", async () => {
  ensure.mockResolvedValueOnce({ doc: {}, created: false });
  const { res } = await call(createDay, {}, { date: "2000-01-01", intakes: ["meal"] });
  expect(ensure).toHaveBeenCalledWith(expect.any(String), "Asia/Jerusalem");
  expect(res.status).toHaveBeenCalledWith(200);
});
it("rejects unauthenticated requests before creating data", async () => {
  (getLoggedInUserIdFromReq as jest.Mock).mockReturnValue("");
  const { next } = await call(getToday);
  expect(next).toHaveBeenCalledWith(expect.any(Error));
  expect(ensure).not.toHaveBeenCalled();
});
it("propagates storage errors", async () => {
  const error = new Error("database unavailable");
  ensure.mockRejectedValueOnce(error);
  const { next } = await call(getToday);
  expect(next).toHaveBeenCalledWith(error);
});
