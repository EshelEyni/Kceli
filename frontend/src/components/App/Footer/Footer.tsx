import { FC } from "react";
import "./Footer.scss";

type FooterProps = {
  children: React.ReactNode;
  className?: string;
};

export const Footer: FC<FooterProps> = ({ children, className }) => {
  return (
    <footer className={className} data-testid="footer">
      {children}
    </footer>
  );
};
