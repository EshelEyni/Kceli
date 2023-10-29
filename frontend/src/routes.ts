import { lazy } from "react";
import { ProfileProvider } from "./contexts/ProfileContext";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import { WorkoutsProvider } from "./pages/Workout/WorkoutsContext";
import { WorkoutEditProvider } from "./contexts/WorkoutEditContext";
import { Route } from "./types/app";

const Homepage = lazy(() => import("./pages/Home/Home"));
const LoginPage = lazy(() => import("./pages/Login/Login"));
const ProfileDetails = lazy(() => import("./pages/ProfileDetails/ProfileDetails"));
const SignupPage = lazy(() => import("./pages/Signup/Signup"));
const SchedulePage = lazy(() => import("./pages/Schedule/Schedule"));
const DayDetails = lazy(() => import("./pages/DayDetails/DayDetails"));
const WorkoutPage = lazy(() => import("./pages/Workout/WorkoutPage"));
const WorkoutEdit = lazy(() => import("./pages/WorkoutEdit/WorkoutEdit"));
const WorkoutDetails = lazy(() => import("./pages/WorkoutDetails/WorkoutDetails"));

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
    provider: ProfileProvider,
  },
  {
    path: "workouts",
    component: WorkoutPage,
    authRequired: true,
    provider: WorkoutsProvider,
  },
  {
    path: "workouts/edit/:id",
    component: WorkoutEdit,
    authRequired: true,
    provider: WorkoutEditProvider,
  },
  {
    path: "workouts/details/:id",
    component: WorkoutDetails,
    authRequired: true,
    provider: WorkoutProvider,
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

export { routes };
