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

export function useGetUser(username: string): useUserResult {
  const {
    data: user,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: [`user/${username}`],
    queryFn: async () => {
      if (!username) throw new Error("Username is required");
      return userApiService.getByUsername(username);
    },
  });

  return { user, error, isLoading, isSuccess, isError };
}
