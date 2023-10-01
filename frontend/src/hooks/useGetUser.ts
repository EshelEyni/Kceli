import { useQuery } from "@tanstack/react-query";
import { User } from "../../../shared/types/user";
import userApiService from "../services/user/userApiService";

type useUserResult = {
  user: User | undefined;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

export function useGetUser(userId: string): useUserResult {
  const {
    data: user,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: [`user/${userId}`],
    queryFn: async () => {
      if (!userId) throw new Error("User Id is required");
      return userApiService.getById(userId);
    },
  });

  return { user, error, isLoading, isSuccess, isError };
}
