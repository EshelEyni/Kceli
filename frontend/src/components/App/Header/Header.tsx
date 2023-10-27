import { FC } from "react";
import "./Header.scss";

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Header: FC<HeaderProps> = ({ children, className, style }) => {
  return (
    <header className={className} style={style}>
      {children}
    </header>
  );
};
