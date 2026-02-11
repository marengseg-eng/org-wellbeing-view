import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Factor {
  name: string;
  value: number;
}

const getBarColor = (value: number) => {
  if (value <= 30) return "hsl(152, 60%, 42%)";
  if (value <= 60) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
};

export const FactorChart = ({ factors }: { factors: Factor[] }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={factors}
        margin={{ top: 10, right: 10, left: -10, bottom: 60 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={80}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "hsl(215, 16%, 47%)" }}
          unit="%"
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Resultado"]}
          contentStyle={{
            backgroundColor: "hsl(0, 0%, 100%)",
            border: "1px solid hsl(214, 20%, 88%)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50}>
          {factors.map((entry, index) => (
            <Cell key={index} fill={getBarColor(entry.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
