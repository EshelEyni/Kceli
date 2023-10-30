import { FC } from "react";
import { Button } from "../../App/Button/Button";
import { FaChevronCircleLeft } from "react-icons/fa";
import "./BtnGoBack.scss";
import { useNavigate } from "react-router-dom";

export const BtnGoBack: FC = () => {
  const navigate = useNavigate();

  function handleBtnClick() {
    navigate(-1);
  }

  return (
    <Button className="btn btn-go-back" onClickFn={handleBtnClick}>
      <span>go back</span>
      <FaChevronCircleLeft className="btn-go-back__icon" />
    </Button>
  );
};
