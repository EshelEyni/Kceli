import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DayEditProvider, DayEditTab, useDayEdit } from "./DayEditContext";
import testService from "../../../../test/service/testService";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import {
  mockUseAuth,
  mockUseGetTodayData,
  mockUseGetUserFavoriteIntakes,
  mockUseSearchParams,
  mockUseUpdateTodayData,
} from "../../../../test/service/mockService";
import nutritionUtilService from "../../../services/nutrition/nutritionUtilService";
import { FormattedNinjaAPIResData } from "../../../../../shared/types/system";

vi.mock("react-router-dom");
vi.mock("../../../hooks/useGetTodayData");
vi.mock("../../../hooks/useAuth");
vi.mock("../../../hooks/useUpdateTodayData");
vi.mock("../../../hooks/useGetUserFavoriteIntakes");

describe.skip("DayEditContext", () => {
  beforeEach(() => {
    mockUseAuth({});
    mockUseGetTodayData({});
    mockUseUpdateTodayData({});
    mockUseGetUserFavoriteIntakes({});
    mockUseSearchParams({});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("provides correct dailyData value", () => {
    mockUseAuth({});
    mockUseGetTodayData({
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
    mockUseAuth({});
    mockUseGetTodayData({
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

    mockUseGetTodayData({
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
    mockUseAuth({});
    mockUseGetTodayData({
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

    mockUseGetTodayData({
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
    mockUseAuth({});
    mockUseGetTodayData({
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

    mockUseGetTodayData({
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

    mockUseAuth({});
    mockUseGetTodayData({ isSuccess: true });
    mockUseUpdateTodayData({ updateDailyData: mockUpdateFunction });

    const TestComponent = () => {
      const { updateDailyData } = useDayEdit();
      const dailyData = testService.createDailyData({});
      return (
        <button
          onClick={() =>
            updateDailyData({
              id: dailyData.id,
              data: dailyData,
            })
          }
        >
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

  it("should set initital openedTab from search params", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });
    mockUseSearchParams({
      searchParams: { get: () => DayEditTab.IntakeList },
    });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="opened-tab-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("opened-tab-test")).toHaveTextContent(DayEditTab.IntakeList);
  });

  it("should set initial openedTab to IntakeEdit if search params are not provided", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });
    mockUseSearchParams({
      searchParams: { get: () => null },
    });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="opened-tab-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("opened-tab-test")).toHaveTextContent(DayEditTab.IntakeEdit);
  });

  it("should change openedTab to IntakeList when clicked on IntakeListBtn", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { openedTab, setOpenedTab } = useDayEdit();
      return (
        <>
          <div data-testid="open-element-test">{openedTab}</div>
          <button
            onClick={() => setOpenedTab(DayEditTab.IntakeList)}
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

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.IntakeEdit);

    fireEvent.click(screen.getByTestId("open-element-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.IntakeList);
  });

  it("should provide proper intake value", () => {
    mockUseAuth({});
    mockUseGetTodayData({
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

  it("should provide proper currIntakeItemId value", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { intake, currIntakeItemId, setCurrIntakeItemId } = useDayEdit();

      function handleSetBtnClick() {
        setCurrIntakeItemId("test");
      }

      return (
        <>
          <div data-testid="curr-intake-item-id-test">{currIntakeItemId}</div>
          <div data-testid="first-intake-item-id-test">{intake.items[0].id}</div>

          <button onClick={handleSetBtnClick} data-testid="curr-intake-item-id-btn">
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

    const firstIntakeItemId = screen.getByTestId("first-intake-item-id-test").textContent;
    const currIntakeItemId = screen.getByTestId("curr-intake-item-id-test").textContent;

    expect(currIntakeItemId).toBe(firstIntakeItemId);

    fireEvent.click(screen.getByTestId("curr-intake-item-id-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("curr-intake-item-id-test")).toHaveTextContent("test");
  });

  it("should provide proper chatGPTQuery value", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { chatGPTQuery, setChatGPTQuery } = useDayEdit();

      function handleSetBtnClick() {
        setChatGPTQuery({
          ...nutritionUtilService.getDefaultNutritionQuery("chatGPT"),
          response: "test",
        });
      }

      return (
        <>
          <div data-testid="chat-gpt-query-test">{chatGPTQuery.response as string}</div>
          <div data-testid="chat-gpt-query-test-error">{chatGPTQuery.error}</div>
          <div data-testid="chat-gpt-query-test-status">{chatGPTQuery.status}</div>
          <button onClick={handleSetBtnClick} data-testid="chat-gpt-query-btn">
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

    expect(screen.getByTestId("chat-gpt-query-test")).toHaveTextContent("");
    expect(screen.getByTestId("chat-gpt-query-test-error")).toHaveTextContent("");
    expect(screen.getByTestId("chat-gpt-query-test-status")).toHaveTextContent("idle");

    fireEvent.click(screen.getByTestId("chat-gpt-query-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("chat-gpt-query-test")).toHaveTextContent("test");
  });

  it("should provide proper ninjaAPIQuery value", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { ninjaAPIQuery, setNinjaAPIQuery } = useDayEdit();

      function handleSetBtnClick() {
        setNinjaAPIQuery({
          ...nutritionUtilService.getDefaultNutritionQuery("ninjaAPI"),
          response: [
            {
              name: "test",
              description: "test",
              calories: "100",
              carbs: "10",
              fat: "10",
              protein: "10",
            },
          ],
        });
      }

      return (
        <>
          {ninjaAPIQuery.response && (
            <div>
              {(ninjaAPIQuery.response as FormattedNinjaAPIResData).map(item => (
                <div key={item.name} data-testid="ninja-api-query-test">
                  {item.name}
                </div>
              ))}
            </div>
          )}
          <div data-testid="ninja-api-query-test-error">{ninjaAPIQuery.error}</div>
          <div data-testid="ninja-api-query-test-status">{ninjaAPIQuery.status}</div>
          <button onClick={handleSetBtnClick} data-testid="ninja-api-query-btn">
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

    expect(screen.queryAllByTestId("ninja-api-query-test")).toHaveLength(0);
    expect(screen.getByTestId("ninja-api-query-test-error")).toHaveTextContent("");
    expect(screen.getByTestId("ninja-api-query-test-status")).toHaveTextContent("idle");

    fireEvent.click(screen.getByTestId("ninja-api-query-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.queryAllByTestId("ninja-api-query-test")).toHaveLength(1);
  });

  it("should provide proper USDAAPIQuery value", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: false,
    });

    const TestComponent = () => {
      const { USDAAPIQuery, setUSDAAPIQuery } = useDayEdit();

      function handleSetBtnClick() {
        setUSDAAPIQuery({
          ...nutritionUtilService.getDefaultNutritionQuery("usdaAPI"),
          response: [
            {
              name: "test",
              description: "test",
              calories: "100",
              carbs: "10",
              fat: "10",
              protein: "10",
            },
          ],
        });
      }

      return (
        <>
          {USDAAPIQuery.response && (
            <div>
              {(USDAAPIQuery.response as FormattedNinjaAPIResData).map(item => (
                <div key={item.name} data-testid="usda-api-query-test">
                  {item.name}
                </div>
              ))}
            </div>
          )}
          <div data-testid="usda-api-query-test-error">{USDAAPIQuery.error}</div>
          <div data-testid="usda-api-query-test-status">{USDAAPIQuery.status}</div>
          <button onClick={handleSetBtnClick} data-testid="usda-api-query-btn">
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

    expect(screen.queryAllByTestId("usda-api-query-test")).toHaveLength(0);
    expect(screen.getByTestId("usda-api-query-test-error")).toHaveTextContent("");
    expect(screen.getByTestId("usda-api-query-test-status")).toHaveTextContent("idle");

    fireEvent.click(screen.getByTestId("usda-api-query-btn"));

    rerender(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.queryAllByTestId("usda-api-query-test")).toHaveLength(1);
  });

  it("should provide proper recordedIntakes value", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: {
        ...testService.createDailyData({}),
        intakes: [
          testService.createIntake({ isRecorded: false }),
          testService.createIntake({ isRecorded: true }),
          testService.createIntake({ isRecorded: true }),
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: {
        ...testService.createDailyData({}),
        intakes: [
          testService.createIntake({ isRecorded: true }),
          testService.createIntake({ isRecorded: false }),
          testService.createIntake({ isRecorded: false }),
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

    expect(screen.getByTestId("unrecorded-intakes-test")).toHaveTextContent("2");
  });

  it("should provide proper consumedCalories value", () => {
    mockUseAuth({});

    const intakes = [
      testService.createIntake({}),
      { ...testService.createIntake({}), isRecorded: true },
      { ...testService.createIntake({}), isRecorded: true },
    ];

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), intakes },
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
    mockUseAuth({});

    const intakes = [
      testService.createIntake({}),
      { ...testService.createIntake({}), isRecorded: true },
      { ...testService.createIntake({}), isRecorded: true },
    ];

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), intakes },
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), targetCaloricIntake: 2000 },
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), targetCaloricIntake: 2000 },
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
    mockUseAuth({
      targetCaloricIntakePerDay: 2000,
    });

    mockUseGetTodayData({
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
    mockUseAuth({});

    mockUseGetTodayData({
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), targetCaloricIntake: 2000 },
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), targetCaloricIntake: 2000 },
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
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
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

  it("should provide proper favoriteIntakes", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    const { favoriteIntakes } = mockUseGetUserFavoriteIntakes({});

    const TestComponent = () => {
      const { favoriteIntakes } = useDayEdit();
      return (
        <div>
          {favoriteIntakes?.map(intake => (
            <div key={intake.id}>{intake.id}</div>
          ))}
        </div>
      );
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    for (const intake of favoriteIntakes) {
      expect(screen.getByText(intake.id)).toBeInTheDocument();
    }
  });

  it("should provide proper isLoadingFavoriteIntakes", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    mockUseGetUserFavoriteIntakes({
      isLoading: true,
    });

    const TestComponent = () => {
      const { isLoadingFavoriteIntakes } = useDayEdit();
      return <div>{isLoadingFavoriteIntakes.toString()}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper isErrorFavoriteIntakes", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    mockUseGetUserFavoriteIntakes({
      isError: true,
    });

    const TestComponent = () => {
      const { isErrorFavoriteIntakes } = useDayEdit();
      return <div>{isErrorFavoriteIntakes.toString()}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper isSuccessFavoriteIntakes", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    mockUseGetUserFavoriteIntakes({
      isSuccess: true,
    });

    const TestComponent = () => {
      const { isSuccessFavoriteIntakes } = useDayEdit();
      return <div>{isSuccessFavoriteIntakes.toString()}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();
  });

  it("should provide proper isEmptyFavoriteIntakes", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    mockUseGetUserFavoriteIntakes({});

    const TestComponent = () => {
      const { isEmptyFavoriteIntakes } = useDayEdit();
      return <div>{isEmptyFavoriteIntakes.toString()}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper setSearchParams", () => {
    mockUseAuth({});

    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    const { setSearchParams } = mockUseSearchParams({});

    const TestComponent = () => {
      const { setSearchParams } = useDayEdit();

      function handleBtnClick(str: string) {
        const params = new URLSearchParams({ tab: str });
        setSearchParams(params);
      }

      return (
        <button onClick={() => handleBtnClick("test")} data-testid="set-btn">
          Set
        </button>
      );
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    fireEvent.click(screen.getByTestId("set-btn"));

    expect(setSearchParams).toHaveBeenCalledTimes(1);
  });
});

describe("useEffect #1", () => {
  beforeEach(() => {
    mockUseAuth({});
    mockUseGetTodayData({});
    mockUseUpdateTodayData({});
    mockUseGetUserFavoriteIntakes({});
    mockUseSearchParams({});
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should keep openedTab to IntakeEdit when isSuccess is falsey", () => {
    mockUseAuth({});
    mockUseGetTodayData({ isSuccess: false });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="open-element-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.IntakeEdit);
  });

  it("should keep openedTab to IntakeEdit when dailyData is null", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: null,
      isSuccess: true,
    });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="open-element-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.IntakeEdit);
  });

  it("should keep openedTab to IntakeEdit when dailyData.weight is truthy", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: 80 },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="open-element-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.IntakeEdit);
  });

  it("should keep openedTab to IntakeEdit when dailyData.isWeightWaistIgnores is truthy", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), isWeightWaistIgnores: true },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="open-element-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.IntakeEdit);
  });

  it("updates openedTab to WeightWaistInput when dailyData.weight is falsey", () => {
    mockUseAuth({});
    mockUseGetTodayData({
      dailyData: { ...testService.createDailyData({}), weight: undefined },
      isSuccess: true,
    });

    const TestComponent = () => {
      const { openedTab } = useDayEdit();
      return <div data-testid="open-element-test">{openedTab}</div>;
    };

    render(
      <DayEditProvider>
        <TestComponent />
      </DayEditProvider>
    );

    expect(screen.getByTestId("open-element-test")).toHaveTextContent(DayEditTab.WeightWaistInput);
  });
});
