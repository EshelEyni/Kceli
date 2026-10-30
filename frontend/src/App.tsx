import { useTranslation } from "react-i18next";
import "./i18n";
import { getGuestLanguage } from "./services/language/guestLanguage";
import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { routes } from "./routes";
import { Route as TypeOfRoute } from "./types/app";
import { PageLoader } from "./components/Loaders/PageLoader/PageLoader";
import { AuthGuard } from "./guards/AuthGuard";
import { loginWithToken } from "./store/slices/authSlice";
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
import "./styles/main.scss";
import { AppDispatch } from "./types/app";
import { useAuth } from "./hooks/useAuth";
import { useSystem } from "./hooks/useSystem";
import { AppHeader } from "./components/App/AppHeader/AppHeader";
import "./styles/redesign.scss";
import "./styles/localization.scss";

function App() {
  const { i18n } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { loggedInUser } = useAuth();
  const { isPageLoading } = useSystem();
  const { pathname } = useLocation();

  useEffect(() => {
    const language = loggedInUser
      ? loggedInUser.language === "he"
        ? "he"
        : "en"
      : getGuestLanguage();
    void i18n.changeLanguage(language);
  }, [i18n, loggedInUser?.id, loggedInUser?.language]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const routeElements = _getRouteElements();

  useEffect(() => {
    if (loggedInUser) return;
    dispatch(loginWithToken());
  }, [loggedInUser, dispatch]);

  return (
    <div id="app" className="app">
      <div className="app-content" id="app-content">
        <AppHeader />
        <div id="main-content" className="ui-main-content" tabIndex={-1}>
          <Suspense fallback={<PageLoader isLogoLoader={isPageLoading} />}>
            <Routes>
              <Route index element={<Navigate replace to="/home" />} />
              {routeElements}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function _getRouteElements() {
  return routes.map(route => (
    <Route key={route.path} path={route.path} element={_getRouteElement(route)} />
  ));
}

function _getRouteElement(route: TypeOfRoute) {
  const component = route.provider ? (
    <route.provider>
      <route.component />
    </route.provider>
  ) : (
    <route.component />
  );

  return route.authRequired ? <AuthGuard component={component} /> : <route.component />;
}

export default App;
