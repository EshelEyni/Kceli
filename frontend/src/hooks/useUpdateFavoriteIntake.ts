import { useMutation, useQueryClient } from "@tanstack/react-query";
import intakeApiService from "../services/intake/intakeApiService";
import { FavoriteIntake } from "../../../shared/types/intake";

export function useUpdateFavoriteIntake() {
  const queryClient = useQueryClient();

  const { mutate: updateFavoriteIntake, isLoading } = useMutation({
    mutationFn: (data: FavoriteIntake) => intakeApiService.updateUserFavoriteIntake(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteIntakes"]);
    },
  });

  return { updateFavoriteIntake, isLoading };
}
