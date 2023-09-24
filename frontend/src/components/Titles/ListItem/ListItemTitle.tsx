import { FC } from "react";
import "./ListItemTitle.scss";

type ListItemTitleProps = {
  idx: number;
  title?: string;
  className?: string;
  suffixSign?: string;
};

export const ListItemTitle: FC<ListItemTitleProps> = ({
  idx,
  suffixSign = "#",
  title = "",
  className,
}) => {
  return (
    <em className={"list-item-title " + (className ? className : "")}>
      <span className="list-item-title__num">{idx + 1 + suffixSign}</span>
      <p className="list-item-title__text">{title}</p>
    </em>
  );
};
