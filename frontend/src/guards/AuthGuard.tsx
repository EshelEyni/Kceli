import { useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSystem } from "../hooks/useSystem";

type AuthGuardProps = {
  component: React.ReactNode;
};

export const AuthGuard: FC<AuthGuardProps> = ({ component }) => {
  const { loggedInUser } = useAuth();
  const { isPageLoading } = useSystem();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser && !isPageLoading) navigate("/");
  }, [loggedInUser, isPageLoading, navigate]);

  return <>{component}</>;
};
