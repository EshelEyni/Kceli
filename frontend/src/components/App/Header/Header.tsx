import { AnyFunction } from "../../../../../shared/types/system";
import { FC } from "react";
import "./Header.scss";

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClickFn?: AnyFunction;
};

export const Header: FC<HeaderProps> = ({ children, className, style, onClickFn }) => {
  return (
    <header className={className} style={style} onClick={onClickFn}>
      {children}
    </header>
  );
};
