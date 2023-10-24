/* eslint-disable @typescript-eslint/no-explicit-any */
import { it, describe, expect, afterEach, vi, Mock } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { NutritionQuery } from "./NutritionQuery";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import nutritionApiService from "../../../services/nutrition/nutritionApiService";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");
vi.mock("../../../services/nutrition/nutritionApiService");

describe("Nutrition Query", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render nutrition query", () => {
    mockUseDayEdit({});
    render(<NutritionQuery />);
    expect(screen.getByTestId("nutrition-query")).toBeInTheDocument();
  });

  it("should render nutrition query description", () => {
    mockUseDayEdit({});
    render(<NutritionQuery />);

    const descriptionText = [
      "This tab let's you query the APIs used by the app.",
      "The first one is a chatbot that generates a response based on the input",
      "The second one is a food database.",
      "The third one is a nutrition database.",
    ];

    descriptionText.forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("should render chatGPT query form", () => {
    mockUseDayEdit({});
    render(<NutritionQuery />);

    const NutritionQueryForm = screen.getByTestId("nutrition-query-form");
    expect(NutritionQueryForm).toBeInTheDocument();
  });

  it("should render all form fields", () => {
    mockUseDayEdit({});
    render(<NutritionQuery />);

    const chatGPTQueryField = screen.getByLabelText("Chat GPT");
    expect(chatGPTQueryField).toBeInTheDocument();

    const ninjaAPIQueryField = screen.getByLabelText("Ninja API");
    expect(ninjaAPIQueryField).toBeInTheDocument();

    const USDAAPIQueryField = screen.getByLabelText("USDA API");
    expect(USDAAPIQueryField).toBeInTheDocument();
  });

  it("should call onSubmit with form data on submit", async () => {
    const {
      chatGPTQuery,
      setChatGPTQuery,
      ninjaAPIQuery,
      setNinjaAPIQuery,
      USDAAPIQuery,
      setUSDAAPIQuery,
    } = mockUseDayEdit({});
    render(<NutritionQuery />);

    fireEvent.change(screen.getByLabelText("Chat GPT"), { target: { value: "test" } });
    fireEvent.change(screen.getByLabelText("Ninja API"), { target: { value: "test" } });
    fireEvent.change(screen.getByLabelText("USDA API"), { target: { value: "test" } });

    const resChatGPT = mockNutritionQueryChatGPT();
    const resNinjaAPI = mockNutritionQueryNinja();
    const resUSDAAPI = mockNutritionQueryUSDA();

    fireEvent.click(screen.getByText("query"));

    await waitFor(() => {
      expect(setChatGPTQuery).toHaveBeenNthCalledWith(1, {
        ...chatGPTQuery,
        status: "loading",
      });

      expect(setNinjaAPIQuery).toHaveBeenNthCalledWith(1, {
        ...ninjaAPIQuery,
        status: "loading",
      });

      expect(setUSDAAPIQuery).toHaveBeenNthCalledWith(1, {
        ...USDAAPIQuery,
        status: "loading",
      });

      expect(setChatGPTQuery).toHaveBeenNthCalledWith(2, {
        ...chatGPTQuery,
        status: "success",
        response: resChatGPT,
      });

      expect(setNinjaAPIQuery).toHaveBeenNthCalledWith(2, {
        ...ninjaAPIQuery,
        status: "success",
        response: resNinjaAPI,
      });

      expect(setUSDAAPIQuery).toHaveBeenNthCalledWith(2, {
        ...USDAAPIQuery,
        status: "success",
        response: resUSDAAPI,
      });
    });

    it("should only set query state when query is not empty", async () => {
      const {
        chatGPTQuery,
        setChatGPTQuery,
        ninjaAPIQuery,
        setNinjaAPIQuery,
        USDAAPIQuery,
        setUSDAAPIQuery,
      } = mockUseDayEdit({});
      render(<NutritionQuery />);

      fireEvent.change(screen.getByLabelText("Chat GPT"), { target: { value: "test" } });

      const resChatGPT = mockNutritionQueryChatGPT();
      const resNinjaAPI = mockNutritionQueryNinja();
      const resUSDAAPI = mockNutritionQueryUSDA();

      fireEvent.click(screen.getByText("query"));

      await waitFor(() => {
        expect(setChatGPTQuery).toHaveBeenNthCalledWith(1, {
          ...chatGPTQuery,
          status: "loading",
        });

        expect(setChatGPTQuery).toHaveBeenNthCalledWith(2, {
          ...chatGPTQuery,
          status: "success",
          response: resChatGPT,
        });

        expect(setNinjaAPIQuery).not.toHaveBeenCalled();
        expect(setUSDAAPIQuery).not.toHaveBeenCalled();
      });

      fireEvent.change(screen.getByLabelText("Chat GPT"), { target: { value: "" } });
      fireEvent.change(screen.getByLabelText("Ninja API"), { target: { value: "test" } });

      fireEvent.click(screen.getByText("query"));

      await waitFor(() => {
        expect(setNinjaAPIQuery).toHaveBeenNthCalledWith(1, {
          ...ninjaAPIQuery,
          status: "loading",
        });

        expect(setNinjaAPIQuery).toHaveBeenNthCalledWith(2, {
          ...ninjaAPIQuery,
          status: "success",
          response: resNinjaAPI,
        });

        expect(setChatGPTQuery).not.toHaveBeenCalled();
        expect(setUSDAAPIQuery).not.toHaveBeenCalled();
      });

      fireEvent.change(screen.getByLabelText("Ninja API"), { target: { value: "" } });
      fireEvent.change(screen.getByLabelText("USDA API"), { target: { value: "test" } });

      fireEvent.click(screen.getByText("query"));

      await waitFor(() => {
        expect(setUSDAAPIQuery).toHaveBeenNthCalledWith(1, {
          ...USDAAPIQuery,
          status: "loading",
        });

        expect(setUSDAAPIQuery).toHaveBeenNthCalledWith(2, {
          ...USDAAPIQuery,
          status: "success",
          response: resUSDAAPI,
        });

        expect(setChatGPTQuery).not.toHaveBeenCalled();
        expect(setNinjaAPIQuery).not.toHaveBeenCalled();
      });
    });

    it("should handle errors in submit", async () => {
      const {
        chatGPTQuery,
        setChatGPTQuery,
        ninjaAPIQuery,
        setNinjaAPIQuery,
        USDAAPIQuery,
        setUSDAAPIQuery,
      } = mockUseDayEdit({});
      render(<NutritionQuery />);

      fireEvent.change(screen.getByLabelText("Chat GPT"), { target: { value: "test" } });
      fireEvent.change(screen.getByLabelText("Ninja API"), { target: { value: "test" } });
      fireEvent.change(screen.getByLabelText("USDA API"), { target: { value: "test" } });

      const error = new Error("test error");

      (nutritionApiService.queryChatGPT as Mock).mockRejectedValueOnce(error);
      (nutritionApiService.queryNinja as Mock).mockRejectedValueOnce(error);
      (nutritionApiService.queryUSDA as Mock).mockRejectedValueOnce(error);

      fireEvent.click(screen.getByText("query"));

      await waitFor(() => {
        expect(setChatGPTQuery).toHaveBeenNthCalledWith(1, {
          ...chatGPTQuery,
          status: "loading",
        });

        expect(setNinjaAPIQuery).toHaveBeenNthCalledWith(1, {
          ...ninjaAPIQuery,
          status: "loading",
        });

        expect(setUSDAAPIQuery).toHaveBeenNthCalledWith(1, {
          ...USDAAPIQuery,
          status: "loading",
        });

        expect(setChatGPTQuery).toHaveBeenNthCalledWith(2, {
          ...chatGPTQuery,
          status: "error",
          error: error.message,
        });

        expect(setNinjaAPIQuery).toHaveBeenNthCalledWith(2, {
          ...ninjaAPIQuery,
          status: "error",
          error: error.message,
        });

        expect(setUSDAAPIQuery).toHaveBeenNthCalledWith(2, {
          ...USDAAPIQuery,
          status: "error",
          error: error.message,
        });
      });
    });
  });

  it("should render chatGPT query response where status is not 'idle'", () => {
    mockUseDayEdit({
      chatGPTQuery: testService.createNutritionQuery({ type: "chatGPT", status: "success" }),
    });
    render(<NutritionQuery />);

    expect(screen.getByText("Chat GPT Response:")).toBeInTheDocument();
  });

  it("should render ninjaAPI query response where status is not 'idle'", () => {
    mockUseDayEdit({
      ninjaAPIQuery: testService.createNutritionQuery({ type: "ninjaAPI", status: "success" }),
    });
    render(<NutritionQuery />);

    expect(screen.getByText("Ninja API Response:")).toBeInTheDocument();
  });

  it("should render USDAAPI query response where status is not 'idle'", () => {
    mockUseDayEdit({
      USDAAPIQuery: testService.createNutritionQuery({ type: "usdaAPI", status: "success" }),
    });
    render(<NutritionQuery />);

    expect(screen.getByText("USDA API Response:")).toBeInTheDocument();
  });
});

function mockNutritionQueryChatGPT(value?: any) {
  const defaultValue = testService.createNutritionQueryResponse("chatGPT");
  (nutritionApiService.queryChatGPT as Mock).mockResolvedValue(value || defaultValue);
  return value || defaultValue;
}

function mockNutritionQueryNinja(value?: any) {
  const defaultValue = testService.createNutritionQueryResponse("ninjaAPI");
  (nutritionApiService.queryNinja as Mock).mockResolvedValue(value || defaultValue);
  return value || defaultValue;
}

function mockNutritionQueryUSDA(value?: any) {
  const defaultValue = testService.createNutritionQueryResponse("usdaAPI");
  (nutritionApiService.queryUSDA as Mock).mockResolvedValue(value || defaultValue);
  return value || defaultValue;
}
