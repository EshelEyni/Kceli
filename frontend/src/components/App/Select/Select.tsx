import { FC, useState, createContext, useContext, cloneElement, useRef } from "react";
import { AnyFunction } from "../../../../../shared/types/system";
import { useOutsideClick } from "../../../hooks/useOutsideClick";

type SelectProps = {
  children: React.ReactNode;
  listHeight: number;
  onChange: AnyFunction;
};

type SelectContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: AnyFunction;
  listHeight: number;
  position: Position | null;
  setPosition: React.Dispatch<React.SetStateAction<Position | null>>;
};

type SelectTriggerProps = {
  children: React.ReactNode;
};

type SelectListProps = {
  children: React.ReactNode;
};

type SelectItemProps = {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

type Position = {
  top?: number;
  bottom?: number;
  left?: string;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

function useSelect() {
  const context = useContext(SelectContext);
  if (context === undefined) {
    throw new Error("useSelect must be used within a Select");
  }
  return context;
}

function calculatePositionByRef<T extends HTMLElement>(
  ref: React.RefObject<T>,
  modalHeight: number
) {
  const rect = ref.current?.getBoundingClientRect();
  if (!rect) return null;
  const windowHeight = window.innerHeight;
  const isElementAbove = windowHeight - rect.top < modalHeight;
  const bottomPosition = { top: 0 };
  const topPosition = { bottom: 0 };
  const position = {
    position: "absolute",
    ...(isElementAbove ? topPosition : bottomPosition),
    left: "50%",
    transform: "translateX(-50%)",
  };

  return position;
}

export const Select: FC<SelectProps> & {
  SelectTrigger: FC<SelectTriggerProps>;
  SelectList: FC<SelectListProps>;
  SelectItem: FC<SelectItemProps>;
} = ({ children, onChange, listHeight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  const value: SelectContextType = {
    isOpen,
    setIsOpen,
    onChange,
    listHeight,
    position,
    setPosition,
  };

  return (
    <SelectContext.Provider value={value}>
      <div style={{ position: "relative" }}>{children}</div>
    </SelectContext.Provider>
  );
};

const SelectTrigger: FC<SelectTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen, listHeight, setPosition } = useSelect();
  const ref = useRef<HTMLButtonElement>(null);

  function handleTriggerClick() {
    if (!isOpen) calcPosition();
    setIsOpen(prev => !prev);
  }

  function calcPosition() {
    const position = calculatePositionByRef(ref, listHeight);
    if (!position) return;
    setPosition(position);
  }

  return cloneElement(children as React.ReactElement, {
    id: "select-trigger",
    className: "select-trigger",
    onClick: handleTriggerClick,
    ref,
  });
};

const SelectList: FC<SelectListProps> = ({ children }) => {
  const { isOpen, setIsOpen, position } = useSelect();
  const { outsideClickRef } = useOutsideClick<HTMLUListElement>(close, true, ["select-trigger"]);

  function close() {
    setIsOpen(false);
  }

  if (!isOpen) return null;
  return (
    <ul style={{ ...position }} className="select-list" ref={outsideClickRef}>
      {children}
    </ul>
  );
};

const SelectItem: FC<SelectItemProps> = ({ value, children }) => {
  const { onChange, setIsOpen } = useSelect();

  function handleItemClick() {
    onChange(value);
    setIsOpen(false);
  }

  return (
    <li className="select-list__item" onClick={handleItemClick}>
      {children}
    </li>
  );
};

Select.SelectTrigger = SelectTrigger;
Select.SelectList = SelectList;
Select.SelectItem = SelectItem;
