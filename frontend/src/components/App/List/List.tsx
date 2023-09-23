import "./List.scss";

type ListProps<T> = {
  items: T[];
  render: (item: T, i: number, arr: T[]) => JSX.Element;
  className?: string;
};

export const List = <T,>({ items, render, className }: ListProps<T>) => {
  return <ul className={`list ${className}`}>{items.map(render)}</ul>;
};
