import { FC } from "react";
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
import { useGetUserDailyStats } from "../../../hooks/useGetUserDailyStats";
import { SpinnerLoader } from "../../Loaders/SpinnerLoader/SpinnerLoader";
import { ErrorMsg } from "../../Msg/ErrorMsg/ErrorMsg";

export const WeightWaistChart: FC = () => {
  const { userDailyStats, isLoading, isSuccess, isError } = useGetUserDailyStats();

  if (isLoading) return <SpinnerLoader />;
  if (isError) return <ErrorMsg />;
  if (!isSuccess || !userDailyStats) return null;

  const formattedData = userDailyStats.map(item => ({
    ...item,
    date: new Intl.DateTimeFormat("en-GB", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }).format(new Date(item.date)),
  }));

  return (
    <div style={{ width: "100%", maxWidth: 1200, height: 300 }}>
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="weight" stroke="#ab1010" />
          <Line type="monotone" dataKey="waist" stroke="#6543ff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
