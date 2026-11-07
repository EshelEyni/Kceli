import { FiCheck, FiInfo, FiMinus } from "react-icons/fi";
import { getLocale, t } from "../../../i18n";
import { getCalorieBudget } from "./calorieBudgetModel";
import "./CalorieBudget.scss";

export function CalorieBudget({ consumed, target }: { consumed: number; target: number }) {
  const { state, percentage, remaining, eaten } = getCalorieBudget(consumed, target);
  const format = (value: number) => value.toLocaleString(getLocale(), { maximumFractionDigits: 2 });
  const message =
    remaining === null
      ? t("Set a daily calorie target to see your remaining budget.")
      : remaining < 0
      ? t("{{count}} calories above the daily target", { count: format(-remaining) })
      : remaining === 0
      ? t("You’ve reached your daily calorie target")
      : state === "yellow"
      ? t("Approaching the daily target — {{count}} calories remaining", {
          count: format(remaining),
        })
      : t("{{count}} calories remaining for this day", { count: format(remaining) });
  const Icon = state === "green" ? FiCheck : state === "unavailable" ? FiMinus : FiInfo;
  return (
    <div className={"calorie-budget calorie-budget--" + state}>
      <div
        className="calorie-budget__ring"
        role={remaining === null ? "img" : "progressbar"}
        aria-label={t("Daily calorie budget")}
        aria-valuemin={remaining === null ? undefined : 0}
        aria-valuemax={remaining === null ? undefined : target}
        aria-valuenow={remaining === null ? undefined : Math.min(eaten, target)}
        aria-valuetext={message}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="calorie-budget__track" cx="60" cy="60" r="54" />
          <circle
            className="calorie-budget__fill"
            cx="60"
            cy="60"
            r="54"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
          />
        </svg>
        <div aria-hidden="true">
          <strong>{remaining === null ? "—" : format(Math.abs(remaining))}</strong>
          <small>
            {remaining === null
              ? t("No daily target")
              : t("kcal") + " " + t(remaining < 0 ? "above target" : "remaining")}
          </small>
        </div>
      </div>
      <p className="calorie-budget__status" role="status" aria-live="polite" aria-atomic="true">
        <Icon aria-hidden="true" />
        <span>{message}</span>
      </p>
    </div>
  );
}
