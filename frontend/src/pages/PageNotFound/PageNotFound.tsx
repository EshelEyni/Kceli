import { t } from "../../i18n";
import { usePageLoaded } from "../../hooks/usePageLoaded";
import "./PageNotFound.scss";

const PageNotFound = () => {
  usePageLoaded({});

  return (
    <main>
      <div className="page-not-found-content-container">
        <p>{t("Hmm...this page doesn’t exist. Try searching for something else.")}</p>
      </div>
    </main>
  );
};

export default PageNotFound;
