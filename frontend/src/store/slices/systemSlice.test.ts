import { describe, beforeEach, it, expect } from "vitest";
import { setIsPageLoading } from "./systemSlice";
import { configureStore } from "@reduxjs/toolkit";
import systemReducer from "./systemSlice";

describe("systemSlice", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        system: systemReducer,
      },
    });
  });

  it("should set isPageLoading", () => {
    store.dispatch(setIsPageLoading(true));
    const state1 = store.getState().system;
    expect(state1.isPageLoading).toBe(true);

    store.dispatch(setIsPageLoading(false));
    const state2 = store.getState().system;
    expect(state2.isPageLoading).toBe(false);
  });
});
