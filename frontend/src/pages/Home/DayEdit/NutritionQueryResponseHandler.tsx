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
  if (status === "loading") return <DotLoader />;
  if (status === "error" && error) return <ErrorMsg msg={error} />;

  if (status === "success")
    return (
      <section data-testid="nutrition-query-response-handler">
        {type === "chatGPT" && <p>{response as string}</p>}
        {type === "ninjaAPI" && (
          <ul
            className="nutrition-query__results__item__list"
            data-testid="nutrition-query-response-ninja-api-response"
          >
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
        {type === "usdaAPI" && (
          <ul
            className="nutrition-query__results__item__list"
            data-testid="nutrition-query-response-usda-api-response"
          >
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
      </section>
    );

  return null;
};
