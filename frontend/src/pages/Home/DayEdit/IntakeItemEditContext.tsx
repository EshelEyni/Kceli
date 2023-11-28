import { createContext, useContext, useState, useRef, useEffect } from "react";
import NSpell from "nspell";
import { SpellingSuggestion } from "../../../types/app";
import { useDayEdit } from "./DayEditContext";
import { NewIntakeItem } from "../../../../../shared/types/intake";
import { AnyFunction } from "../../../../../shared/types/system";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import calorieApiService from "../../../services/calorieApi/calorieApiService";
import { debounce } from "../../../services/util/utilService";
import { toast } from "react-hot-toast";

export type IntakeItemEditContextType = {
  intakeItem: NewIntakeItem;
  isOneItem: boolean;
  isCurrIntakeItem: boolean;
  isManual: boolean;
  inputFaded: string;
  setInputFaded: React.Dispatch<React.SetStateAction<string>>;
  isLoadingCal: boolean;
  suggestions: SpellingSuggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<SpellingSuggestion[]>>;
  isSuggestionListShown: boolean;
  handleNameInputClick: (currIntakeItemId: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
  handleUnitBtnClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  handleToggleManual: () => void;
  handleCalcBtnClick: () => void;
  handleSuggestionClick: (original: string, suggestion: string) => void;
  handleIgnoreSuggestionClick: (original: string) => void;
  handleAddButtonClick: () => void;
  handleRemoveButtonClick: () => void;
  btnStyle: React.CSSProperties;
};

type IntakeItemEditProviderProps = {
  intakeItem: NewIntakeItem;
  children: React.ReactNode;
};

const IntakeItemEditContext = createContext<IntakeItemEditContextType | undefined>(undefined);

function IntakeItemEditProvider({ intakeItem, children }: IntakeItemEditProviderProps) {
  const { intake, setIntake, currIntakeItemId, setCurrIntakeItemId, btnStyle } = useDayEdit();
  const isOneItem = intake.items.length === 1;
  const isCurrIntakeItem = intakeItem.id === currIntakeItemId;
  const [isManual, setIsManual] = useState(false);
  const [inputFaded, setInputFaded] = useState("");
  const [isLoadingCal, setIsLoadingCal] = useState(false);
  const [suggestions, setSuggestions] = useState<SpellingSuggestion[]>([]);
  const [spellChecker, setSpellChecker] = useState<NSpell | null>(null);
  const debouncedSpellcheck = useRef<AnyFunction | null>(null);
  const isSuggestionListShown =
    suggestions.length > 0 &&
    suggestions[0].suggestions.length > 0 &&
    !!intakeItem.name.length &&
    !!spellChecker;

  function handleNameInputClick(itemId: string) {
    if (itemId === currIntakeItemId) return;
    setCurrIntakeItemId(itemId);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value, name } = e.target;

    switch (name) {
      case "name":
        handleChange({ ...intakeItem, name: value });
        if (!value.length) setSuggestions([]);
        if (!debouncedSpellcheck.current) return;
        debouncedSpellcheck.current(value);
        break;
      case "quantity": {
        const item = { ...intakeItem, quantity: Number(value) };
        if (item.caloriesPer100g) item.calories = item.caloriesPer100g * (item.quantity / 100);
        handleChange(item);
        break;
      }
      case "calories": {
        const item = { ...intakeItem, calories: Number(value) };
        delete item.caloriesPer100g;
        handleChange(item);
        setInputFaded("caloriesPer100g");
        break;
      }
      case "caloriesPer100g": {
        const caloriesPer100g = Number(value);
        const calories = caloriesPer100g * (intakeItem.quantity / 100);
        handleChange({ ...intakeItem, caloriesPer100g: Number(value), calories });
        setInputFaded("calories");
        break;
      }
      default:
        break;
    }
  }

  function handleChange(intakeItem: NewIntakeItem) {
    setIntake(prev => ({
      ...prev,
      items: prev.items.map(item => (item.id === intakeItem.id ? intakeItem : item)),
    }));
  }

  function decreaseQuantity() {
    const step = intakeUtilService.getQuantityStepPerUnit(intakeItem.unit);
    if (intakeItem.quantity - step < 1) return;
    const item = { ...intakeItem, quantity: intakeItem.quantity - step };
    if (item.caloriesPer100g) item.calories = item.caloriesPer100g * (item.quantity / 100);
    handleChange(item);
  }

  function increaseQuantity() {
    const step = intakeUtilService.getQuantityStepPerUnit(intakeItem.unit);
    const item = { ...intakeItem, quantity: intakeItem.quantity + step };
    if (item.caloriesPer100g) item.calories = item.caloriesPer100g * (item.quantity / 100);
    handleChange(item);
  }

  function handleUnitBtnClick() {
    const currentUnitIdx = intakeUtilService.units.indexOf(intakeItem.unit);
    const unit =
      currentUnitIdx === intakeUtilService.units.length - 1
        ? intakeUtilService.units[0]
        : intakeUtilService.units[currentUnitIdx + 1];

    const quantity = intakeUtilService.getUnitDefaultQuantity(unit);
    handleChange({ ...intakeItem, unit, quantity });
  }

  function handleToggleManual() {
    const item = { ...intakeItem };
    if (isManual) delete item.calories, delete item.caloriesPer100g, setInputFaded("");
    setIsManual(prev => !prev);
    handleChange(item);
  }

  async function handleCalcBtnClick() {
    if (!intakeItem.name.length) return toast.error("Please enter a food name!");
    try {
      setIsLoadingCal(true);
      const calories = await calorieApiService.getCaloriesForItem(intakeItem);
      handleChange({ ...intakeItem, calories });
      setIsManual(true);
    } catch (error) {
      const isTestEnv = process.env.NODE_ENV === "test";
      if (!isTestEnv) console.error(error);
      toast.error("Failed to calculate calories!");
    } finally {
      setIsLoadingCal(false);
    }
  }

  function handleSuggestionClick(original: string, suggestion: string) {
    const name = intakeItem.name.replace(original, suggestion);
    const filteredSuggestions = suggestions.filter(s => s.original !== original);
    setSuggestions(filteredSuggestions);
    handleChange({ ...intakeItem, name });
  }

  function handleIgnoreSuggestionClick(original: string) {
    const filteredSuggestions = suggestions.filter(s => s.original !== original);
    setSuggestions(filteredSuggestions);
  }

  function handleAddButtonClick() {
    const newIntakeItem = intakeUtilService.getDefaultIntakeItem();
    setIntake(prev => ({ ...prev, items: [...prev.items, newIntakeItem] }));
    setCurrIntakeItemId(newIntakeItem.id);
  }

  function handleRemoveButtonClick() {
    if (intake.items.length === 1) return;
    const currIntakeItemIdx = intake.items.findIndex(i => i.id === intakeItem.id);
    const prevIntakeItemId = intake.items[currIntakeItemIdx - 1]?.id;
    const nextIntakeItemId = intake.items[currIntakeItemIdx + 1]?.id;
    const items = [...intake.items];
    items.splice(currIntakeItemIdx, 1);
    setIntake(prev => ({ ...prev, items }));
    setCurrIntakeItemId(nextIntakeItemId || prevIntakeItemId);
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "test") return setSpellChecker(new NSpell("", ""));
    Promise.all([
      fetch("/assets/dictionaries/en_US.aff").then(res => res.text()),
      fetch("/assets/dictionaries/en_US.dic").then(res => res.text()),
    ])
      .then(([affData, dicData]) => {
        const nspellInstance = new NSpell(affData, dicData);
        setSpellChecker(nspellInstance);
      })
      .catch(error => {
        console.error("Failed to load dictionaries:", error);
      });
  }, []);

  useEffect(() => {
    function spellCheck(text: string) {
      if (!spellChecker) return;
      const filteredWordSet = new Set(["nes", "ness"]);
      const words = text.split(" ");
      const filteredWords = words.filter(word => !filteredWordSet.has(word) && word.length > 3);
      const suggestions = filteredWords.map(word => ({
        original: word,
        suggestions: spellChecker.suggest(word),
      }));
      setSuggestions(suggestions);
    }

    debouncedSpellcheck.current = debounce(spellCheck, 1000).debouncedFunc;
  }, [spellChecker]);

  const value = {
    intakeItem,
    isOneItem,
    isCurrIntakeItem,
    isManual,
    inputFaded,
    setInputFaded,
    isLoadingCal,
    suggestions,
    setSuggestions, // for testing purposes
    isSuggestionListShown,
    handleNameInputClick,
    handleInputChange,
    decreaseQuantity,
    increaseQuantity,
    handleUnitBtnClick,
    handleToggleManual,
    handleCalcBtnClick,
    handleSuggestionClick,
    handleIgnoreSuggestionClick,
    handleAddButtonClick,
    handleRemoveButtonClick,
    btnStyle,
  };

  return <IntakeItemEditContext.Provider value={value}>{children}</IntakeItemEditContext.Provider>;
}

function useIntakeItemEdit() {
  const context = useContext(IntakeItemEditContext);
  if (!context) {
    throw new Error("useIntakeItemEdit must be used within an IntakeItemEditProvider");
  }
  return context;
}

export { IntakeItemEditProvider, useIntakeItemEdit };

// Path: src/pages/Home/DayEdit/IntakeItemEditBtns.tsx
