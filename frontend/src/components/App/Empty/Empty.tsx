import { t } from "../../../i18n";
import { FC } from "react";

import "./Empty.scss";

type EmptyProps = {
  entityName: string;
};

export const Empty: FC<EmptyProps> = ({ entityName }) => {
  return (
    <p className="empty" data-testid="empty-msg">
      {t("No {{entity}} could be found...", { entity: entityName })}
    </p>
  );
};
