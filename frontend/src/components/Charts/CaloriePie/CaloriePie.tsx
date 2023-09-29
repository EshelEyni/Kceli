import { FC } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Intake } from "../../../../../shared/types/intake";

type CaloriePieProps = {
  intakes: Intake[];
  remainingCalories: number;
};

export const CaloriePie: FC<CaloriePieProps> = ({ intakes, remainingCalories }) => {
  const pieData = [
    ...intakes.map(i => ({
      name: i.name || "unnamed",
      value: i.items.reduce((acc, curr) => acc + curr.calories, 0),
    })),
    {
      name: "remaining",
      value: remainingCalories,
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF5733",
    "#33FF57",
    "#8333FF",
    "#FF33A1",
    "#33A4FF",
    "#FF8333",
    "#33FFA1",
    "#A133FF",
  ];

  return (
    <PieChart width={250} height={250}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={pieData}
        cx={125}
        cy={125}
        innerRadius={80}
        outerRadius={110}
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
