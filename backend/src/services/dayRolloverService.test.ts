import { ensureToday, getLocalDate } from "./dayRolloverService";
import { DailyDataModel } from "../models/day/dailyDataModel";
jest.mock("../models/day/dailyDataModel", () => ({
  DailyDataModel: {
    collection: { createIndex: jest.fn().mockResolvedValue("index") },
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
  },
}));
const find = DailyDataModel.findOne as jest.Mock;
const create = DailyDataModel.create as jest.Mock;
const update = DailyDataModel.updateOne as jest.Mock;
const now = new Date("2026-11-02T22:00:00Z");
beforeEach(() => {
  jest.clearAllMocks();
});
it("uses the local calendar boundary rather than UTC or a fixed offset", () => {
  expect(getLocalDate("Asia/Jerusalem", new Date("2026-11-02T21:59:59Z"))).toBe("2026-11-02");
  expect(getLocalDate("Asia/Jerusalem", now)).toBe("2026-11-03");
  expect(getLocalDate("America/Los_Angeles", now)).toBe("2026-11-02");
});
it("handles DST and extreme offsets", () => {
  expect(getLocalDate("Asia/Jerusalem", new Date("2026-07-01T21:00:00Z"))).toBe("2026-07-02");
  expect(getLocalDate("America/New_York", new Date("2026-11-01T05:30:00Z"))).toBe("2026-11-01");
  expect(getLocalDate("America/New_York", new Date("2026-11-01T06:30:00Z"))).toBe("2026-11-01");
  expect(getLocalDate("Pacific/Kiritimati", now)).toBe("2026-11-03");
  expect(() => getLocalDate("invalid")).toThrow("valid IANA time zone");
});
it("returns today's existing record without creating", async () => {
  const doc = { id: "today" };
  find.mockResolvedValueOnce(doc);
  expect(await ensureToday("user", "Asia/Jerusalem", now)).toEqual({ doc, created: false });
  expect(find).toHaveBeenCalledWith({ userId: "user", localDate: "2026-11-03" });
  expect(create).not.toHaveBeenCalled();
});
it("creates only the return date, including first visits and long inactivity", async () => {
  find.mockResolvedValueOnce(null).mockReturnValueOnce({ sort: jest.fn().mockResolvedValue(null) });
  const doc = { id: "new" };
  create.mockResolvedValueOnce(doc);
  expect(await ensureToday("user", "Asia/Jerusalem", now)).toEqual({ doc, created: true });
  expect(create).toHaveBeenCalledTimes(1);
  expect(create).toHaveBeenCalledWith({
    userId: "user",
    localDate: "2026-11-03",
    timeZone: "Asia/Jerusalem",
    date: now,
  });
});
it("claims legacy records without modifying journal data or timestamps", async () => {
  const doc = { _id: "legacy", intakes: ["meal"] };
  find
    .mockResolvedValueOnce(null)
    .mockReturnValueOnce({ sort: jest.fn().mockResolvedValue(doc) })
    .mockResolvedValueOnce(doc);
  expect(await ensureToday("user", "Asia/Jerusalem", now)).toEqual({ doc, created: false });
  expect(update).toHaveBeenCalledWith(
    { _id: "legacy", localDate: { $exists: false } },
    { $set: { localDate: "2026-11-03", timeZone: "Asia/Jerusalem" } },
    { timestamps: false }
  );
  expect(create).not.toHaveBeenCalled();
});
it("returns the winning record after a concurrent insert", async () => {
  const doc = { id: "winner" };
  find
    .mockResolvedValueOnce(null)
    .mockReturnValueOnce({ sort: jest.fn().mockResolvedValue(null) })
    .mockResolvedValueOnce(doc);
  create.mockRejectedValueOnce({ code: 11000 });
  expect(await ensureToday("user", "Asia/Jerusalem", now)).toEqual({ doc, created: false });
});
it("propagates storage failures", async () => {
  find.mockRejectedValueOnce(new Error("offline"));
  await expect(ensureToday("user", "Asia/Jerusalem", now)).rejects.toThrow("offline");
});
