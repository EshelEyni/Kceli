import { FC } from "react";
import "./SpinnerLoader.scss";

type ContainerSize =
  | {
      width: string;
      height?: string;
    }
  | {
      width?: string;
      height: string;
    };

type SpinnerLoaderProps = {
  containerSize?: ContainerSize;
};

export const SpinnerLoader: FC<SpinnerLoaderProps> = ({ containerSize }) => {
  if (containerSize)
    return (
      <div
        className="spinner-loader-container"
        style={{
          width: containerSize.width || "100%",
          height: containerSize.height || "100%",
        }}
        data-testid="spinner-loader-container"
      >
        <div className="spinner-loader" data-testid="spinner-loader" />
      </div>
    );

  return <div className="spinner-loader" data-testid="spinner-loader" />;
};
