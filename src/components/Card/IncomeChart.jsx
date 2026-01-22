import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IncomeChart = ({ data }) => {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="chart-box">
      <h3 style={{ paddingBottom: "20px" }}>
        Weekly Income (Mon – Sun)
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Line
            type="monotone"
            dataKey="amount"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
