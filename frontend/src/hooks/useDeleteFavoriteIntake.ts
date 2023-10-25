import { useMutation, useQueryClient } from "@tanstack/react-query";
import intakeApiService from "../services/intake/intakeApiService";

export function useDeleteFavoriteIntake() {
  const queryClient = useQueryClient();

  const { mutate: removeFavoriteIntake, isLoading } = useMutation({
    mutationFn: async (id: string) => intakeApiService.removeUserFavoriteIntake(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteIntakes"]);
    },
  });

  return { removeFavoriteIntake, isLoading };
}
