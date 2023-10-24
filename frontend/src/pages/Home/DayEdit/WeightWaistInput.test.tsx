import { it, describe, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WeightWaistInput } from "./WeightWaistInput";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import testService from "../../../../test/service/testService";

vi.mock("./DayEditContext");

describe("Weight Waist Input", () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it("should render spinner loader", () => {
    mockUseDayEdit({ isLoading: true });
    const { container } = render(<WeightWaistInput />);

    const spinner = screen.getByTestId("spinner-loader");
    expect(spinner).toBeInTheDocument();
    expect(container.children.length).toBe(1);
  });

  it("should render form", () => {
    const dailyData = {
      ...testService.createDailyData(),
      weight: "",
      waist: "",
    };

    mockUseDayEdit({ dailyData });

    const { container } = render(<WeightWaistInput />);

    const form = screen.getByTestId("weight-waist-form");
    expect(form).toBeInTheDocument();
    expect(container.children.length).toBe(1);
  });

  it("should update daily data when submiting form", async () => {
    const dailyData = {
      ...testService.createDailyData(),
      weight: "",
      waist: "",
    };

    const { updateDailyData } = mockUseDayEdit({ dailyData });

    render(<WeightWaistInput />);

    const weightInput = screen.getByPlaceholderText("Enter your weight");
    const waistInput = screen.getByPlaceholderText("Enter your waist size");
    const form = screen.getByTestId("weight-waist-form");

    fireEvent.change(weightInput, { target: { value: 80 } });
    fireEvent.change(waistInput, { target: { value: 80 } });
    fireEvent.submit(form);

    await waitFor(() =>
      expect(updateDailyData).toHaveBeenCalledWith({
        ...dailyData,
        weight: 80,
        waist: 80,
      })
    );
  });

  it("should render weight and waist", () => {
    const dailyData = {
      ...testService.createDailyData(),
      weight: 80,
      waist: 80,
    };

    mockUseDayEdit({ dailyData });

    render(<WeightWaistInput />);

    const weight = screen.getByText("80 kg");
    const waist = screen.getByText("80 cm");

    expect(weight).toBeInTheDocument();
    expect(waist).toBeInTheDocument();
  });
});
