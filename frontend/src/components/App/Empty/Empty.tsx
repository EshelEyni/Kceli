import { FC } from "react";

import "./Empty.scss";

type EmptyProps = {
  entityName: string;
};

export const Empty: FC<EmptyProps> = ({ entityName }) => {
  return <p className="empty" data-testid="empty-msg">{`No ${entityName} could be found...`}</p>;
};
