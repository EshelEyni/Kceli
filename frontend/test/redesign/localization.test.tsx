import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, configure, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import auth from "../../src/store/slices/authSlice";
import system from "../../src/store/slices/systemSlice";
import App from "../../src/App";
import i18n, { getLocale } from "../../src/i18n";
import validation from "../../src/services/reactHookForm/reactHookFormService";
import { installReviewApi } from "./mockApi";
import en from "../../public/locales/en/translation.json";
import he from "../../public/locales/he/translation.json";

vi.mock("nspell", () => ({
  default: class {
    suggest() {
      return [];
    }
  },
}));

let api: ReturnType<typeof installReviewApi>;
configure({ asyncUtilTimeout: 5000 });
let client: QueryClient;
beforeEach(async () => {
  await i18n.changeLanguage("en");
  api = installReviewApi();
  client = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
  vi.stubGlobal("scrollTo", vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(async () => {
  cleanup();
  client.clear();
  api.mock.restore();
  await i18n.changeLanguage("en");
  vi.unstubAllGlobals();
});
function mount(path: string) {
  const store = configureStore({
    reducer: { auth, system },
    preloadedState: { auth: { loggedInUser: api.fixtures.user } },
  });
  render(
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
}

describe("Hebrew localization", () => {
  it("switches a live page without losing the meal draft, persists preference and restores English", async () => {
    mount("/home");
    await screen.findByRole("heading", { name: "Good to see you, Alex." });
    fireEvent.click(screen.getByRole("button", { name: "Log meal", exact: true }));
    const nameInput = await screen.findByLabelText("Food or drink name");
    fireEvent.change(nameInput, { target: { value: "סלט ישראלי" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Interface language" }), {
      target: { value: "he" },
    });
    await screen.findByRole("heading", { name: "טוב לראות אותך, Alex." });
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(document.documentElement).toHaveAttribute("lang", "he");
    expect(screen.getByLabelText("שם המזון או המשקה")).toHaveValue("סלט ישראלי");
    expect(localStorage.getItem("i18nextLng")).toBe("he");
    expect(document.cookie).toContain("i18next=he");
    expect(getLocale()).toBe("he-IL");
    expect(screen.getByRole("navigation", { name: "ניווט ראשי" })).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "שפת הממשק" }), {
      target: { value: "en" },
    });
    await screen.findByRole("heading", { name: "Good to see you, Alex." });
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(screen.getByLabelText("Food or drink name")).toHaveValue("סלט ישראלי");
  });

  it("localizes workout filters while keeping the removed weekly planner absent", async () => {
    await i18n.changeLanguage("he");
    mount("/workouts");
    await screen.findByRole("heading", { name: "המקום שלך להתחזק." });
    fireEvent.click(screen.getByRole("button", { name: "אירובי", exact: true }));
    expect(screen.getByRole("heading", { name: "Easy outdoor run" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Full body strength" })).not.toBeInTheDocument();
    expect(screen.queryByText("הקצב השבועי שלך")).not.toBeInTheDocument();
    expect(api.mock.history.patch).toHaveLength(0);
  });

  it("allows Hebrew full names and produces Hebrew validation messages", async () => {
    await i18n.changeLanguage("he");
    expect(validation.lettersAndNumberPatternWithSpace.value.test("אריק ישראלי")).toBe(true);
    expect(validation.createRequiredValidationMsg("fullname")).toBe("יש להזין שם מלא");
    expect(validation.createMinLengthValidation(3).message).toBe("נדרשים לפחות 3 תווים");
    expect(Object.keys(he).sort()).toEqual(Object.keys(en).sort());
    for (const [key, value] of Object.entries(en)) {
      expect((he as Record<string, string>)[key].match(/{{.*?}}/g)?.sort() || []).toEqual(
        value.match(/{{.*?}}/g)?.sort() || []
      );
    }
  });

  it("translates signup labels while retaining form field IDs and gender values", async () => {
    await i18n.changeLanguage("he");
    mount("/signup");
    await screen.findByRole("heading", { name: "הרשמה" });
    expect(document.querySelector('input[name="fullname"]')).toHaveAttribute("id", "fullname");
    expect(screen.getByRole("radio", { name: "זכר" })).toHaveAttribute("value", "male");
    expect(screen.getByRole("radio", { name: "נקבה" })).toHaveAttribute("value", "female");
  });
});
