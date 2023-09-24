import { FC } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Intake } from "../../../../../shared/types/intake";

type CaloriePieProps = {
  intakes: Intake[];
  remainingCalories: number;
};

export const CaloriePie: FC<CaloriePieProps> = ({ intakes, remainingCalories }) => {
  const pieData = [
    {
      name: "intakes",
      value: intakes.reduce(
        (acc, curr) => acc + curr.items.reduce((acc, curr) => acc + curr.calories, 0),
        0
      ),
    },
    {
      name: "remaining",
      value: remainingCalories,
    },
  ];

  // Colors for each section of the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <PieChart width={300} height={300}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={pieData}
        cx={150}
        cy={150}
        innerRadius={60}
        outerRadius={80}
      >
        {pieData.map((entry, index) => {
          const fill = entry.name === "remaining" ? "#a7a7a7" : COLORS[index % COLORS.length];
          return <Cell key={`cell-${index}`} fill={fill} />;
        })}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};
