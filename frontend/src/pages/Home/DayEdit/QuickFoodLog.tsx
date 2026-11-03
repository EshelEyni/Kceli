import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { t } from "../../../i18n";
import { estimateMeal } from "../../../services/nutrition/foodEstimateApi";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { DayEditTab, useDayEdit } from "./DayEditContext";
import "./QuickFoodLog.scss";

export function QuickFoodLog() {
  const { dailyData, updateDailyData, isLoadingUpdate, setOpenedTab, setSearchParams } = useDayEdit();
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const request = useRef<AbortController | null>(null);
  const saving = useRef(false);
  const calorieInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const mealId = useRef(intakeUtilService.getDefaultIntake().id);
  const locked = busy || isLoadingUpdate;
  const valid = calories.trim() !== "" && Number.isInteger(Number(calories)) && Number(calories) >= 0 && Number(calories) <= 20000;
  useEffect(() => () => request.current?.abort(), []);

  async function estimate(event: FormEvent) {
    event.preventDefault();
    if (request.current || saving.current || !description.trim()) return;
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 35000);
    setBusy(true); setError(""); setSaved(false);
    try {
      const result = await estimateMeal(description, controller.signal);
      if (controller.signal.aborted) return;
      setCalories(String(result.calories)); setAssumptions(result.assumptions); setReview(true);
    } catch (err) {
      setError(controller.signal.aborted ? t("Calorie estimation timed out. Try again or enter calories.") :
        t(err instanceof Error ? err.message : "Could not estimate calories. Try again or enter calories."));
    } finally { window.clearTimeout(timeout); request.current = null; setBusy(false); }
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!dailyData || !valid || !description.trim() || locked || saving.current) return;
    saving.current = true; setError("");
    const meal = intakeUtilService.getDefaultIntake();
    meal.id = mealId.current; meal.recordedAt = new Date();
    meal.items = [{ ...meal.items[0], name: description.trim(), calories: Number(calories) }];
    // Keep a stable id across retries; retain all existing records unchanged.
    const intakes = [...dailyData.intakes.filter(i => i.id !== meal.id), meal];
    updateDailyData({ id: dailyData.id, data: { intakes } }, {
      onSuccess: () => {
        setDescription(""); setCalories(""); setAssumptions(""); setReview(false); setSaved(true);
        mealId.current = intakeUtilService.getDefaultIntake().id;
        toast.success(t("Meal saved"));
        descriptionInput.current?.focus();
      },
      onError: () => setError(t("Couldn't save your daily log. Please try again.")),
      onSettled: () => { saving.current = false; },
    });
  }
  function manual() {
    setReview(true); setAssumptions(""); setError("");
    window.setTimeout(() => calorieInput.current?.focus(), 0);
  }
  return <section className="quick-food-log" aria-labelledby="quick-food-title">
    <h2 id="quick-food-title">{t("What did you eat?")}</h2>
    <form onSubmit={review ? save : estimate} aria-busy={locked}>
      <label htmlFor="meal-description">{t("Describe your meal")}</label>
      <textarea id="meal-description" ref={descriptionInput} rows={2} dir="auto" maxLength={1000}
        placeholder={t("e.g. 2 eggs, a slice of toast and coffee with milk")}
        value={description} disabled={locked} required aria-describedby="quick-food-hint"
        onChange={e => { setDescription(e.target.value); setReview(false); setCalories(""); setAssumptions(""); setError(""); setSaved(false); }} />
      <p id="quick-food-hint">{t("Include portions if you can. You can adjust the estimate before saving.")}</p>
      {review && <div className="quick-food-log__review">
        <label htmlFor="meal-calories">{t("Calories")} ({t("kcal")})</label>
        <input id="meal-calories" ref={calorieInput} type="number" inputMode="numeric" min={0} max={20000} step={1}
          required value={calories} disabled={locked} onChange={e => setCalories(e.target.value)} />
        {assumptions && <div role="status"><p>{t("Estimated calories. Review portions and ingredients before saving.")}</p><p dir="auto">{assumptions}</p></div>}
      </div>}
      {error && <p role="alert">{error}</p>}
      {saved && <p role="status">{t("Meal saved")}</p>}
      {busy && <p role="status">{t("Estimating calories…")}</p>}
      <button className="quick-food-log__primary" type="submit" disabled={locked || !description.trim() || (review && !valid)}>
        {t(isLoadingUpdate ? "Saving…" : busy ? "Estimating calories…" : review ? "Save meal" : "Estimate calories")}
      </button>
      <div className="quick-food-log__alternatives">
        {!review && <button type="button" disabled={locked || !description.trim()} onClick={manual}>{t("Enter calories myself")}</button>}
        <button type="button" disabled={locked} onClick={() => {
          setOpenedTab(DayEditTab.IntakeEdit);
          setSearchParams(new URLSearchParams({ tab: DayEditTab.IntakeEdit }));
          window.setTimeout(() => document.getElementById("daily-tools")?.scrollIntoView({ block: "start", behavior: "smooth" }), 0);
        }}>{t("Detailed entry / photo")}</button>
      </div>
    </form>
  </section>;
}
