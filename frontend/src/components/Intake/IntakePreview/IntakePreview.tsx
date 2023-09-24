import { FC } from "react";
import { Intake } from "../../../../../shared/types/intake";
import { ListItemTitle } from "../../App/ListItemTitle/ListItemTitle";
import "./IntakePreview.scss";

type IntakePreviewProps = {
  intake: Intake;
};

export const IntakePreview: FC<IntakePreviewProps> = ({ intake }) => {
  return (
    <section className="intake-preview">
      {intake.name && <h3 className="intake-preview__name">{intake.name}</h3>}
      {intake.items.map((item, i) => (
        <div className="intake-item-preview-container" key={item.id}>
          <ListItemTitle idx={i} suffixSign={")"} className="intake-preview__item-list-title" />
          <section className="intake-item-preview">
            <p className="intake-item-preview__details">{`${item.name} - ${item.quantity} ${item.unit} - caolries: ${item.calories}`}</p>
          </section>
        </div>
      ))}
    </section>
  );
};
