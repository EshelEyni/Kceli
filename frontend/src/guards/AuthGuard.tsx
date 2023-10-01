import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";
import { RootState } from "../types/app";

type AuthGuardProps = {
  component: React.ReactNode;
};

export const AuthGuard: FC<AuthGuardProps> = ({ component }) => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const { isPageLoading } = useSelector((state: RootState) => state.system);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser && !isPageLoading) navigate("/login");
  }, [loggedInUser, isPageLoading, navigate]);

  return <>{component}</>;
};
