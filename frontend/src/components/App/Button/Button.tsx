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
};

export const Button: FC<ButtonProps> = ({
  className,
  children,
  isDisabled = false,
  onClickFn,
  type = "button",
  dataTestId = "btn",
}) => {
  return (
    <button
      className={"btn " + (className || "")}
      onClick={onClickFn}
      disabled={isDisabled}
      data-testid={dataTestId}
      type={type}
    >
      {children}
    </button>
  );
};
