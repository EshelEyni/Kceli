import { FC } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import "./Checkbox.scss";

type CheckboxProps = {
  isChecked: boolean;
  onClickFn?: () => void;
};

export const Checkbox: FC<CheckboxProps> = ({ isChecked, onClickFn }) => {
  return (
    <div
      className={"checkbox" + (isChecked ? " checked" : " unchecked")}
      onClick={onClickFn}
      data-testid="checkbox"
    >
      {isChecked && (
        <AiFillCheckCircle size={24} color="var(--color-primary)" data-testid="checkbox-icon" />
      )}
    </div>
  );
};
