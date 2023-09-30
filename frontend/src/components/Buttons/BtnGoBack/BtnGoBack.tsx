import { FC } from "react";
import { Button } from "../../App/Button/Button";

type BtnGoBackProps = {
  handleClick: () => void;
  className?: string;
};
export const BtnGoBack: FC<BtnGoBackProps> = ({ handleClick, className }) => {
  return (
    <Button className={`btn btn--go-back ${className ? className : ""}`} onClickFn={handleClick}>
      go back
    </Button>
  );
};
