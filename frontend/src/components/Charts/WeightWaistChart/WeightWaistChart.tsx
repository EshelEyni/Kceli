import { FC, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../App/Button/Button";
import "./WeightWaistChart.scss";
import { ReportDayData } from "../../../types/app";
import { RangeControlBar } from "./RangeControlBar";

type WeightWaistChartProps = {
  data: ReportDayData[];
  isProgressBarShown?: boolean;
};

export const WeightWaistChart: FC<WeightWaistChartProps> = ({
  data,
  isProgressBarShown = false,
}) => {
  const [filterBy, setFilterBy] = useState<"all" | "weight" | "waist">("weight");
  const [rangeValues, setRangeValues] = useState([0, data.length - 1]);
  useEffect(() => {
    setRangeValues([0, Math.max(0, data.length - 1)]);
  }, [data.length]);

  const [startIndex, endIndex] = rangeValues;
  const isWeightLineShown = filterBy === "all" || filterBy === "weight";
  const isWaistLineShown = filterBy === "all" || filterBy === "waist";
  if (!data?.length)
    return <p className="ui-subtitle">Record a check-in to start your progress chart.</p>;

  const formattedData = data.slice(startIndex, endIndex + 1).map(item => ({
    ...item,
    date: new Intl.DateTimeFormat("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }).format(new Date(item.date)),
  }));

  const values = formattedData
    .flatMap(day =>
      filterBy === "waist"
        ? [day.waist]
        : filterBy === "all"
        ? [day.weight, day.waist]
        : [day.weight]
    )
    .filter(value => Number.isFinite(value) && value > 0);
  const yAxisDomain = values.length
    ? [Math.floor(Math.min(...values) - 1), Math.ceil(Math.max(...values) + 1)]
    : [0, 1];

  return (
    <>
      <div
        className="weight-waist-chart-container"
        style={{ width: "100%", maxWidth: 1200, height: 300 }}
      >
        <ResponsiveContainer>
          <LineChart
            data={formattedData}
            margin={{ top: 25, right: 35, left: 0, bottom: 10 }}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              boxShadow: "none",
              display: "flex",
            }}
          >
            <CartesianGrid strokeDasharray="4 5" stroke="#e7eae2" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis domain={yAxisDomain} />
            <Tooltip />
            <Legend />
            {isWeightLineShown && (
              <Line type="monotone" dataKey="weight" stroke="#6f9152" strokeWidth={3} dot={false} />
            )}
            {isWaistLineShown && (
              <Line type="monotone" dataKey="waist" stroke="#7399a5" strokeWidth={3} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="weight-waist-btn-container">
        <Button onClickFn={() => setFilterBy("all")} className={filterBy === "all" ? "active" : ""}>
          All
        </Button>
        <Button
          onClickFn={() => setFilterBy("weight")}
          className={filterBy === "weight" ? "active" : ""}
        >
          Weight
        </Button>
        <Button
          onClickFn={() => setFilterBy("waist")}
          className={filterBy === "waist" ? "active" : ""}
        >
          Waist
        </Button>
      </div>
      {isProgressBarShown && data.length > 1 && (
        <RangeControlBar
          data={data}
          rangeValues={rangeValues.map(value => Math.min(value, data.length - 1))}
          setRangeValues={setRangeValues}
        />
      )}
    </>
  );
};
