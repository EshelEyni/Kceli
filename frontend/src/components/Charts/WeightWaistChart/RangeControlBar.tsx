import { FC } from "react";
import { Range } from "react-range";
import { ReportDayData } from "../../../types/app";

type RangeControlBarProps = {
  data: ReportDayData[];
  rangeValues: number[];
  setRangeValues: (values: number[]) => void;
};

export const RangeControlBar: FC<RangeControlBarProps> = ({
  data,
  rangeValues,
  setRangeValues,
}) => {
  return (
    <div className="range-control-bar-bar-container">
      <Range
        step={1}
        min={0}
        max={data.length - 1}
        values={rangeValues}
        onChange={setRangeValues}
        renderTrack={({ props, children }) => (
          <div {...props} className="range-control-bar-bar" style={{ ...props.style }}>
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className="range-control-bar-bar-thumb" style={{ ...props.style }} />
        )}
      />
    </div>
  );
};
