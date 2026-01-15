import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* 🎨 Custom Date Tick */
const CustomDateTick = ({ x, y, payload }) => {
  const date = new Date(payload.value);

  const day = date.toLocaleDateString("en-IN", {
    weekday: "short",
  });

  const dateOnly = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  return (
    <g transform={`translate(${x},${y + 10})`}>
      <rect
        x={-30}
        y={0}
        rx={6}
        ry={6}
        width={60}
        height={36}
        fill="#f4f4f5"
      />
      <text
        x={0}
        y={14}
        textAnchor="middle"
        fontSize="11"
        fill="#111"
        fontWeight="600"
      >
        {dateOnly}
      </text>
      <text
        x={0}
        y={28}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
      >
        {day}
      </text>
    </g>
  );
};

const IncomeChart = ({ data }) => {
  return (
    <div className="chart-box">
      <h3 style={{paddingBottom:"30px"}}>Last 7 Days Income</h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <XAxis
            dataKey="_id"
            tick={<CustomDateTick />}
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
