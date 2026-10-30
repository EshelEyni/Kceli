import { FC } from "react";
import { NutritionQueryState } from "../../../types/app";
import { DotLoader } from "../../../components/Loaders/DotLoader/DotLoader";
import { ErrorMsg } from "../../../components/Msg/ErrorMsg/ErrorMsg";

export const NutritionQueryResponseHandler: FC<{ queryState: NutritionQueryState }> = ({
  queryState: { status, error, response },
}) => {
  if (status === "loading") return <DotLoader />;
  if (status === "error" && error) return <ErrorMsg msg={error} />;
  if (status === "success") return <div data-testid="nutrition-query-response-handler" dir="auto"><p>{response}</p></div>;
  return null;
};
