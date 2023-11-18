import { FC } from "react";
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

type CalorieBarProps = {
  data: {
    calories: number;
    name: string;
  }[];
};

export const CalorieBar: FC<CalorieBarProps> = ({ data }) => {
  const maxVal = data.reduce((acc, curr) => (curr.calories > acc ? curr.calories : acc), -Infinity);
  const yAxisDomain = [0, Math.round(maxVal * 1.1)];

  return (
    <div style={{ width: "100%", maxWidth: 1200, height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
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
