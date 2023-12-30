/// <reference types="qs" />
/// <reference types="express" />
import { NinjaAPIResData, USDAFoodObject } from "../../types/app";
import { FormattedNinjaAPIResData, FormattedUSDAFoodObject } from "../../../../shared/types/system";
declare const queryChatGPT: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction) => void;
declare const queryNinjaAPI: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction) => void;
declare const queryUSDA: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction) => void;
declare function formatNinjaAPIResData(data: NinjaAPIResData): FormattedNinjaAPIResData;
declare function formatUSDAAPIData(data: {
    foods: USDAFoodObject[];
}): FormattedUSDAFoodObject[];
export { queryChatGPT, queryNinjaAPI, queryUSDA, formatNinjaAPIResData, formatUSDAAPIData };
