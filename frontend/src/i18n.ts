import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../public/locales/en/translation.json";
import he from "../public/locales/he/translation.json";
import { getGuestLanguage } from "./services/language/guestLanguage";

// Bundle dictionaries so the interface can switch languages offline, too.
i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, he: { translation: he } },
  supportedLngs: ["en", "he"],
  lng: getGuestLanguage(),
  fallbackLng: "en",
  load: "languageOnly",
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export function syncDocumentLanguage() {
  document.documentElement.lang = i18n.resolvedLanguage || "en";
  document.documentElement.dir = i18n.dir();
}
i18n.on("languageChanged", syncDocumentLanguage);
syncDocumentLanguage();

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options || {}) as string;
}
export function getLocale() {
  return i18n.resolvedLanguage === "he" ? "he-IL" : "en-US";
}
export default i18n;
