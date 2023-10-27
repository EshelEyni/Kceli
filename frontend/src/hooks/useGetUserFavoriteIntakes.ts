import { useQuery } from "@tanstack/react-query";
import { FavoriteIntake } from "../../../shared/types/intake";
import intakeApiService from "../services/intake/intakeApiService";

type useGetUserFavoriteIntakesResult = {
  favoriteIntakes: FavoriteIntake[] | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isEmpty: boolean;
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

  const isEmpty = !!favoriteIntakes && favoriteIntakes.length === 0;

  return { favoriteIntakes, error, isLoading, isSuccess, isError, isEmpty };
}
