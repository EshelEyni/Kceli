import { RootState } from "./../types/app";
import { useSelector } from "react-redux";
import { User } from "../../../shared/types/user";

type UseAuth = {
  loggedInUser: User | null;
};

export function useAuth(): UseAuth {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);

  return { loggedInUser };
}
