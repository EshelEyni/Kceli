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
export interface UserMsg {
    type: "info" | "success" | "error" | "warning" | "";
    text: string;
    link?: {
        text?: string;
        url: string;
    };
    btn?: {
        text: string;
        fn: Function;
    };
}
export type Gender = "male" | "female";
export type UserCaloricData = {
    weight: number;
    height: number;
    age: number;
    gender: Gender;
};
export type FormattedNinjaAPIResDataItem = {
    name: string;
    calories: string;
    "serving size"?: string;
    fat?: string;
    "fat saturated"?: string;
    protein?: string;
    sodium?: string;
    potassium?: string;
    cholesterol?: string;
    carbohydrates?: string;
    fiber?: string;
    sugar?: string;
};
export type FormattedNinjaAPIResData = FormattedNinjaAPIResDataItem[];
interface BaseFormattedUSDAFoodObject {
    description: string;
    servingSize?: string;
}
export type FormattedUSDAFoodObject = BaseFormattedUSDAFoodObject & {
    [key: string]: string;
};
export {};
