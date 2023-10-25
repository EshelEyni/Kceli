import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayDataApiService from "../services/dayData/dayDataApiService";

export function useCreateDay() {
  const queryClient = useQueryClient();

  const { mutate: createDay, isLoading } = useMutation({
    mutationFn: dayDataApiService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["today"]);
    },
  });

  return { createDay, isLoading };
}
