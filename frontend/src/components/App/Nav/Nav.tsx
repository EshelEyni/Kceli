import { FC } from "react";

type NavProps = {
  children: React.ReactNode;
  className?: string;
};

export const Nav: FC<NavProps> = ({ children, className }) => {
  return <nav className={className}>{children}</nav>;
};
