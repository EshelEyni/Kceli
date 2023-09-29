import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes, nestedRoutes } from "./routes";
import { Route as TypeOfRoute } from "./routes";
import { PageLoader } from "./components/Loaders/PageLoader/PageLoader";
import { AuthGuard } from "./guards/AuthGuard";
import { loginWithToken } from "./store/slices/authSlice";
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound"));
import "./styles/main.scss";
import { AppDispatch, RootState } from "./types/app";
import { Header } from "./components/App/Header/Header";
import { Nav } from "./components/App/Nav/Nav";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const { isPageLoading } = useSelector((state: RootState) => state.system);

  function getRoutes() {
    return routes.map(route => (
      <Route key={route.path} path={route.path} element={geRouteElement(route)}>
        {getNestedRoutes(route)}
      </Route>
    ));
  }

  function getNestedRoutes(route: TypeOfRoute) {
    const getRoute = (route: TypeOfRoute) => (
      <Route key={route.path} path={route.path} element={geRouteElement(route)} />
    );
    const isHomePage = route.path === "home";
    if (isHomePage) return nestedRoutes.map(route => getRoute(route));
    return nestedRoutes.filter(route => !route.homePageOnly).map(route => getRoute(route));
  }

  function geRouteElement(route: TypeOfRoute) {
    return route.authRequired ? <AuthGuard component={<route.component />} /> : <route.component />;
  }

  useEffect(() => {
    if (!loggedInUser) dispatch(loginWithToken());
  }, [loggedInUser, dispatch]);

  return (
    <div id="app" className="app">
      <div className="app-content" id="app-content">
        <Header className="app-header">
          <Nav>
            <NavLink to="/home" className={"app-nav-link"}>
              home
            </NavLink>
            <NavLink to={"workouts"} className={"app-nav-link"}>
              workouts
            </NavLink>
            <NavLink to="/schedule" className={"app-nav-link"}>
              schedule
            </NavLink>
            <NavLink to={`/profile/${loggedInUser?.username}`} className={"app-nav-link"}>
              profile
            </NavLink>
          </Nav>
        </Header>
        <Suspense fallback={<PageLoader isLogoLoader={isPageLoading} />}>
          <Routes>
            <Route index element={<Navigate replace to="/home" />} />
            {getRoutes()}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
