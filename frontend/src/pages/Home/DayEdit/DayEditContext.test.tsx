/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DayEditProvider, ToggledElement, useDayEdit } from "./DayEditContext";
import { useAuth } from "../../../hooks/useAuth";
import { useGetTodayData } from "../../../hooks/useGetTodayData";
import { useUpdateTodayData } from "../../../hooks/useUpdateTodayData";
import testService from "../../../../test/service/testService";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";

vi.mock("../../../hooks/useGetTodayData");
vi.mock("../../../hooks/useAuth");
vi.mock("../../../hooks/useUpdateTodayData");

describe("DayEditContext", () => {
  beforeEach(() => {
    _mockUseAuth({});
    _mockUseGetTodayData({});
    _mockUseUpdateTodayData({});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("provides correct dailyData value", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      dailyData: {
        id: "1",
        date: "2021-01-01",
        weight: 80,
        waist: 100,
        targetCaloricIntake: 2000,
        intakes: [],
        workouts: [],
      },
    });
    const TestComponent = () => {
      const { dailyData } = useDayEdit();
      return <div>{dailyData?.id}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("provides correct isLoading value", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      isLoading: false,
    });
    const TestComponent = () => {
      const { isLoading } = useDayEdit();
      return <div>{isLoading ? "Loading..." : "Not Loading"}</div>;
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("Not Loading")).toBeInTheDocument();

    _mockUseGetTodayData({
      isLoading: true,
    });

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("provides correct isSuccess value", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      isSuccess: false,
    });
    const TestComponent = () => {
      const { isSuccess } = useDayEdit();
      return <div>{isSuccess ? "Success" : "Not Success"}</div>;
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("Not Success")).toBeInTheDocument();

    _mockUseGetTodayData({
      isSuccess: true,
    });

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("provides correct isError value", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      isError: false,
    });
    const TestComponent = () => {
      const { isError } = useDayEdit();
      return <div>{isError ? "Error" : "Not Error"}</div>;
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("Not Error")).toBeInTheDocument();

    _mockUseGetTodayData({
      isError: true,
    });

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("calls updateDailyData correctly", () => {
    const mockUpdateFunction = vi.fn();

    _mockUseAuth({});
    _mockUseGetTodayData({ isSuccess: true });
    _mockUseUpdateTodayData({ updateDailyData: mockUpdateFunction });

    const TestComponent = () => {
      const { updateDailyData } = useDayEdit();
      return (
        <button onClick={() => updateDailyData({ ...testService.createTestDailyData() })}>
          Update
        </button>
      );
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    fireEvent.click(screen.getByText("Update"));

    expect(mockUpdateFunction).toHaveBeenCalledTimes(1);
  });

  it("updates openedElement to WeightWaistInput when dailyData.weight is falsey", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { openedElement } = useDayEdit();
      return <div data-testid="open-element-test">{openedElement}</div>;
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(ToggledElement.IntakeEdit);

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), weight: undefined },
      isSuccess: true,
    });

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(
      ToggledElement.WeightWaistInput
    );
  });

  it("should keep openedElement to IntakeEdit when dailyData.weight is truthy", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { openedElement } = useDayEdit();
      return <div data-testid="open-element-test">{openedElement}</div>;
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(ToggledElement.IntakeEdit);

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), weight: 80 },
      isSuccess: true,
    });

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(ToggledElement.IntakeEdit);
  });

  it("should change openedElement to IntakeList when clicked on IntakeListBtn", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { openedElement, setOpenedElement } = useDayEdit();
      return (
        <>
          <div data-testid="open-element-test">{openedElement}</div>
          <button
            onClick={() => setOpenedElement(ToggledElement.IntakeList)}
            data-testid="open-element-btn"
          >
            Open
          </button>
        </>
      );
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(ToggledElement.IntakeEdit);

    fireEvent.click(screen.getByTestId("open-element-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(ToggledElement.IntakeList);
  });

  it("should provide proper intake value", () => {
    _mockUseAuth({});
    _mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { intake, setIntake } = useDayEdit();

      function handleSetBtnClick() {
        const updatedIntake = {
          ...intake,
          items: [{ ...intakeUtilService.getDefaultIntakeItem(), name: "test" }],
        };

        setIntake(updatedIntake);
      }

      return (
        <>
          <div data-testid="intake-test">{intake.items[0].name}</div>
          <button onClick={handleSetBtnClick} data-testid="intake-btn">
            Set
          </button>
        </>
      );
    };

    const { rerender } = render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("intake-test")).toHaveTextContent("");

    fireEvent.click(screen.getByTestId("intake-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("intake-test")).toHaveTextContent("test");
  });

  it("should provide proper recordedIntakes value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: {
        ...testService.createTestDailyData(),
        intakes: [
          testService.createTestIntake(),
          { ...testService.createTestIntake(), isRecorded: true },
          { ...testService.createTestIntake(), isRecorded: true },
        ],
      },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { recordedIntakes } = useDayEdit();
      return <div data-testid="recorded-intakes-test">{recordedIntakes.length}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("recorded-intakes-test")).toHaveTextContent("2");
  });

  it("should provide proper unrecordedIntakes value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: {
        ...testService.createTestDailyData(),
        intakes: [
          testService.createTestIntake(),
          { ...testService.createTestIntake(), isRecorded: true },
          { ...testService.createTestIntake(), isRecorded: true },
        ],
      },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { unrecordedIntakes } = useDayEdit();
      return <div data-testid="unrecorded-intakes-test">{unrecordedIntakes.length}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("unrecorded-intakes-test")).toHaveTextContent("1");
  });

  it("should provide proper consumedCalories value", () => {
    _mockUseAuth({});

    const intakes = [
      testService.createTestIntake(),
      { ...testService.createTestIntake(), isRecorded: true },
      { ...testService.createTestIntake(), isRecorded: true },
    ];

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), intakes },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { consumedCalories } = useDayEdit();
      return <div data-testid="consumed-calories-test">{consumedCalories}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const value = Number(screen.getByTestId("consumed-calories-test").textContent);
    expect(typeof value === "number").toBe(true);
  });

  it("should provide proper remainingCalories value", () => {
    _mockUseAuth({});

    const intakes = [
      testService.createTestIntake(),
      { ...testService.createTestIntake(), isRecorded: true },
      { ...testService.createTestIntake(), isRecorded: true },
    ];

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), intakes },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { remainingCalories } = useDayEdit();
      return <div data-testid="remaining-calories-test">{remainingCalories}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const value = Number(screen.getByTestId("remaining-calories-test").textContent);
    expect(typeof value === "number").toBe(true);
  });

  it("should provide proper targetCaloricIntakePerDay value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), targetCaloricIntake: 2000 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { targetCaloricIntakePerDay } = useDayEdit();
      return <div data-testid="target-caloric-intake-test">{targetCaloricIntakePerDay}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("target-caloric-intake-test")).toHaveTextContent("2000");
  });

  it("should provide targetCaloricIntakePerDay from daily data if it exists", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), targetCaloricIntake: 2000 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { targetCaloricIntakePerDay } = useDayEdit();
      return <div data-testid="target-caloric-intake-test">{targetCaloricIntakePerDay}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("target-caloric-intake-test")).toHaveTextContent("2000");
  });

  it("should provide targetCaloricIntakePerDay from user if it doesn't exists in daily data", () => {
    _mockUseAuth({
      targetCaloricIntakePerDay: 2000,
    });

    _mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { targetCaloricIntakePerDay } = useDayEdit();
      return <div data-testid="target-caloric-intake-test">{targetCaloricIntakePerDay}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("target-caloric-intake-test")).toHaveTextContent("2000");
  });

  it("should provide 0 as targetCaloricIntakePerDay if it doesn't exists in daily data and user", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { targetCaloricIntakePerDay } = useDayEdit();
      return <div data-testid="target-caloric-intake-test">{targetCaloricIntakePerDay}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("target-caloric-intake-test")).toHaveTextContent("0");
  });

  it("should provide proper estimatedKGChange value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), weight: 80 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { estimatedKGChange } = useDayEdit();
      return <div data-testid="estimated-kg-change-test">{estimatedKGChange}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const value = Number(screen.getByTestId("estimated-kg-change-test").textContent);
    expect(typeof value === "number").toBe(true);
  });

  it("should provide calConsumedPct value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), targetCaloricIntake: 2000 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { calConsumedPct } = useDayEdit();
      return <div data-testid="cal-consumed-pct-test">{calConsumedPct}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const value = Number(screen.getByTestId("cal-consumed-pct-test").textContent);
    expect(typeof value === "number").toBe(true);
  });

  it("should provide calRemainingPct value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), targetCaloricIntake: 2000 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { calRemainingPct } = useDayEdit();
      return <div data-testid="cal-remaining-pct-test">{calRemainingPct}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const value = Number(screen.getByTestId("cal-remaining-pct-test").textContent);
    expect(typeof value === "number").toBe(true);
  });

  it("should provide proper recommendedWaterIntake value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), weight: 80 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { recommendedWaterIntake } = useDayEdit();
      return <div data-testid="recommended-water-intake-test">{recommendedWaterIntake}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const value = Number(screen.getByTestId("recommended-water-intake-test").textContent);
    expect(typeof value === "number").toBe(true);
  });

  it("should provide proper backgroundColor value", () => {
    _mockUseAuth({});

    _mockUseGetTodayData({
      dailyData: { ...testService.createTestDailyData(), weight: 80 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { backgroundColor } = useDayEdit();
      return <div data-testid="background-color-test">{backgroundColor}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    const regexOfHexColor = /^#[0-9a-f]{6}$/i;

    expect(screen.getByTestId("background-color-test")).toHaveTextContent(regexOfHexColor);
  });
});

function _mockUseAuth(loggedInUser: any) {
  (useAuth as Mock).mockReturnValue({ loggedInUser });
}

function _mockUseUpdateTodayData({
  updateDailyData,
  isLoading,
}: {
  updateDailyData?: any;
  isLoading?: boolean;
}) {
  (useUpdateTodayData as Mock).mockReturnValue({
    updateDailyData,
    isLoading,
  });
}

function _mockUseGetTodayData({
  dailyData,
  isLoading,
  isSuccess,
  isError,
}: {
  dailyData?: any;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
}) {
  (useGetTodayData as Mock).mockReturnValue({ dailyData, isLoading, isSuccess, isError });
}
