import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AIHAData {
  probabilidade: number;
  severidade: number;
  classificacao: string;
}

const riskStyles: Record<string, string> = {
  Baixo: "bg-risk-baixo/15 text-risk-baixo border-risk-baixo/30",
  Moderado: "bg-risk-moderado/15 text-risk-moderado border-risk-moderado/30",
  Alto: "bg-risk-alto/15 text-risk-alto border-risk-alto/30",
  "Crítico": "bg-risk-critico/15 text-risk-critico border-risk-critico/30",
};

interface AIHAMatrixProps {
  data: AIHAData;
  onChange?: (data: AIHAData) => void;
}

// Risk value = P × S
// Color mapping based on risk value
function getCellColor(risk: number): string {
  if (risk <= 3) return "bg-[hsl(140,60%,40%)]"; // verde escuro
  if (risk <= 5) return "bg-[hsl(90,55%,50%)]";  // verde claro
  if (risk <= 10) return "bg-[hsl(45,95%,55%)]";  // amarelo
  if (risk <= 15) return "bg-[hsl(25,90%,55%)]";  // laranja
  if (risk <= 20) return "bg-[hsl(0,75%,50%)]";   // vermelho
  return "bg-[hsl(0,80%,35%)]";                    // vermelho escuro
}

function getClassificacao(risk: number): string {
  if (risk <= 3) return "Baixo";
  if (risk <= 5) return "Baixo";
  if (risk <= 10) return "Moderado";
  if (risk <= 15) return "Alto";
  return "Crítico";
}

export const AIHAMatrix = ({ data, onChange }: AIHAMatrixProps) => {
  const probLabels = ["1", "2", "3", "4", "5"];
  const sevLabels = ["1", "2", "3", "4", "5"];

  const handleCellClick = (prob: number, sev: number) => {
    if (!onChange) return;
    const risk = prob * sev;
    onChange({
      probabilidade: prob,
      severidade: sev,
      classificacao: getClassificacao(risk),
    });
  };

  const risk = data.probabilidade && data.severidade ? data.probabilidade * data.severidade : 0;

  return (
    <div className="space-y-3">
      {/* Matrix grid */}
      <div className="overflow-x-auto">
        <div className="max-w-[280px]">
          {/* Header: Severidade label */}
          <div className="flex items-center justify-center mb-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
              Severidade →
            </span>
          </div>
          <div className="flex">
            {/* Y-axis label */}
            <div className="flex flex-col items-center justify-center mr-0.5 w-4">
              <span
                className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Prob →
              </span>
            </div>

            <div className="flex-1">
              {/* Column headers */}
              <div className="grid grid-cols-[28px_repeat(5,1fr)] gap-px mb-px">
                <div /> {/* empty corner */}
                {sevLabels.map((s) => (
                  <div key={s} className="text-center text-[10px] font-bold text-muted-foreground py-0.5">
                    {s}
                  </div>
                ))}
              </div>

              {/* Rows (probability 5 at top, 1 at bottom) */}
              {[...probLabels].reverse().map((pLabel) => {
                const p = Number(pLabel);
                return (
                  <div key={p} className="grid grid-cols-[28px_repeat(5,1fr)] gap-px mb-px">
                    {/* Row label */}
                    <div className="flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      {p}
                    </div>
                    {sevLabels.map((sLabel) => {
                      const s = Number(sLabel);
                      const cellRisk = p * s;
                      const isSelected = data.probabilidade === p && data.severidade === s;
                      return (
                        <button
                          key={`${p}-${s}`}
                          type="button"
                          onClick={() => handleCellClick(p, s)}
                          className={cn(
                            "relative aspect-square rounded flex items-center justify-center text-[10px] font-bold text-white transition-all cursor-pointer hover:scale-105",
                            getCellColor(cellRisk),
                            isSelected && "ring-2 ring-foreground ring-offset-1 scale-110 shadow-md z-10"
                          )}
                          title={`P=${p} × S=${s} = ${cellRisk}`}
                        >
                          {cellRisk}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Result below */}
      {risk > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Probabilidade:</span>
            <span className="text-sm font-bold">{data.probabilidade}</span>
          </div>
          <span className="text-muted-foreground">×</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Severidade:</span>
            <span className="text-sm font-bold">{data.severidade}</span>
          </div>
          <span className="text-muted-foreground">=</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Risco:</span>
            <span className="text-sm font-bold">{risk}</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold",
              riskStyles[data.classificacao]
            )}
          >
            {data.classificacao}
          </span>
        </div>
      )}
    </div>
  );
};
