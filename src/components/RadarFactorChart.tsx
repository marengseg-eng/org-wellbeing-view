import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Factor {
  name: string;
  value: number;
  fullMark?: number;
}

export const RadarFactorChart = ({ factors }: { factors: Factor[] }) => {
  const data = factors.map((f) => ({
    ...f,
    fullMark: f.fullMark ?? 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="hsl(217, 33%, 25%)" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "hsl(215, 20%, 65%)" }}
        />
        <Radar
          name="Resultado"
          dataKey="value"
          stroke="hsl(200, 80%, 55%)"
          fill="hsl(200, 80%, 55%)"
          fillOpacity={0.3}
          strokeWidth={2}
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
      </RadarChart>
    </ResponsiveContainer>
  );
};
