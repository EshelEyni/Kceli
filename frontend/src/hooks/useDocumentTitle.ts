import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  const { t } = useTranslation();
  useEffect(() => {
    const prevTitle = document.title;
    document.title = t(title || "Kceli");

    return () => {
      document.title = prevTitle;
    };
  }, [title, t]);
}
