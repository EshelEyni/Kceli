import { User } from "./user";

export type AnyFunction = (...args: any[]) => any;

export interface JsendResponse<T = any> {
  status: string;
  requested_at?: string;
  result?: number;
  data?: T;
  message?: string;
}

export interface IAsyncLocalStorageStore {
  loggedInUser?: User;
}
