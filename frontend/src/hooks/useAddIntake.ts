import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayDataApiService from "../services/dayDataApi/dayDataApiService";
import { AddIntakeParams } from "../types/app";

export function useAddIntake() {
  const queryClient = useQueryClient();

  const { mutate: addIntake, isLoading } = useMutation({
    mutationFn: (data: AddIntakeParams) =>
      dayDataApiService.addIntake({
        todayDataId: data.todayDataId,
        intakes: data.intakes,
      }),
    onSuccess: data => {
      queryClient.setQueryData(["today"], data);
    },
  });

  return { addIntake, isLoading };
}
