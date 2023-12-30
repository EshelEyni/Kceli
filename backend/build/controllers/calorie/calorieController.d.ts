/// <reference types="qs" />
import { Request, Response } from "express";
declare const getCaloriesForItem: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: import("express").NextFunction) => void;
export { getCaloriesForItem };
