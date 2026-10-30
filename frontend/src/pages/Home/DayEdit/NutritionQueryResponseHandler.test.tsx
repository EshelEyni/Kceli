import { it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NutritionQueryResponseHandler } from "./NutritionQueryResponseHandler";
afterEach(cleanup);
it("renders the OpenAI answer", () => {
  render(<NutritionQueryResponseHandler queryState={{ type: "chatGPT", status: "success", response: "First line\nSecond line", error: null }} />);
  expect(screen.getByTestId("nutrition-query-response-handler")).toHaveTextContent("First line Second line");
});
