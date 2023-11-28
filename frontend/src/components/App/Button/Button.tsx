import { FC } from "react";
import "./Button.scss";
import { AnyFunction } from "../../../../../shared/types/system";

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  onClickFn?: AnyFunction;
  type?: "button" | "submit" | "reset";
  dataTestId?: string;
  style?: React.CSSProperties;
};

export const Button: FC<ButtonProps> = ({
  className,
  children,
  isDisabled = false,
  onClickFn,
  type = "button",
  dataTestId = "btn",
  style = {},
}) => {
  return (
    <button
      className={"btn " + (className || "")}
      style={style}
      onClick={onClickFn}
      disabled={isDisabled}
      data-testid={dataTestId}
      type={type}
    >
      {children}
    </button>
  );
};
