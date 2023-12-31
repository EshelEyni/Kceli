import { usePageLoaded } from "../../hooks/usePageLoaded";
import "./PageNotFound.scss";

const PageNotFound = () => {
  usePageLoaded({});

  return (
    <main>
      <div className="page-not-found-content-container">
        <p>Hmm...this page doesn’t exist. Try searching for something else.</p>
      </div>
    </main>
  );
};

export default PageNotFound;
