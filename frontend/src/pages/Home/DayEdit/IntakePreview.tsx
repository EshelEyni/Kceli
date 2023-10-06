import { FC } from "react";
import { Intake } from "../../../../../shared/types/intake";

type IntakePreviewProps = {
  intake: Intake;
};

export const IntakePreview: FC<IntakePreviewProps> = ({ intake }) => {
  return (
    <ol className="intake-preview">
      {intake.items.map(item => (
        <li className="intake-item-preview-container" key={item.id}>
          <section className="intake-item-preview">
            <p className="intake-item-preview__details">{`${item.name} - ${item.quantity} ${
              item.unit
            } - caolries: ${Math.round(item.calories)}`}</p>
          </section>
        </li>
      ))}
    </ol>
  );
};
