import { FC } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis } from "recharts";

type WeekCaloriesBarProps = {
  data: {
    calories: number;
    excessCalories: number;
    caloriesWithoutExcess: number;
    name: string;
  }[];
};

export const WeekCaloriesBar: FC<WeekCaloriesBarProps> = ({ data }) => {
  const maxVal = data.reduce((acc, curr) => (curr.calories > acc ? curr.calories : acc), -Infinity);
  const yAxisDomain = [0, Math.round(maxVal * 1.1)];
  return (
    <div style={{ width: "100%", maxWidth: 1200, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          <Bar dataKey="caloriesWithoutExcess" stackId="a" fill="#005FB3" barSize={50} />
          <Bar dataKey="excessCalories" stackId="a" fill="#FF0000" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
