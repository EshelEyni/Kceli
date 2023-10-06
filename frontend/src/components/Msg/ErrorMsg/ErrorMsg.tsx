import { FC } from "react";
import "./ErrorMsg.scss";

type ErrorProps = {
  msg?: string;
};

export const ErrorMsg: FC<ErrorProps> = ({ msg = "Something went wrong" }) => {
  return (
    <p className="error-msg" data-testid="error-msg">
      {msg}
    </p>
  );
};
