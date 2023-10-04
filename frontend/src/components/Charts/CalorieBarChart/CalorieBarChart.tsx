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
import { Intake } from "../../../../../shared/types/intake";
import { CHART_COLORS } from "../../../services/util/utilService";

type CalorieBarProps = {
  intakes: Intake[];
};

export const CalorieBar: FC<CalorieBarProps> = ({ intakes }) => {
  const sortedIntakes = intakes.sort((a, b) => {
    const aRecordedAt = new Date(a.recordedAt as any as string).getTime();
    const bRecordedAt = new Date(b.recordedAt as any as string).getTime();
    return aRecordedAt - bRecordedAt;
  });
  const barData = sortedIntakes.map(i => ({
    name: i.items.reduce((acc, curr, i, arr) => {
      if (arr.length === 1) return curr.name;
      if (i === 0) return acc + `${curr.name}, `;
      if (i === arr.length - 1) return acc + `and ${curr.name}`;
      return acc + ` ${curr.name}, `;
    }, ""),
    calories: i.items.reduce((acc, curr) => acc + curr.calories, 0),
  }));

  return (
    <div style={{ width: "100%", maxWidth: 1200, height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" barSize={25}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
