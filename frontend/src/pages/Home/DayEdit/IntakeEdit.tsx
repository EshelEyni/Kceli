import { useRef } from "react";
import { t } from "../../../i18n";
import toast from "react-hot-toast";
import intakeUtilService from "../../../services/intake/intakeUtilService";
import { useDayEdit } from "./DayEditContext";
import { IntakeItemEditProvider } from "./IntakeItemEditContext";
import { IntakeItemEdit } from "./IntakeItemEdit";
import { SpinnerLoader } from "../../../components/Loaders/SpinnerLoader/SpinnerLoader";
import { FoodScanner } from "./FoodScanner";
import "./IntakeEdit.scss";

export const IntakeEdit = () => {
  const { dailyData, isLoading, isLoadingUpdate, intake, setIntake, updateDailyData } =
    useDayEdit();
  const fields = useRef<HTMLDivElement>(null);

  function openManual() {
    requestAnimationFrame(() =>
      fields.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus()
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!dailyData || isLoading || isLoadingUpdate) return;
    const valid =
      intake.items.length > 0 &&
      intake.items.every(
        item =>
          item.name.trim() &&
          item.quantity > 0 &&
          typeof item.calories === "number" &&
          Number.isFinite(item.calories) &&
          item.calories >= 0
      );
    if (!valid) return toast.error(t("Enter a food name and calories."));
    const savedIntake = {
      ...intake,
      recordedAt: intake.isRecorded && !intake.recordedAt ? new Date() : intake.recordedAt,
    };
    const exists = dailyData.intakes.some(item => item.id === intake.id);
    const intakes = exists
      ? dailyData.intakes.map(item => (item.id === intake.id ? savedIntake : item))
      : [...dailyData.intakes, savedIntake];
    updateDailyData(
      { id: dailyData.id, data: { intakes } },
      {
        onSuccess: () => {
          setIntake(intakeUtilService.getDefaultIntake());
        },
      }
    );
  }

  return (
    <section className="intake-edit" data-testid="intake-edit">
      <FoodScanner onManualEntry={openManual} />
      <form className="intake-edit__manual-form" onSubmit={handleSubmit}>
        <div ref={fields}>
          {intake.items.map(item => (
            <IntakeItemEditProvider key={item.id} intakeItem={item}>
              <IntakeItemEdit />
            </IntakeItemEditProvider>
          ))}
        </div>
        <button type="submit" className="btn" disabled={isLoading || isLoadingUpdate}>
          {t("Save Intake")}
        </button>
        {(isLoading || isLoadingUpdate) && (
          <SpinnerLoader containerSize={{ height: "40px", width: "100%" }} />
        )}
      </form>
    </section>
  );
};
