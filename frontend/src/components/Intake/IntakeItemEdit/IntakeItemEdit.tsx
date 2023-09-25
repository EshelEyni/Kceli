import { FC, useState, useEffect, useRef } from "react";
import { MeasurementUnit, NewIntakeItem } from "../../../../../shared/types/intake";
import intakeUtilService from "../../../services/intakeUtil/intakeUtilService";
import "./IntakeItemEdit.scss";
import { Button } from "../../App/Button/Button";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";
import { useTodayData } from "../../../contexts/TodayDataContext";
import NSpell from "nspell";
import { debounce } from "../../../services/util/utilService";
import { AnyFunction } from "../../../../../shared/types/system";
import { SpellingSuggestion } from "../../../types/app";
import { SpellingSuggestionList } from "./SpellingSuggestionList";

type IntakeItemEditProps = {
  intakeItem: NewIntakeItem;
  idx: number;
  handleChange: (intakeItem: NewIntakeItem, idx: number) => void;
};

export const IntakeItemEdit: FC<IntakeItemEditProps> = ({ intakeItem, idx, handleChange }) => {
  const { isCurrValidIntake } = useTodayData();
  const [isInputNameEmpty, setIsInputNameEmpty] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [inputFaded, setInputFaded] = useState("");
  const [suggestions, setSuggestions] = useState<SpellingSuggestion[]>([]);
  const [spellchecker, setSpellchecker] = useState<NSpell | null>(null);
  const debouncedSpellcheck = useRef<AnyFunction | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value, name } = e.target;
    switch (name) {
      case "name":
        handleChange({ ...intakeItem, name: value }, idx);
        setIsInputNameEmpty(!value.length);
        if (!debouncedSpellcheck.current) return;
        debouncedSpellcheck.current(value);
        break;
      case "quantity":
        handleChange({ ...intakeItem, quantity: Number(value) }, idx);
        break;
      case "calories":
        handleChange({ ...intakeItem, calories: Number(value) }, idx);
        setInputFaded("caloriesPer100g");
        break;
      case "caloriesPer100g": {
        const caloriesPer100g = Number(value);
        const calories = caloriesPer100g * (intakeItem.quantity / 100);
        handleChange({ ...intakeItem, caloriesPer100g: Number(value), calories }, idx);
        setInputFaded("calories");
        break;
      }
      default:
        break;
    }
  }

  function decreaseQuantity() {
    const step = intakeUtilService.getQuantityStepPerUnit(intakeItem.unit);
    if (intakeItem.quantity - step < 1) return;
    handleChange({ ...intakeItem, quantity: intakeItem.quantity - step }, idx);
  }

  function increaseQuantity() {
    const step = intakeUtilService.getQuantityStepPerUnit(intakeItem.unit);
    handleChange({ ...intakeItem, quantity: intakeItem.quantity + step }, idx);
  }

  function handleUnitInputClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    if (isManual) return;
    const currentUnitIdx = intakeUtilService.units.indexOf(intakeItem.unit);
    const unit =
      currentUnitIdx === intakeUtilService.units.length - 1
        ? intakeUtilService.units[0]
        : intakeUtilService.units[currentUnitIdx + 1];

    const quantity = intakeUtilService.getUnitDefaultQuantity(unit);
    handleChange({ ...intakeItem, unit, quantity }, idx);
  }

  function handleToggleManual() {
    setIsManual(prev => !prev);
    if (intakeItem.unit == MeasurementUnit.GRAM && intakeItem.quantity === 100) return;
    handleChange({ ...intakeItem, unit: MeasurementUnit.GRAM, quantity: 100 }, idx);
  }

  function handleWaterButtonClick() {
    const { name, unit, quantity } = intakeItem;
    if (name === "water" && unit === MeasurementUnit.MILLILITER && quantity === 750) return;
    handleChange(
      { ...intakeItem, name: "water", unit: MeasurementUnit.MILLILITER, quantity: 750 },
      idx
    );
  }

  function handleSuggestionClick(original: string, suggestion: string) {
    const name = intakeItem.name.replace(original, suggestion);
    const filteredSuggestions = suggestions.filter(s => s.original !== original);
    setSuggestions(filteredSuggestions);
    handleChange({ ...intakeItem, name }, idx);
  }

  useEffect(() => {
    Promise.all([
      fetch("/assets/dictionaries/en_US.aff").then(res => res.text()),
      fetch("/assets/dictionaries/en_US.dic").then(res => res.text()),
    ])
      .then(([affData, dicData]) => {
        const nspellInstance = new NSpell(affData, dicData);
        setSpellchecker(nspellInstance);
      })
      .catch(error => {
        console.error("Failed to load dictionaries:", error);
      });
  }, []);

  useEffect(() => {
    function spellcheck(text: string) {
      if (!spellchecker) return;
      const words = text.split(" ");
      const suggestions = words.map(word => ({
        original: word,
        suggestions: spellchecker.suggest(word),
      }));
      setSuggestions(suggestions);
    }

    debouncedSpellcheck.current = debounce(spellcheck, 1000).debouncedFunc;
  }, [spellchecker]);

  return (
    <section className="intake-item-edit">
      <input
        type="text"
        name="name"
        className="intake-item-input"
        value={intakeItem.name}
        onChange={handleInputChange}
        spellCheck={true}
        autoComplete="off"
        placeholder="Enter food name"
      />
      <SpellingSuggestionList
        suggestions={suggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
      {(isInputNameEmpty || !isCurrValidIntake) && (
        <div onClick={() => setIsInputNameEmpty(false)}>
          <ErrorMsg msg="intake name cannot be empty!" />
        </div>
      )}

      <div className="intake-item-edit-inputs-container">
        <div className="quantity-input-container">
          <Button onClickFn={decreaseQuantity}>
            <AiFillMinusCircle />
          </Button>
          <input
            type="number"
            name="quantity"
            className="intake-item-input quantity-input"
            value={intakeItem.quantity}
            onChange={handleInputChange}
          />
          <Button onClickFn={increaseQuantity}>
            <AiFillPlusCircle />
          </Button>
        </div>

        <Button onClickFn={handleUnitInputClick} className="intake-item-edit__btn">
          <span>{intakeItem.unit}</span>
        </Button>

        <Button
          onClickFn={handleWaterButtonClick}
          className={"intake-item-edit__btn" + (intakeItem.name === "water" ? " active" : "")}
        >
          <span>water</span>
        </Button>
        <Button onClickFn={handleToggleManual} className="intake-item-edit__btn">
          <span>{isManual ? "Manual" : "Auto"}</span>
        </Button>
      </div>

      {isManual && (
        <div className="intake-item-edit__manuall-calorie-edit">
          <input
            type="number"
            name="calories"
            className={"intake-item-input" + (inputFaded === "calories" ? " faded" : "")}
            value={intakeItem.calories || ""}
            placeholder="Calories"
            onChange={handleInputChange}
            onClick={() => setInputFaded("")}
          />
          <input
            type="number"
            name="caloriesPer100g"
            className={"intake-item-input" + (inputFaded === "caloriesPer100g" ? " faded" : "")}
            value={intakeItem.caloriesPer100g || ""}
            placeholder="Calories per 100g"
            onChange={handleInputChange}
            onClick={() => setInputFaded("")}
          />
        </div>
      )}
    </section>
  );
};
