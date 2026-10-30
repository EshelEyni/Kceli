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
import { getGuestLanguage } from "../../src/services/language/guestLanguage";

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
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(async () => {
  cleanup();
  client.clear();
  api.mock.restore();
  await i18n.changeLanguage("en");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
function mount(path: string, loggedIn = true) {
  const store = configureStore({
    reducer: { auth, system },
    preloadedState: { auth: { loggedInUser: loggedIn ? api.fixtures.user : null } },
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
  return store;
}

describe("Hebrew localization", () => {
  it.each([
    ["Asia/Jerusalem", "he"],
    ["Europe/London", "en"],
  ])(
    "uses the %s visitor default before signup and saves it with the account",
    async (timeZone, language) => {
      const options = Intl.DateTimeFormat().resolvedOptions();
      vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
        ...options,
        timeZone,
      });
      api.mock.onPost(/auth\/login\/with-token$/).reply(401, { status: "fail" });
      api.mock.onPost(/auth\/signup$/).reply(config => {
        api.fixtures.user.language = JSON.parse(config.data).language;
        return [201, { status: "success", data: api.fixtures.user }];
      });
      const store = mount("/signup", false);
      await waitFor(() => expect(document.querySelector('input[name="username"]')).toBeInTheDocument());
      expect(document.documentElement).toHaveAttribute("lang", language);
      const fields = {
        username: "newuser",
        fullname: "אריק ישראלי",
        email: "alex@example.com",
        password: "123123123",
        passwordConfirm: "123123123",
        weight: "80",
        height: "175",
      };
      for (const [name, value] of Object.entries(fields)) {
        fireEvent.change(document.querySelector(`input[name="${name}"]`)!, { target: { value } });
      }
      fireEvent.click(document.querySelector('form button[type="submit"]')!);
      await waitFor(() =>
        expect(api.mock.history.post.some(request => request.url?.endsWith("auth/signup"))).toBe(
          true
        )
      );
      const request = api.mock.history.post.find(request => request.url?.endsWith("auth/signup"))!;
      expect(JSON.parse(request.data).language).toBe(language);
      await waitFor(() => expect(store.getState().auth.loggedInUser?.language).toBe(language));
    }
  );

  it("honors a saved English preference even with an Israeli browser time zone", async () => {
    const options = Intl.DateTimeFormat().resolvedOptions();
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
      ...options,
      timeZone: "Asia/Jerusalem",
    });
    api.fixtures.user.language = "en";
    mount("/home");
    await screen.findByRole("heading", { name: "Good to see you, Alex." });
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });

  it("falls back to English when the browser cannot provide its time zone", () => {
    vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockImplementation(() => {
      throw new Error("Unavailable");
    });
    expect(getGuestLanguage()).toBe("en");
  });

  it("saves language from the profile and reloads it from the saved user", async () => {
    const store = mount("/profile/review-user");
    await screen.findByRole("heading", { name: "Interface language" });
    expect(screen.queryByRole("combobox", { name: "Interface language" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit", exact: true }));
    const selector = await screen.findByRole("combobox", { name: "Interface language" });
    expect(selector.closest("form")).toHaveClass("user-edit-form");
    expect(document.querySelector(".ui-topbar select")).toBeNull();
    fireEvent.change(selector, { target: { value: "he" } });
    expect(api.mock.history.patch).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "update", exact: true }));
    await screen.findByRole("heading", { name: "שפת הממשק" });
    expect(api.mock.history.patch).toHaveLength(1);
    expect(JSON.parse(api.mock.history.patch[0].data)).toMatchObject({
      language: "he",
      fullname: "Alex Morgan",
    });
    expect(store.getState().auth.loggedInUser?.language).toBe("he");
    expect(api.fixtures.user.language).toBe("he");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(getLocale()).toBe("he-IL");
    cleanup();
    await i18n.changeLanguage("en");
    mount("/home", false);
    await screen.findByRole("heading", { name: "טוב לראות אותך, Alex." });
    expect(
      api.mock.history.post.some(request => request.url?.endsWith("auth/login/with-token"))
    ).toBe(true);
    expect(screen.queryByRole("combobox", { name: "שפת הממשק" })).not.toBeInTheDocument();
  });

  it("keeps the saved preference when saving fails", async () => {
    api.mock.onPatch(/user\/loggedInUser$/).reply(500, { status: "error" });
    const store = mount("/profile/review-user");
    fireEvent.click(await screen.findByRole("button", { name: "Edit", exact: true }));
    const selector = await screen.findByRole("combobox", { name: "Interface language" });
    fireEvent.change(selector, { target: { value: "he" } });
    fireEvent.click(screen.getByRole("button", { name: "update", exact: true }));
    await waitFor(() => expect(api.mock.history.patch).toHaveLength(1));
    await waitFor(() => expect(selector).not.toBeDisabled());
    expect(selector).toHaveValue("he");
    expect(store.getState().auth.loggedInUser?.language).not.toBe("he");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });

  it("discards an unsaved language change when profile editing is cancelled", async () => {
    mount("/profile/review-user");
    fireEvent.click(await screen.findByRole("button", { name: "Edit", exact: true }));
    fireEvent.change(screen.getByRole("combobox", { name: "Interface language" }), {
      target: { value: "he" },
    });
    fireEvent.click(screen.getByRole("button", { name: "cancel", exact: true }));
    await screen.findByRole("heading", { name: "Interface language" });
    expect(api.mock.history.patch).toHaveLength(0);
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    fireEvent.click(screen.getByRole("button", { name: "Edit", exact: true }));
    expect(screen.getByRole("combobox", { name: "Interface language" })).toHaveValue("en");
  });

  it("ignores a stale browser preference for accounts without a saved language", async () => {
    localStorage.setItem("i18nextLng", "he");
    document.cookie = "i18next=he";
    await i18n.changeLanguage("he");
    mount("/home");
    await screen.findByRole("heading", { name: "Good to see you, Alex." });
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
  });

  it("localizes workout filters while keeping the removed weekly planner absent", async () => {
    api.fixtures.user.language = "he";
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
    api.fixtures.user.language = "he";
    mount("/signup");
    await waitFor(() => expect(document.querySelector('input[name="fullname"]')).toBeInTheDocument());
    expect(document.querySelector('input[name="fullname"]')).toHaveAttribute("id", "fullname");
    expect(screen.getByRole("radio", { name: "זכר" })).toHaveAttribute("value", "male");
    expect(screen.getByRole("radio", { name: "נקבה" })).toHaveAttribute("value", "female");
  });
});
