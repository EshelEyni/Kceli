import { FC, useState } from "react";
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

  const [startIndex, endIndex] = rangeValues;
  const isWeightLineShown = filterBy === "all" || filterBy === "weight";
  const isWaistLineShown = filterBy === "all" || filterBy === "waist";
  if (!data) return null;

  const formattedData = data
    .map(item => ({
      ...item,
      date: new Intl.DateTimeFormat("en-GB", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      }).format(new Date(item.date)),
    }))
    .slice(startIndex, endIndex + 1);

  const minWeight = data.reduce((acc, curr) => (curr.weight < acc ? curr.weight : acc), Infinity);
  const maxWeight = data.reduce((acc, curr) => (curr.weight > acc ? curr.weight : acc), -Infinity);

  const yAxisDomain = [minWeight, maxWeight];

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
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              display: "flex",
            }}
          >
            <CartesianGrid strokeDasharray="4 1" />
            <XAxis dataKey="date" />
            <YAxis domain={yAxisDomain} />
            <Tooltip />
            <Legend />
            {isWeightLineShown && <Line type="monotone" dataKey="weight" stroke="#ab1010" />}
            {isWaistLineShown && <Line type="monotone" dataKey="waist" stroke="#6543ff" />}
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
        <RangeControlBar data={data} rangeValues={rangeValues} setRangeValues={setRangeValues} />
      )}
    </>
  );
};
