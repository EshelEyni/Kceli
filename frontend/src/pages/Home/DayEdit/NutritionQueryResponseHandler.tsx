import { FC } from "react";
import { NutritionQueryState } from "../../../types/app";
import { DotLoader } from "../../../components/Loaders/DotLoader/DotLoader";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";
import {
  FormattedNinjaAPIResData,
  FormattedUSDAFoodObject,
} from "../../../../../shared/types/system";

type NutritionQueryResponseHandlerProps = {
  queryState: NutritionQueryState;
};

export const NutritionQueryResponseHandler: FC<NutritionQueryResponseHandlerProps> = ({
  queryState: { type, status, error, response },
}) => {
  return (
    <>
      {status === "loading" && <DotLoader />}
      {status === "error" && <ErrorMsg msg={error as string} />}
      {status === "success" && type === "chatGPT" && <p>{response as string}</p>}
      {status === "success" && type === "ninjaAPI" && (
        <ul className="nutrition-query__results__item__list">
          {(response as FormattedNinjaAPIResData).map((res, i) => {
            return (
              <li key={i}>
                {Object.entries(res).map(([key, value]) => {
                  if (key === "name") return <strong key={key}>{res.name}</strong>;
                  return (
                    <div key={key}>
                      <span>{key}:</span>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ul>
      )}
      {status === "success" && type === "usdaAPI" && (
        <ul className="nutrition-query__results__item__list">
          {(response as FormattedUSDAFoodObject[]).map((res, i) => {
            const entries = Object.entries(res);
            return (
              <li key={i}>
                {entries.map(([key, value]) => {
                  if (key === "description") return <strong key={key}>{res.description}</strong>;
                  return (
                    <div key={key}>
                      <span>{key}:</span>
                      <span>{value}</span>
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};
