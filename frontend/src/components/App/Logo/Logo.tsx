import img from "/assets/images/pwa-512x512.png";
import { useNavigate } from "react-router-dom";
import "./Logo.scss";

type StaticLogoProps = {
  linkEnabled?: boolean;
  size: {
    height: number;
    width: number;
  };
};

type DynamicLogoProps = {
  linkEnabled?: boolean;
  size?: {
    height: number;
    width: number;
  };
};

type LogoProps = StaticLogoProps | DynamicLogoProps;

export const Logo = (
  { linkEnabled, size }: LogoProps = {
    linkEnabled: false,
    size: undefined,
  }
) => {
  const navigate = useNavigate();

  const style = size
    ? {
        height: `${size.height}px`,
        width: `${size.width}px`,
        fontSize: `${size.height * 0.33}px`,
      }
    : undefined;

  function handleLogoClick() {
    if (!linkEnabled) return;
    navigate("/");
  }

  return (
    <section className="logo-container" style={style} onClick={handleLogoClick}>
      <img src={img} alt="logo" data-testid="logo" />
    </section>
  );
};
