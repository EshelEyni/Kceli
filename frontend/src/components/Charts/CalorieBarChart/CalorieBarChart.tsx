import { CSSProperties, FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CHART_COLORS } from "../../../services/util/utilService";
import { useMediaQuery } from "react-responsive";

type CalorieBarProps = {
  data: {
    calories: number;
    name: string;
  }[];
};

export const CalorieBar: FC<CalorieBarProps> = ({ data }) => {
  const maxVal = data.reduce((acc, curr) => (curr.calories > acc ? curr.calories : acc), -Infinity);
  const yAxisDomain = [0, Math.round(maxVal * 1.1)];
  const isSmallScreen = useMediaQuery({ query: "(max-width: 600px)" });
  const windowWidth = window.innerWidth;
  const position = { x: Math.round(windowWidth * 0.65) * 0.5 * -1, y: 0 };
  const wrapperStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "25%",
    transform: "translate(-50%, -50%)",
    wordBreak: "break-all",
    width: windowWidth * 0.65,
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 1200, height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={yAxisDomain} />
          <Tooltip
            wrapperStyle={isSmallScreen ? wrapperStyle : undefined}
            labelStyle={{ fontSize: 14, fontWeight: "bold", whiteSpace: "pre-wrap" }}
            position={isSmallScreen ? position : undefined}
          />
          <Bar dataKey="calories" barSize={25}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
