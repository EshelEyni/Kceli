import { FC } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Intake } from "../../../../../shared/types/intake";
import { CHART_COLORS } from "../../../services/util/utilService";

type CaloriePieProps = {
  intakes: Intake[];
  remainingCalories: number;
};

export const CaloriePie: FC<CaloriePieProps> = ({ intakes, remainingCalories }) => {
  const pieData = [
    ...intakes.map(i => ({
      name: i.items.reduce((acc, curr, i, arr) => {
        if (arr.length === 1) return curr.name;
        if (i === 0) return acc + `${curr.name}, `;
        if (i === arr.length - 1) return acc + `and ${curr.name}`;
        return acc + ` ${curr.name}, `;
      }, ""),
      value: i.items.reduce((acc, curr) => acc + curr.calories, 0),
    })),
    {
      name: "remaining",
      value: remainingCalories,
    },
  ];

  if (remainingCalories <= 0) pieData.pop();

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
          const fill =
            entry.name === "remaining" ? "#a7a7a7" : CHART_COLORS[index % CHART_COLORS.length];
          return <Cell key={`cell-${index}`} fill={fill} />;
        })}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};
