import { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import { useGetUser } from "../hooks/useGetUser";
import { User } from "../../../shared/types/user";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { UseMutateFunction } from "@tanstack/react-query";

type ProfileContextType = {
  user: User | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  updateUser: UseMutateFunction<User, unknown, User, unknown>;
  isLoadingUpdateUser: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

function ProfileProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { id } = params as { id: string };
  const { user, isLoading, isSuccess, isError } = useGetUser(id);

  const { updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();

  const value = {
    user,
    isLoading,
    isSuccess,
    isError,
    updateUser,
    isLoadingUpdateUser,
  };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a WorkoutsProvider");
  }
  return context;
}

export { ProfileProvider, useProfile };
