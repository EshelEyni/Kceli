import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../shared/types/user";
import userApiService from "../services/user/userApiService";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: (data: User) => userApiService.update(data),
    onSuccess: data => {
      queryClient.setQueryData([`user/${data.id}`], data);
      queryClient.invalidateQueries([`user/${data.username}`]);
    },
  });

  return { updateUser, isLoading };
}
