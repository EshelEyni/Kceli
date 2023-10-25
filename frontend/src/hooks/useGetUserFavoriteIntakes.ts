import { useQuery } from "@tanstack/react-query";
import { Intake } from "../../../shared/types/intake";
import intakeApiService from "../services/intake/intakeApiService";

type useGetUserFavoriteIntakesResult = {
  favoriteIntakes: Intake[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetUserFavoriteIntakes(): useGetUserFavoriteIntakesResult {
  const {
    data: favoriteIntakes,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["favoriteIntakes"],
    queryFn: intakeApiService.getUserFavoriteIntakes,
  });

  return { favoriteIntakes, error, isLoading, isSuccess, isError };
}
