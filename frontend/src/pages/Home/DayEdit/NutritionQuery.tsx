import { t } from "../../../i18n";
import { FC, useRef, useState } from "react";
import { RiOpenaiFill, RiArrowRightUpLine } from "react-icons/ri";
import nutritionApiService from "../../../services/nutrition/nutritionApiService";
import { useDayEdit } from "./DayEditContext";
import { NutritionQueryResponseHandler } from "./NutritionQueryResponseHandler";
import "./NutritionQuery.scss";

export const NutritionQuery: FC = () => {
  const { chatGPTQuery, setChatGPTQuery } = useDayEdit();
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pending = useRef(false);
  const isLoading = chatGPTQuery.status === "loading";
  const suggestions = ["Estimate the nutrition in my meal", "Suggest a high-protein lunch", "Help me plan a balanced day"];

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const query = prompt.trim();
    if (!query || isLoading || pending.current) return;
    pending.current = true;
    setChatGPTQuery({ ...chatGPTQuery, status: "loading", error: null, response: null });
    try {
      const response = await nutritionApiService.queryChatGPT(query);
      setChatGPTQuery({ ...chatGPTQuery, status: "success", error: null, response });
    } catch (error) {
      setChatGPTQuery({ ...chatGPTQuery, status: "error", response: null,
        error: error instanceof Error ? error.message : t("Something went wrong. Please try again.") });
    } finally {
      pending.current = false;
    }
  }

  return (
    <section className="nutrition-query" data-testid="nutrition-query">
      <header className="nutrition-query__intro">
        <span className="nutrition-query__badge"><RiOpenaiFill aria-hidden="true" /> {t("Powered by OpenAI")}</span>
        <h2>{t("A little guidance for your next meal.")}</h2>
        <p>{t("Explore meal ideas, nutrition estimates, and everyday food questions.")}</p>
      </header>
      <form className="nutrition-query__form" onSubmit={onSubmit} data-testid="nutrition-query-form">
        <label htmlFor="chatGPTQuery">{t("What would you like to know?")}</label>
        <textarea ref={inputRef} id="chatGPTQuery" value={prompt} onChange={event => setPrompt(event.target.value)}
          placeholder={t("Describe a meal, include portions, or ask a nutrition question…")}
          rows={5} dir="auto" disabled={isLoading} aria-describedby="nutrition-query-hint" />
        <div className="nutrition-query__footer">
          <p id="nutrition-query-hint">{t("Add ingredients and portions for a more useful answer.")}</p>
          <button className="nutrition-query__submit" type="submit" disabled={isLoading || !prompt.trim()}>
            {t(isLoading ? "Thinking…" : "Ask OpenAI")} <RiArrowRightUpLine aria-hidden="true" />
          </button>
        </div>
      </form>
      <div className="nutrition-query__suggestions" aria-label={t("Suggested questions")}>
        {suggestions.map(suggestion => <button type="button" key={suggestion} disabled={isLoading}
          onClick={() => { setPrompt(t(suggestion)); inputRef.current?.focus(); }}>{t(suggestion)}</button>)}
      </div>
      {chatGPTQuery.status !== "idle" && (
        <section className="nutrition-query__answer" aria-live="polite" aria-busy={isLoading}>
          <h3><RiOpenaiFill aria-hidden="true" /> {t(isLoading ? "Putting your answer together" : "Your answer")}</h3>
          <NutritionQueryResponseHandler queryState={chatGPTQuery} />
        </section>
      )}
    </section>
  );
};
