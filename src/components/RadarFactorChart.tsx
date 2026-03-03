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
        <PolarGrid stroke="hsl(214, 20%, 88%)" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "hsl(215, 16%, 47%)" }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "hsl(215, 16%, 47%)" }}
        />
        <Radar
          name="Resultado"
          dataKey="value"
          stroke="hsl(222, 60%, 18%)"
          fill="hsl(222, 60%, 18%)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Resultado"]}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid hsl(214, 20%, 88%)",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
