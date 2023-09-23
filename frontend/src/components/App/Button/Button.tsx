import { FC } from "react";
import "./Button.scss";
import { AnyFunction } from "../../../../../shared/types/system";

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  isDisabled?: boolean;
  onClickFn?: AnyFunction;
  type?: "button" | "submit" | "reset";
};

export const Button: FC<ButtonProps> = ({
  className,
  children,
  isDisabled = false,
  onClickFn,
  type = "button",
}) => {
  return (
    <button
      className={className}
      onClick={onClickFn}
      disabled={isDisabled}
      data-testid={className}
      type={type}
    >
      {children}
    </button>
  );
};
