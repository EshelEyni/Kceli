import { it, describe, expect, afterEach, vi, Mock } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { mockUseDayEdit } from "../../../../test/service/mockService";
import { IntakeItemEditProvider, useIntakeItemEdit } from "./IntakeItemEditContext";
import { SpellingSuggestion } from "../../../types/app";
import { useDayEdit } from "./DayEditContext";
import NSpell from "nspell";
import { MeasurementUnit } from "../../../../../shared/types/intake";

vi.mock("./DayEditContext");
vi.mock("nspell");

describe("IntakeItemEditContext", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should provide proper intakeItem", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { intakeItem } = useIntakeItemEdit();
      return <div>{intakeItem.id}</div>;
    };
    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText(intake.id)).toBeInTheDocument();
  });

  it("should provide proper isOneItem", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { isOneItem } = useIntakeItemEdit();
      return <div>{isOneItem.toString()}</div>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();

    const intake2 = { ...intake };
    intake2.items.push({ ...intake.items[0] });
    intake2.items[1].id = "2";

    render(
      <IntakeItemEditProvider intakeItem={intake2}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper isCurrIntakeItem", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { isCurrIntakeItem } = useIntakeItemEdit();
      return <div>{isCurrIntakeItem.toString()}</div>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("true")).toBeInTheDocument();

    const { intake: intake2 } = mockUseDayEdit({ currIntakeItemId: "2" });
    const item2 = intake2.items[0];

    render(
      <IntakeItemEditProvider intakeItem={item2}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper isManual", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { isManual } = useIntakeItemEdit();
      return <div>{isManual.toString()}</div>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper inputFaded", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { inputFaded, setInputFaded } = useIntakeItemEdit();
      return (
        <>
          <div data-testid="input-faded">{inputFaded}</div>
          <button onClick={() => setInputFaded("test")}>setInputFaded</button>
        </>
      );
    };

    const { rerender } = render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByTestId("input-faded")).toHaveTextContent("");

    const btn = screen.getByText("setInputFaded");
    fireEvent.click(btn);

    rerender(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByTestId("input-faded")).toHaveTextContent("test");
  });

  it("should provide proper isLoadingCal", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { isLoadingCal } = useIntakeItemEdit();
      return <div>{isLoadingCal.toString()}</div>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper suggestions", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { suggestions } = useIntakeItemEdit();
      return (
        <ul>
          {suggestions.map((_: SpellingSuggestion, i: number) => (
            <li data-testid="suggestion" key={i}></li>
          ))}
        </ul>
      );
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    const suggestionEls = screen.queryAllByTestId("suggestion");
    expect(suggestionEls).toHaveLength(0);
  });

  it("should provide proper isSuggestionListShown", () => {
    const { intake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { isSuggestionListShown } = useIntakeItemEdit();
      return <div>{isSuggestionListShown.toString()}</div>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("should provide proper handleNameInputClick", () => {
    const { intake, setCurrIntakeItemId } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { currIntakeItemId } = useDayEdit();
      const { handleNameInputClick } = useIntakeItemEdit();

      return (
        <>
          <div>{currIntakeItemId}</div>
          <button data-testid="name-input1" onClick={() => handleNameInputClick("test1")}>
            name-input
          </button>
          <button data-testid="name-input2" onClick={() => handleNameInputClick("test2")}>
            name-input
          </button>
          <button data-testid="name-input3" onClick={() => handleNameInputClick("test3")}>
            name-input
          </button>
        </>
      );
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText(item.id)).toBeInTheDocument();

    const btn = screen.getByTestId("name-input1");
    fireEvent.click(btn);
    expect(setCurrIntakeItemId).toHaveBeenCalledWith("test1");

    fireEvent.click(screen.getByTestId("name-input2"));
    expect(setCurrIntakeItemId).toHaveBeenCalledWith("test2");

    fireEvent.click(screen.getByTestId("name-input3"));
    expect(setCurrIntakeItemId).toHaveBeenCalledWith("test3");
  });

  it("should provide proper handleInputChange for input name", () => {
    (NSpell as Mock).mockReturnValue(() => ({
      suggest: vi.fn().mockReturnValue(["suggestions1", "suggestion2"]),
    }));

    vi.useFakeTimers();
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { handleInputChange, suggestions } = useIntakeItemEdit();
      return (
        <>
          <input data-testid="name-input" name="name" onChange={handleInputChange} />
          <ul data-testid="suggestion-list">
            {suggestions.map((suggestion: SpellingSuggestion, i: number) => (
              <li data-testid="suggestion" key={i}>
                {suggestion.suggestions.map((s: string, i: number) => (
                  <span data-testid="suggestion-item" key={i}>
                    {s}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </>
      );
    };

    const { rerender } = render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    const nameInput = screen.getByTestId("name-input");

    fireEvent.change(nameInput, { target: { value: "testName" } });
    expect(nameInput).toHaveValue("testName");

    vi.advanceTimersByTime(2000);
    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");
    const res = setIntakeArg(intake);
    expect(res.items[0].name).toBe("testName");
    expect(screen.getByTestId("suggestion-list")).toBeInTheDocument();

    rerender(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    const suggestionEls = screen.queryAllByTestId("suggestion");
    expect(suggestionEls).toHaveLength(1);

    expect(screen.getByText("suggestions1")).toBeInTheDocument();
    expect(screen.getByText("suggestion2")).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "" } });

    rerender(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    const setIntakeArg2 = setIntake.mock.calls[1][0];
    expect(typeof setIntakeArg2).toBe("function");
    const res2 = setIntakeArg2(intake);
    expect(res2.items[0].name).toBe("");

    const suggestionEls2 = screen.queryAllByTestId("suggestion");
    expect(suggestionEls2).toHaveLength(0);

    vi.useRealTimers();
  });

  it("should provide proper handleInputChange", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { handleInputChange } = useIntakeItemEdit();
      return <input data-testid="quantity-input" name="quantity" onChange={handleInputChange} />;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    const quantityInput = screen.getByTestId("quantity-input");

    fireEvent.change(quantityInput, { target: { value: "1" } });
    expect(quantityInput).toHaveValue("1");
    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");
    const res = setIntakeArg(intake);
    expect(res.items[0].quantity).toBe(1);
  });

  it("should provide proper handleInputChange", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];
    item.caloriesPer100g = 100;

    const TestComponent = () => {
      const { handleInputChange, inputFaded } = useIntakeItemEdit();
      return (
        <>
          <div data-testid="input-faded">{inputFaded.toString()}</div>
          <input data-testid="calories-input" name="calories" onChange={handleInputChange} />;
        </>
      );
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByTestId("input-faded")).toHaveTextContent("");

    const caloriesInput = screen.getByTestId("calories-input");

    fireEvent.change(caloriesInput, { target: { value: "120" } });
    expect(caloriesInput).toHaveValue("120");
    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");

    const res = setIntakeArg(intake);

    expect(res.items[0].calories).toBe(120);
    expect(res.items[0].caloriesPer100g).toBeUndefined();

    expect(screen.getByTestId("input-faded")).toHaveTextContent("caloriesPer100g");
  });

  it("should provide proper handleInputChange", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = (intake.items[0] = {
      id: "test",
      name: "test",
      unit: MeasurementUnit.GRAM,
      quantity: 100,
    });

    const TestComponent = () => {
      const { handleInputChange, inputFaded } = useIntakeItemEdit();
      return (
        <>
          <div data-testid="input-faded">{inputFaded.toString()}</div>
          <input
            data-testid="calories-per-100g-input"
            name="caloriesPer100g"
            onChange={handleInputChange}
          />
          ;
        </>
      );
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByTestId("input-faded")).toHaveTextContent("");

    const caloriesPer100gInput = screen.getByTestId("calories-per-100g-input");

    fireEvent.change(caloriesPer100gInput, { target: { value: "500" } });
    expect(caloriesPer100gInput).toHaveValue("500");
    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");
    const res = setIntakeArg(intake);
    expect(res.items[0].caloriesPer100g).toBe(500);
    expect(res.items[0].calories).toBe(500);
    expect(screen.getByTestId("input-faded")).toHaveTextContent("calories");
  });

  it("should provide proper decreaseQuantity", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];
    item.quantity = 50;

    const TestComponent = () => {
      const { decreaseQuantity } = useIntakeItemEdit();
      return <button onClick={decreaseQuantity}>decreaseQuantity</button>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    fireEvent.click(screen.getByText("decreaseQuantity"));

    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");
    const res = setIntakeArg(intake);
    expect(res.items[0].quantity).toBe(25);
    item.quantity = 25;

    fireEvent.click(screen.getByText("decreaseQuantity"));
    expect(setIntake).toHaveBeenCalledTimes(1);
  });

  it("should provide proper increaseQuantity", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];
    item.quantity = 50;

    const TestComponent = () => {
      const { increaseQuantity } = useIntakeItemEdit();
      return <button onClick={increaseQuantity}>increaseQuantity</button>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    fireEvent.click(screen.getByText("increaseQuantity"));

    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");
    const res = setIntakeArg(intake);
    expect(res.items[0].quantity).toBe(75);
    item.quantity = 75;

    fireEvent.click(screen.getByText("increaseQuantity"));
    const setIntakeArg2 = setIntake.mock.calls[1][0];
    expect(typeof setIntakeArg2).toBe("function");
    const res2 = setIntakeArg2(intake);
    expect(res2.items[0].quantity).toBe(100);
    expect(setIntake).toHaveBeenCalledTimes(2);
  });

  it("should provide proper handleUnitBtnClick", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];
    item.unit = MeasurementUnit.UNIT;

    const measurementUnits = Object.values(MeasurementUnit);
    const TestComponent = () => {
      const { handleUnitBtnClick } = useIntakeItemEdit();
      return <div onClick={handleUnitBtnClick}>handleUnitBtnClick</div>;
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    for (let i = 0; i < measurementUnits.length; i++) {
      fireEvent.click(screen.getByText("handleUnitBtnClick"));
      const setIntakeArg = setIntake.mock.calls[i][0];
      expect(typeof setIntakeArg).toBe("function");
      const res = setIntakeArg(intake);
      const unit =
        i === measurementUnits.length - 1 ? measurementUnits[0] : measurementUnits[i + 1];
      expect(res.items[0].unit).toBe(unit);
      item.unit = unit;
    }
  });

  it("should provide proper handleToggleManual", () => {
    const { intake, setIntake } = mockUseDayEdit({});
    const item = intake.items[0];

    const TestComponent = () => {
      const { handleToggleManual, isManual } = useIntakeItemEdit();
      return (
        <>
          <div>{isManual.toString()}</div>
          <div onClick={handleToggleManual}>handleToggleManual</div>;
        </>
      );
    };

    render(
      <IntakeItemEditProvider intakeItem={item}>
        <TestComponent />
      </IntakeItemEditProvider>
    );

    expect(screen.getByText("false")).toBeInTheDocument();
    const btn = screen.getByText("handleToggleManual");
    fireEvent.click(btn);
    expect(screen.getByText("true")).toBeInTheDocument();

    const setIntakeArg = setIntake.mock.calls[0][0];
    expect(typeof setIntakeArg).toBe("function");
    const res = setIntakeArg(intake);
    expect(res.items[0].unit).toBe(MeasurementUnit.GRAM);
    expect(res.items[0].quantity).toBe(100);

    fireEvent.click(btn);
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(setIntake).toHaveBeenCalledTimes(2);

    const setIntakeArg2 = setIntake.mock.calls[1][0];
    expect(typeof setIntakeArg2).toBe("function");
    const res2 = setIntakeArg2(intake);
    expect(res2.items[0].caloriesPer100g).toBeUndefined();
    expect(res2.items[0].calories).toBeUndefined();
    expect(res2.items[0].unit).toBe(MeasurementUnit.GRAM);
    expect(res2.items[0].quantity).toBe(100);
  });
});
