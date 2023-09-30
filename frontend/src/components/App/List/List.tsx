import "./List.scss";

type ListProps<T> = {
  items: T[];
  render: (item: T, i: number, arr: T[]) => JSX.Element;
  className?: string;
  isOrdered?: boolean;
};

export const List = <T,>({ items, render, className, isOrdered = false }: ListProps<T>) => {
  if (isOrdered)
    return <ol className={`list ${className ? className : ""}`}>{items.map(render)}</ol>;
  return <ul className={`list ${className ? className : ""}`}>{items.map(render)}</ul>;
};
