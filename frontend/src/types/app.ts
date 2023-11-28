import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { store } from "../store/store";
import { FC, LazyExoticComponent, ReactElement, ReactNode } from "react";
import { User, WeightLossGoal } from "../../../shared/types/user";
import { DayData } from "../../../shared/types/dayData";
import { FormattedNinjaAPIResData, FormattedUSDAFoodObject } from "../../../shared/types/system";

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

export type UserOrNull = User | null;

export type CalenderDay = {
  id: string | null;
  data: DayData | null;
  backgroundColor: string;
  targetCalorie: number;
  isBorder: boolean;
  date: Date;
  day: number;
  consumedCalories: number;
};

export type QueryStatus = "idle" | "loading" | "success" | "error";

export type NutritionQueryState = {
  type: "chatGPT" | "ninjaAPI" | "usdaAPI";
  response: string | FormattedNinjaAPIResData | FormattedUSDAFoodObject[] | null;
  status: QueryStatus;
  error: string | null;
};

export enum ScheduleGridFilter {
  Day = "day",
  Week = "week",
  Month = "month",
}

interface BaseGoal {
  id: string;
  userId: string;
  date: Date | string;
  description: string;
  isCompleted: boolean;
}

export interface UserGoal extends BaseGoal {
  type: "user";
  userWeightLossGoal: WeightLossGoal; // Mandatory for 'user' type
}

export interface TimeGoal extends BaseGoal {
  type: "week" | "month";
}

export type Goal = UserGoal | TimeGoal;

export type ReportDayData = {
  date: string | Date | number;
  weight: number;
  waist: number;
};
