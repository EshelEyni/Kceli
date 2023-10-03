import { FC } from "react";
import "./Header.scss";

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export const Header: FC<HeaderProps> = ({ children, className }) => {
  return <header className={className}>{children}</header>;
};
