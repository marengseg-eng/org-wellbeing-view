import { cn } from "@/lib/utils";

interface AIHAData {
  probabilidade: number;
  severidade: number;
  classificacao: string;
}

interface AIHAMatrixProps {
  data: AIHAData;
  onChange?: (data: AIHAData) => void;
}

function getCellColor(risk: number): string {
  if (risk <= 3) return "bg-[hsl(140,60%,40%)]";
  if (risk <= 5) return "bg-[hsl(90,55%,50%)]";
  if (risk <= 10) return "bg-[hsl(45,95%,55%)]";
  if (risk <= 15) return "bg-[hsl(25,90%,55%)]";
  if (risk <= 20) return "bg-[hsl(0,75%,50%)]";
  return "bg-[hsl(0,80%,35%)]";
}

function getClassificacao(risk: number): string {
  if (risk <= 4) return "Conforme";
  if (risk <= 9) return "Atenção";
  if (risk <= 15) return "Elevado";
  return "Crítico";
}

const riskStyles: Record<string, string> = {
  Conforme: "bg-status-conforme/15 text-status-conforme border-status-conforme/30",
  "Atenção": "bg-status-atencao/15 text-status-atencao border-status-atencao/30",
  Elevado: "bg-status-elevado/15 text-status-elevado border-status-elevado/30",
  "Crítico": "bg-status-critico/15 text-status-critico border-status-critico/30",
};

export const AIHAMatrix = ({ data, onChange }: AIHAMatrixProps) => {
  const labels = ["1", "2", "3", "4", "5"];

  const handleCellClick = (prob: number, sev: number) => {
    if (!onChange) return;
    const risk = prob * sev;
    onChange({ probabilidade: prob, severidade: sev, classificacao: getClassificacao(risk) });
  };

  const risk = data.probabilidade && data.severidade ? data.probabilidade * data.severidade : 0;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <div className="max-w-[320px]">
          <div className="flex items-center justify-center mb-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
              Severidade →
            </span>
          </div>
          <div className="flex">
            <div className="flex flex-col items-center justify-center mr-0.5 w-4">
              <span
                className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Prob →
              </span>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-[28px_repeat(5,1fr)] gap-px mb-px">
                <div />
                {labels.map((s) => (
                  <div key={s} className="text-center text-[10px] font-bold text-muted-foreground py-0.5">{s}</div>
                ))}
              </div>
              {[...labels].reverse().map((pLabel) => {
                const p = Number(pLabel);
                return (
                  <div key={p} className="grid grid-cols-[28px_repeat(5,1fr)] gap-px mb-px">
                    <div className="flex items-center justify-center text-[10px] font-bold text-muted-foreground">{p}</div>
                    {labels.map((sLabel) => {
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
                            isSelected && "ring-2 ring-[hsl(222,47%,11%)] ring-offset-1 scale-110 shadow-[0_0_12px_hsl(152,60%,42%,0.5)] z-10"
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

      {risk > 0 && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">P:</span>
            <span className="text-sm font-bold">{data.probabilidade}</span>
          </div>
          <span className="text-muted-foreground">×</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">S:</span>
            <span className="text-sm font-bold">{data.severidade}</span>
          </div>
          <span className="text-muted-foreground">=</span>
          <span className="text-lg font-bold">{risk}</span>
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
