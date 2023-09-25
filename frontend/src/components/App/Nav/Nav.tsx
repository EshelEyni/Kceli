import { FC } from "react";

type NavProps = {
  children: React.ReactNode;
  className?: string;
};

export const Nav: FC<NavProps> = ({ children, className = "app-nav" }) => {
  return <nav className={className}>{children}</nav>;
};
