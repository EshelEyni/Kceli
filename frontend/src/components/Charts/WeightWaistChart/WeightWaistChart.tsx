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

type WeightWaistChartProps = {
  data: {
    date: string | Date | number;
    weight: number;
    waist: number;
  }[];
};

export const WeightWaistChart: FC<WeightWaistChartProps> = ({ data }) => {
  const [filterBy, setFilterBy] = useState<"all" | "weight" | "waist">("weight");
  const isWeightLineShown = filterBy === "all" || filterBy === "weight";
  const isWaistLineShown = filterBy === "all" || filterBy === "waist";
  if (!data) return null;

  const formattedData = data.map(item => ({
    ...item,
    date: new Intl.DateTimeFormat("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }).format(new Date(item.date)),
  }));

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
    </>
  );
};
