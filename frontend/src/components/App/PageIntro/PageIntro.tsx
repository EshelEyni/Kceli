import { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="ui-page-intro">
      <div>
        <p className="ui-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="ui-subtitle">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  description,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  description: string;
}) {
  return (
    <article className="ui-card ui-metric">
      <p>{label}</p>
      <strong>
        {value} <small>{unit}</small>
      </strong>
      <span>{description}</span>
    </article>
  );
}
