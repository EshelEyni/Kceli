import "./List.scss";

type ListProps<T> = {
  items: T[];
  render: (item: T, i: number, arr: T[]) => JSX.Element;
  className?: string;
  isOrdered?: boolean;
  dataTestId?: string;
};

export const List = <T,>({
  items,
  render,
  className,
  isOrdered = false,
  dataTestId,
}: ListProps<T>) => {
  if (isOrdered)
    return (
      <ol className={`list ${className ? className : ""}`} data-testid={dataTestId}>
        {items.map(render)}
      </ol>
    );
  return (
    <ul className={`list ${className ? className : ""}`} data-testid={dataTestId}>
      {items.map(render)}
    </ul>
  );
};
