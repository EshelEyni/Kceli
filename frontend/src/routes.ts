import { LazyExoticComponent, lazy, FC } from "react";

const Homepage = lazy(() => import("./pages/Home/Home"));
const LoginPage = lazy(() => import("./pages/Login/Login"));
const ProfileDetails = lazy(() => import("./pages/ProfileDetails/ProfileDetails"));
const SignupPage = lazy(() => import("./pages/Signup/Signup"));
const SchedulePage = lazy(() => import("./pages/Schedule/Schedule"));
const DayDetails = lazy(() => import("./pages/DayDetails/DayDetails"));
const WorkoutPage = lazy(() => import("./pages/Workout/WorkoutPage"));
const WorkoutEdit = lazy(() => import("./pages/WorkoutEdit/WorkoutEdit"));
const WorkoutDetails = lazy(() => import("./pages/WorkoutDetails/WorkoutDetails"));

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
    path: "profile/:id",
    component: ProfileDetails,
    authRequired: true,
  },
  {
    path: "workouts",
    component: WorkoutPage,
    authRequired: true,
  },
  {
    path: "workouts/edit/:id",
    component: WorkoutEdit,
    authRequired: true,
  },
  {
    path: "workouts/details/:id",
    component: WorkoutDetails,
    authRequired: true,
  },
  {
    path: "schedule",
    component: SchedulePage,
    authRequired: true,
  },
  {
    path: "day/:id",
    component: DayDetails,
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
