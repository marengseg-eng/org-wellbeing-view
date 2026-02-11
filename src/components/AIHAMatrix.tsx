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
  onChange: (data: AIHAData) => void;
}

export const AIHAMatrix = ({ data, onChange }: AIHAMatrixProps) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Probabilidade (1–5)
          </Label>
          <Input
            type="number"
            min={1}
            max={5}
            value={data.probabilidade || ""}
            onChange={(e) =>
              onChange({ ...data, probabilidade: Number(e.target.value) })
            }
            className="bg-background"
            placeholder="1–5"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">
            Severidade (1–5)
          </Label>
          <Input
            type="number"
            min={1}
            max={5}
            value={data.severidade || ""}
            onChange={(e) =>
              onChange({ ...data, severidade: Number(e.target.value) })
            }
            className="bg-background"
            placeholder="1–5"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Classificação do Risco
        </Label>
        <Select
          value={data.classificacao}
          onValueChange={(value) => onChange({ ...data, classificacao: value })}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione a classificação" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="Baixo">Baixo</SelectItem>
            <SelectItem value="Moderado">Moderado</SelectItem>
            <SelectItem value="Alto">Alto</SelectItem>
            <SelectItem value="Crítico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.classificacao && (
        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm text-muted-foreground">Risco:</span>
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
