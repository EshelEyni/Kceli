import { FC } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { FoodItem } from "../../../../../shared/types/food";

type CaloriePieProps = {
  foodItems: FoodItem[];
};

export const CaloriePie: FC<CaloriePieProps> = ({ foodItems }) => {
  const totalCalories = 2250;
  const consumedCalories = foodItems.reduce((acc, curr) => acc + curr.calories, 0);
  const remainingCalories = {
    name: "remaining",
    calories: totalCalories - consumedCalories,
  };

  const pieData = [remainingCalories, ...foodItems].map(item => ({
    name: item.name,
    value: (item.calories / totalCalories) * 100, // Percentage of total calories
  }));

  // Colors for each section of the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <PieChart width={300} height={300}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={pieData}
        cx={120}
        cy={200}
        innerRadius={60}
        outerRadius={80}
      >
        {pieData.map((entry, index) => {
          const fill = entry.name === "remaining" ? "#a7a7a7" : COLORS[index % COLORS.length];
          return <Cell key={`cell-${index}`} fill={fill} />;
        })}
      </Pie>
      {/* <Legend /> */}
    </PieChart>
  );
};
