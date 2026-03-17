import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Acao5W2H {
  id: string;
  what: string;       // O quê
  why: string;        // Por quê
  where: string;      // Onde
  when: string;       // Quando
  who: string;        // Quem
  how: string;        // Como
  howMuch: string;    // Quanto custa
  status: "pendente" | "em_andamento" | "concluida";
}

const emptyAcao = (): Acao5W2H => ({
  id: crypto.randomUUID(),
  what: "",
  why: "",
  where: "",
  when: "",
  who: "",
  how: "",
  howMuch: "",
  status: "pendente",
});

const statusLabels: Record<Acao5W2H["status"], string> = {
  pendente: "Pendente",
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

const statusColors: Record<Acao5W2H["status"], string> = {
  pendente: "bg-status-atencao/20 text-status-atencao border-status-atencao/30",
  em_andamento: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  concluida: "bg-status-conforme/20 text-status-conforme border-status-conforme/30",
};

interface Plano5W2HProps {
  acoes: Acao5W2H[];
  onChange: (acoes: Acao5W2H[]) => void;
}

export const Plano5W2H = ({ acoes, onChange }: Plano5W2HProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addAcao = () => {
    const nova = emptyAcao();
    onChange([...acoes, nova]);
    setExpandedId(nova.id);
  };

  const removeAcao = (id: string) => {
    onChange(acoes.filter((a) => a.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const updateAcao = (id: string, field: keyof Acao5W2H, value: string) => {
    onChange(acoes.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const fields: { key: keyof Acao5W2H; label: string; shortLabel: string; placeholder: string; type: "input" | "textarea" }[] = [
    { key: "what", label: "O quê? (What)", shortLabel: "O quê", placeholder: "Descreva a ação a ser realizada...", type: "textarea" },
    { key: "why", label: "Por quê? (Why)", shortLabel: "Por quê", placeholder: "Justificativa da ação...", type: "input" },
    { key: "where", label: "Onde? (Where)", shortLabel: "Onde", placeholder: "Local de execução...", type: "input" },
    { key: "when", label: "Quando? (When)", shortLabel: "Quando", placeholder: "Prazo / data limite...", type: "input" },
    { key: "who", label: "Quem? (Who)", shortLabel: "Quem", placeholder: "Responsável pela ação...", type: "input" },
    { key: "how", label: "Como? (How)", shortLabel: "Como", placeholder: "Método / procedimento...", type: "textarea" },
    { key: "howMuch", label: "Quanto custa? (How much)", shortLabel: "Custo", placeholder: "Investimento estimado...", type: "input" },
  ];

  return (
    <div className="space-y-3">
      {acoes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nenhuma ação cadastrada. Clique em <strong>"+ Ação"</strong> para adicionar.
        </div>
      )}

      {acoes.map((acao, index) => {
        const isExpanded = expandedId === acao.id;
        return (
          <div
            key={acao.id}
            className={cn(
              "border rounded-lg bg-card transition-all",
              isExpanded ? "shadow-md" : "shadow-sm"
            )}
          >
            {/* Header row */}
            <button
              type="button"
              onClick={() => toggleExpand(acao.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors rounded-t-lg"
            >
              <span className="text-xs font-bold text-muted-foreground min-w-[28px]">
                #{index + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-foreground truncate">
                {acao.what || <span className="text-muted-foreground italic">Ação sem descrição</span>}
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  statusColors[acao.status]
                )}
              >
                {statusLabels[acao.status]}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {fields.map((f) => (
                    <div key={f.key} className={cn("space-y-1", f.type === "textarea" && "col-span-2")}>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {f.label}
                      </label>
                      {f.type === "textarea" ? (
                        <Textarea
                          value={acao[f.key] as string}
                          onChange={(e) => updateAcao(acao.id, f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="text-sm bg-card border-border min-h-[60px] resize-none"
                        />
                      ) : (
                        <Input
                          value={acao[f.key] as string}
                          onChange={(e) => updateAcao(acao.id, f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="h-8 text-sm bg-card border-border"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </label>
                    <Select
                      value={acao.status}
                      onValueChange={(v) => updateAcao(acao.id, "status", v)}
                    >
                      <SelectTrigger className="h-8 text-xs bg-card border-border w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAcao(acao.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 text-xs gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addAcao}
        className="print:hidden gap-1.5 w-full"
      >
        <Plus className="h-4 w-4" />
        Adicionar Ação
      </Button>
    </div>
  );
};
