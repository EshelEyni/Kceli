import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NutritionQueryResponseHandler } from "./NutritionQueryResponseHandler";
import testService from "../../../../test/service/testService";
import {
  FormattedNinjaAPIResData,
  FormattedUSDAFoodObject,
} from "../../../../../shared/types/system";

describe("Nutrition Query Response Handler", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render nutrition query response handler", () => {
    const queryState = testService.createNutritionQuery({ type: "chatGPT", status: "success" });
    render(<NutritionQueryResponseHandler queryState={queryState} />);
    expect(screen.getByTestId("nutrition-query-response-handler")).toBeInTheDocument();
  });

  it("should render dot loader when status is loading", () => {
    const queryState = testService.createNutritionQuery({ type: "chatGPT", status: "loading" });
    render(<NutritionQueryResponseHandler queryState={queryState} />);
    expect(screen.getByTestId("dot-loader")).toBeInTheDocument();
  });

  it("should render error msg when status is error", () => {
    const queryState = testService.createNutritionQuery({
      type: "chatGPT",
      status: "error",
      error: "test error",
    });

    render(<NutritionQueryResponseHandler queryState={queryState} />);
    expect(screen.getByTestId("error-msg")).toBeInTheDocument();
    expect(screen.getByText("test error")).toBeInTheDocument();
  });

  it("should render chatGPT response when status is success and type is chatGPT", () => {
    const response = testService.createNutritionQueryResponse("chatGPT") as string;
    const queryState = testService.createNutritionQuery({
      type: "chatGPT",
      response,
      status: "success",
    });

    render(<NutritionQueryResponseHandler queryState={queryState} />);
    expect(screen.getByText(response)).toBeInTheDocument();
  });

  it("should render ninjaAPI response when status is success and type is ninjaAPI", () => {
    const queryState = testService.createNutritionQuery({
      type: "ninjaAPI",
      response: testService.createNutritionQueryResponse("ninjaAPI"),
      status: "success",
    });

    render(<NutritionQueryResponseHandler queryState={queryState} />);

    expect(screen.getByTestId("nutrition-query-response-ninja-api-response")).toBeInTheDocument();

    const { response } = queryState;

    for (const item of response as FormattedNinjaAPIResData) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.calories.toString())).toBeInTheDocument();
    }
  });

  it("should render USDAAPI response when status is success and type is USDAAPI", () => {
    const queryState = testService.createNutritionQuery({
      type: "usdaAPI",
      response: testService.createNutritionQueryResponse("usdaAPI"),
      status: "success",
    });

    render(<NutritionQueryResponseHandler queryState={queryState} />);

    expect(screen.getByTestId("nutrition-query-response-usda-api-response")).toBeInTheDocument();

    const { response } = queryState;

    for (const item of response as FormattedUSDAFoodObject[]) {
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("should render null when status is 'idle'", () => {
    const queryState = testService.createNutritionQuery({ type: "chatGPT", status: "idle" });
    const { container } = render(<NutritionQueryResponseHandler queryState={queryState} />);
    expect(container.firstChild).toBeNull();
  });
});
