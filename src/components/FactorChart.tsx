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
  if (value <= 30) return "hsl(152, 60%, 50%)";
  if (value <= 60) return "hsl(38, 92%, 55%)";
  return "hsl(0, 72%, 55%)";
};

export const FactorChart = ({ factors }: { factors: Factor[] }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={factors}
        margin={{ top: 10, right: 10, left: -10, bottom: 60 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 25%)" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }}
          angle={-35}
          textAnchor="end"
          interval={0}
          height={80}
          stroke="hsl(217, 33%, 25%)"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: "hsl(215, 20%, 65%)" }}
          unit="%"
          stroke="hsl(217, 33%, 25%)"
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Resultado"]}
          contentStyle={{
            backgroundColor: "hsl(222, 47%, 12%)",
            border: "1px solid hsl(217, 33%, 25%)",
            borderRadius: "8px",
            fontSize: "13px",
            color: "hsl(210, 40%, 90%)",
          }}
          labelStyle={{ color: "hsl(210, 40%, 80%)" }}
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
