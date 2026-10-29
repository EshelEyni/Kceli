import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  return (
    <select
      className="ui-language-selector"
      aria-label={i18n.resolvedLanguage === "he" ? "שפת הממשק" : "Interface language"}
      value={i18n.resolvedLanguage || "en"}
      onChange={event => {
        void i18n.changeLanguage(event.target.value);
      }}
    >
      <option value="en" lang="en">
        English
      </option>
      <option value="he" lang="he">
        עברית
      </option>
    </select>
  );
}
