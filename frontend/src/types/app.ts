import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { store } from "../store/store";
import { FC, LazyExoticComponent, ReactElement, ReactNode } from "react";

export type ReduxStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<Promise<void>, RootState, undefined, AnyAction>;
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

export type CachedData<T> = {
  data: T;
  cachedAt: number;
};

export type GetBcgByCosumedCaloriesParams = {
  targetCalorie: number;
  consumedCalories: number;
};

export type SpellingSuggestion = {
  original: string;
  suggestions: string[];
};

export type RecommendedWeight = {
  min: number;
  max: number;
  avg: number;
};

export type CaloriesToLose = {
  calories: string;
  dailyIntakes: string;
};

export type TimeToWeightGoal = {
  days: number;
  weeks: number;
  months: number;
};

type RouteProvider = ({
  children,
}: {
  children: ReactNode;
}) => ReactElement<{ children: ReactNode }, string | ((props: unknown) => JSX.Element)>;

export interface Route {
  path: string;
  component: LazyExoticComponent<FC>;
  authRequired: boolean;
  homePageOnly?: boolean;
  provider?: RouteProvider;
}
