import { t } from "../i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../shared/types/user";
import userApiService from "../services/user/userApiService";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../store/slices/authSlice";
import toast from "react-hot-toast";

export function useUpdateUser() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: (data: User) => userApiService.update(data),
    onSuccess: data => {
      dispatch(setLoggedInUser(data));
      queryClient.setQueryData([`user/${data.id}`], data);
      queryClient.invalidateQueries([`user/${data.username}`]);
    },
    onError: () => toast.error(t("Couldn't save your changes. Please try again.")),
  });

  return { updateUser, isLoading };
}
