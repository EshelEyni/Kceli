import { FC } from "react";
import { Logo } from "../../App/Logo/Logo";
import { SpinnerLoader } from "../SpinnerLoader/SpinnerLoader";
import "./PageLoader.scss";

type PageLoaderProps = {
  isLogoLoader?: boolean;
};

export const PageLoader: FC<PageLoaderProps> = ({ isLogoLoader = false }) => {
  return (
    <div className="page-loader">
      {isLogoLoader ? (
        <>
          <span className="progress-bar" data-testid="progress-bar" />
          <Logo />
        </>
      ) : (
        <SpinnerLoader />
      )}
    </div>
  );
};
