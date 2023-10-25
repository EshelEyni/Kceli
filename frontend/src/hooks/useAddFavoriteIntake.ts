import { useMutation, useQueryClient } from "@tanstack/react-query";
import intakeApiService from "../services/intake/intakeApiService";

export function useAddFavoriteIntake() {
  const queryClient = useQueryClient();

  const { mutate: addFavoriteIntake, isLoading } = useMutation({
    mutationFn: intakeApiService.addUserFavoriteIntake,
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteIntakes"]);
    },
  });

  return { addFavoriteIntake, isLoading };
}
