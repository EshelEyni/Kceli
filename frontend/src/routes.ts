import { LazyExoticComponent, lazy, FC } from "react";

const Homepage = lazy(() => import("./pages/Home/Home"));
const LoginPage = lazy(() => import("./pages/Login/Login"));
const ProfileDetails = lazy(() => import("./pages/ProfileDetails/ProfileDetails"));
const SignupPage = lazy(() => import("./pages/Signup/Signup"));

export interface Route {
  path: string;
  component: LazyExoticComponent<FC>;
  authRequired: boolean;
  homePageOnly?: boolean;
}

const routes: Route[] = [
  {
    path: "home",
    component: Homepage,
    authRequired: false,
  },
  {
    path: "profile/:username?",
    component: ProfileDetails,
    authRequired: true,
  },
  {
    path: "login",
    component: LoginPage,
    authRequired: false,
  },
  {
    path: "signup",
    component: SignupPage,
    authRequired: false,
  },
];

const nestedRoutes: Route[] = [];

export { routes, nestedRoutes };
