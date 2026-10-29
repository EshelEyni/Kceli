import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../public/locales/en/translation.json";
import he from "../public/locales/he/translation.json";

// Bundle dictionaries so the interface can switch languages offline, too.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, he: { translation: he } },
    supportedLngs: ["en", "he"],
    fallbackLng: "en",
    load: "languageOnly",
    keySeparator: false,
    nsSeparator: false,
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      caches: ["cookie", "localStorage"],
      cookieOptions: { path: "/", sameSite: "lax" },
    },
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
