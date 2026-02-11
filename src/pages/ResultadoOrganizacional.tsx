import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { FactorChart } from "@/components/FactorChart";
import { AIHAMatrix } from "@/components/AIHAMatrix";
import { Activity, BarChart3, Shield, TrendingUp, UserCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const FACTORS = [
  { key: "carga", label: "Carga e Ritmo de Trabalho" },
  { key: "jornada", label: "Jornada e Organização do Tempo" },
  { key: "autonomia", label: "Autonomia e Controle" },
  { key: "exigencias", label: "Exigências Cognitivas e Emocionais" },
  { key: "comunicacao", label: "Comunicação, Ambiente e Liderança" },
] as const;

type FactorKey = (typeof FACTORS)[number]["key"];
type ClassificacaoGeral = "Conforme" | "Atenção" | "Crítico" | "";

const classificacaoColors: Record<string, string> = {
  Conforme: "border-status-conforme/40 shadow-[0_0_20px_hsl(152,60%,42%,0.1)]",
  "Atenção": "border-status-atencao/40 shadow-[0_0_20px_hsl(38,92%,50%,0.1)]",
  "Crítico": "border-status-critico/40 shadow-[0_0_20px_hsl(0,72%,51%,0.1)]",
};

const indiceTextColor: Record<string, string> = {
  Conforme: "text-status-conforme",
  "Atenção": "text-status-atencao",
  "Crítico": "text-status-critico",
};

const getClassificacaoAutomatica = (value: number): ClassificacaoGeral => {
  if (value <= 40) return "Conforme";
  if (value <= 60) return "Atenção";
  return "Crítico";
};

const ResultadoOrganizacional = () => {
  const [numEntrevistados, setNumEntrevistados] = useState<number | "">(""  );
  const [factors, setFactors] = useState<Record<FactorKey, number>>({
    carga: 0,
    jornada: 0,
    autonomia: 0,
    exigencias: 0,
    comunicacao: 0,
  });

  const [classificacaoTecnica, setClassificacaoTecnica] = useState<ClassificacaoGeral>("");
  const [aiha, setAiha] = useState({
    probabilidade: 0,
    severidade: 0,
    classificacao: "",
  });

  const indiceGeral = useMemo(() => {
    const values = Object.values(factors);
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10;
  }, [factors]);

  const classificacaoAutomatica = useMemo(
    () => getClassificacaoAutomatica(indiceGeral),
    [indiceGeral]
  );

  // Classificação efetiva: técnica (manual) se definida, senão automática
  const classificacaoEfetiva = classificacaoTecnica || classificacaoAutomatica;

  const chartData = FACTORS.map((f) => ({
    name: f.label,
    value: factors[f.key],
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Resultado Organizacional Consolidado
              </h1>
              <p className="text-sm text-muted-foreground">
                Avaliação Psicossocial — Visão Executiva
              </p>
            </div>
          </div>
          {numEntrevistados !== "" && numEntrevistados > 0 && (
            <p className="mt-3 text-sm text-muted-foreground italic">
              Avaliação baseada em entrevistas individualizadas com{" "}
              <span className="font-semibold text-foreground">{numEntrevistados}</span>{" "}
              colaboradores.
            </p>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Número de Entrevistados */}
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <Label className="text-sm text-muted-foreground whitespace-nowrap">
            Número de Entrevistados
          </Label>
          <Input
            type="number"
            min={1}
            value={numEntrevistados}
            onChange={(e) =>
              setNumEntrevistados(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="bg-background w-32"
            placeholder="Ex: 50"
            required
          />
        </div>

        {/* Top stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Índice Geral Card */}
          <Card
            className={cn(
              "border-2 transition-all duration-300",
              classificacaoEfetiva ? classificacaoColors[classificacaoEfetiva] : ""
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Índice Geral Psicossocial (automático)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <span
                  className={cn(
                    "text-4xl font-bold",
                    classificacaoEfetiva
                      ? indiceTextColor[classificacaoEfetiva]
                      : "text-muted-foreground"
                  )}
                >
                  {indiceGeral}%
                </span>
              </div>
              <div className="mt-3">
                <StatusBadge status={classificacaoAutomatica} />
                <span className="ml-2 text-xs text-muted-foreground">Classificação automática</span>
              </div>
            </CardContent>
          </Card>

          {/* Classificação Técnica Final Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-muted-foreground">
                <UserCheck className="h-4 w-4" />
                Classificação Técnica Final
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Ajuste manual pelo avaliador, se necessário
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={classificacaoTecnica}
                onValueChange={(v) => setClassificacaoTecnica(v as ClassificacaoGeral)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Usar classificação automática" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="Atenção">Atenção</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
              <StatusBadge status={classificacaoEfetiva} />
            </CardContent>
          </Card>
        </div>

        {/* Factors input + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Factor inputs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Fatores Psicossociais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {FACTORS.map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">
                    {f.label} (%)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={factors[f.key] || ""}
                    onChange={(e) =>
                      setFactors((prev) => ({
                        ...prev,
                        [f.key]: Number(e.target.value),
                      }))
                    }
                    className="bg-background"
                    placeholder="0–100"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Visão Geral dos Fatores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FactorChart factors={chartData} />
            </CardContent>
          </Card>
        </div>

        {/* AIHA Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Matriz AIHA — Avaliação de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AIHAMatrix data={aiha} onChange={setAiha} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResultadoOrganizacional;
