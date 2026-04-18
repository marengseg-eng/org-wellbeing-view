import React, { useState, useMemo, useCallback } from "react";
import logoLbm from "@/assets/logo-lbm.jpg";
import {
  Sun, Moon, Save, Download, RotateCcw,
  ChevronDown, ChevronUp, CheckCircle2, XCircle, MinusCircle, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";
import { CHECKLIST_ITEMS_TEMPLATE, CHECKLIST_CATEGORIAS } from "@/data/checklistSSTData";

/* ===== TYPES ===== */

export type ItemStatus = "conforme" | "nao_conforme" | "nao_aplicavel" | "pendente";

export interface ChecklistItem {
  id: string;
  categoria: string;
  descricao: string;
  norma: string;
  status: ItemStatus;
  observacao: string;
}

export interface ChecklistItemTemplate {
  id: string;
  categoria: string;
  descricao: string;
  norma: string;
}

export interface ChecklistSession {
  empresa: string;
  responsavel: string;
  dataInspecao: string;
  setor: string;
  items: ChecklistItem[];
  savedAt: string;
}

/* ===== STORAGE HELPERS ===== */

const STORAGE_PREFIX = "checklist_sst_";

const makeStorageKey = (empresa: string, setor: string) => {
  const e = empresa.trim().toLowerCase().replace(/\s+/g, "_");
  const s = setor.trim().toLowerCase().replace(/\s+/g, "_");
  return `${STORAGE_PREFIX}${e}${s ? `__${s}` : ""}`;
};

const getInitialItems = (): ChecklistItem[] =>
  CHECKLIST_ITEMS_TEMPLATE.map((t) => ({ ...t, status: "pendente" as ItemStatus, observacao: "" }));

/* ===== STATUS CONFIG ===== */

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  borderColor: string;
  bgStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
  buttonActiveStyle: React.CSSProperties;
  buttonInactiveClass: string;
}

const STATUS_CONFIG: Record<ItemStatus, StatusConfig> = {
  conforme: {
    label: "Conforme",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    borderColor: "hsl(152,60%,42%)",
    bgStyle: { background: "hsla(152,60%,42%,0.08)" },
    textStyle: { color: "hsl(152,60%,42%)" },
    buttonActiveStyle: { background: "hsla(152,60%,42%,0.2)", color: "hsl(152,60%,42%)", borderColor: "hsla(152,60%,42%,0.4)" },
    buttonInactiveClass: "border-border text-muted-foreground hover:border-[hsl(152,60%,42%)] hover:text-[hsl(152,60%,42%)]",
  },
  nao_conforme: {
    label: "Não Conforme",
    icon: <XCircle className="h-3.5 w-3.5" />,
    borderColor: "hsl(0,72%,51%)",
    bgStyle: { background: "hsla(0,72%,51%,0.08)" },
    textStyle: { color: "hsl(0,72%,51%)" },
    buttonActiveStyle: { background: "hsla(0,72%,51%,0.2)", color: "hsl(0,72%,51%)", borderColor: "hsla(0,72%,51%,0.4)" },
    buttonInactiveClass: "border-border text-muted-foreground hover:border-[hsl(0,72%,51%)] hover:text-[hsl(0,72%,51%)]",
  },
  nao_aplicavel: {
    label: "N/A",
    icon: <MinusCircle className="h-3.5 w-3.5" />,
    borderColor: "hsl(215,20%,40%)",
    bgStyle: { background: "hsla(215,20%,40%,0.06)" },
    textStyle: { color: "hsl(215,20%,60%)" },
    buttonActiveStyle: { background: "hsla(215,20%,40%,0.2)", color: "hsl(215,20%,60%)", borderColor: "hsla(215,20%,40%,0.4)" },
    buttonInactiveClass: "border-border text-muted-foreground hover:border-muted-foreground",
  },
  pendente: {
    label: "Pendente",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    borderColor: "hsl(45,93%,47%)",
    bgStyle: {},
    textStyle: { color: "hsl(45,93%,47%)" },
    buttonActiveStyle: {},
    buttonInactiveClass: "",
  },
};

/* ===== CHECKLIST ITEM ROW ===== */

interface ChecklistItemRowProps {
  item: ChecklistItem;
  isDark: boolean;
  onStatusChange: (id: string, status: ItemStatus) => void;
  onObservacaoChange: (id: string, obs: string) => void;
}

const ChecklistItemRow = React.memo(({ item, isDark, onStatusChange, onObservacaoChange }: ChecklistItemRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[item.status];
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const borderBase = isDark ? "#1e293b" : "#e2e8f0";
  const textMain = isDark ? "#e2e8f0" : "#1e293b";
  const textMuted = isDark ? "#64748b" : "#94a3b8";

  const STATUS_BUTTONS: { status: ItemStatus; label: string; icon: React.ReactNode }[] = [
    { status: "conforme", label: "Conforme", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    { status: "nao_conforme", label: "Não Conforme", icon: <XCircle className="h-3.5 w-3.5" /> },
    { status: "nao_aplicavel", label: "N/A", icon: <MinusCircle className="h-3.5 w-3.5" /> },
  ];

  return (
    <div
      className="rounded-lg overflow-hidden transition-all duration-200"
      style={{
        background: item.status !== "pendente" ? config.bgStyle.background : (isDark ? "hsla(215,30%,10%,0.5)" : "#f8fafc"),
        border: `1px solid ${borderBase}`,
        borderLeft: `4px solid ${config.borderColor}`,
      }}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* NR badge */}
        <span
          className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: isDark ? "#1e293b" : "#e2e8f0", color: textMuted, whiteSpace: "nowrap" }}
        >
          {item.norma}
        </span>

        {/* Description */}
        <p className="flex-1 text-sm leading-snug" style={{ color: textMain }}>
          {item.descricao}
        </p>

        {/* Status buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {STATUS_BUTTONS.map((btn) => {
            const isActive = item.status === btn.status;
            const btnConfig = STATUS_CONFIG[btn.status];
            return (
              <button
                key={btn.status}
                onClick={() => onStatusChange(item.id, btn.status)}
                title={btn.label}
                className={cn(
                  "flex items-center gap-1 rounded border px-2 py-1 text-[11px] font-semibold transition-all duration-150",
                  isActive ? "" : btnConfig.buttonInactiveClass
                )}
                style={isActive ? btnConfig.buttonActiveStyle : undefined}
              >
                {btn.icon}
                <span className="hidden sm:inline">{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 rounded p-1 transition-colors hover:bg-white/10"
          title={expanded ? "Recolher observação" : "Adicionar observação"}
          style={{ color: textMuted }}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded observacao */}
      {expanded && (
        <div className="px-4 pb-3">
          <Separator className="mb-3" style={{ background: borderBase }} />
          <Label className="text-xs mb-1 block" style={{ color: textMuted }}>Observação / Evidência</Label>
          <Textarea
            value={item.observacao}
            onChange={(e) => onObservacaoChange(item.id, e.target.value)}
            placeholder="Descreva a evidência, número do documento, responsável, prazo..."
            rows={2}
            className="text-sm resize-none"
            style={{
              background: isDark ? "#0b1120" : "#f1f5f9",
              borderColor: borderBase,
              color: textMain,
            }}
          />
        </div>
      )}
    </div>
  );
});

ChecklistItemRow.displayName = "ChecklistItemRow";

/* ===== SUMMARY CARD ===== */

interface SummaryCardProps {
  label: string;
  value: number;
  total?: number;
  accentColor?: string;
  isDark: boolean;
}

const SummaryCard = ({ label, value, total, accentColor, isDark }: SummaryCardProps) => (
  <div
    className="rounded-lg px-4 py-3 flex flex-col gap-1"
    style={{ background: isDark ? "#0f172a" : "#ffffff", border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}` }}
  >
    <span className="text-xs font-medium" style={{ color: isDark ? "#64748b" : "#94a3b8" }}>{label}</span>
    <span className="text-2xl font-bold" style={{ color: accentColor ?? (isDark ? "#e2e8f0" : "#1e293b") }}>
      {value}
      {total !== undefined && <span className="text-sm font-normal" style={{ color: isDark ? "#475569" : "#94a3b8" }}>/{total}</span>}
    </span>
  </div>
);

/* ===== MAIN COMPONENT ===== */

const ChecklistSST = () => {
  const [empresa, setEmpresa] = useState("Boratti");
  const [responsavel, setResponsavel] = useState("");
  const [dataInspecao, setDataInspecao] = useState(new Date().toISOString().split("T")[0]);
  const [setor, setSetor] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>(getInitialItems);
  const [activeTab, setActiveTab] = useState("Todos");
  const [isDark, setIsDark] = useState(true);

  /* ===== METRICS ===== */

  const conformeCount = useMemo(() => items.filter((i) => i.status === "conforme").length, [items]);
  const naoConformeCount = useMemo(() => items.filter((i) => i.status === "nao_conforme").length, [items]);
  const naCount = useMemo(() => items.filter((i) => i.status === "nao_aplicavel").length, [items]);
  const pendingCount = useMemo(() => items.filter((i) => i.status === "pendente").length, [items]);
  const totalItems = items.length;
  const applicableItems = totalItems - naCount;
  const compliancePct = useMemo(
    () => (applicableItems > 0 ? Math.round((conformeCount / applicableItems) * 100) : 0),
    [conformeCount, applicableItems]
  );

  const progressColor =
    compliancePct >= 80 ? "hsl(152,60%,42%)" : compliancePct >= 60 ? "hsl(45,93%,47%)" : "hsl(0,72%,51%)";

  const filteredItems = useMemo(
    () => (activeTab === "Todos" ? items : items.filter((i) => i.categoria === activeTab)),
    [items, activeTab]
  );

  /* ===== CALLBACKS ===== */

  const handleStatusChange = useCallback((id: string, status: ItemStatus) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const handleObservacaoChange = useCallback((id: string, obs: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, observacao: obs } : item)));
  }, []);

  const handleSave = useCallback(() => {
    if (!empresa.trim()) { toast.error("Preencha o nome da empresa."); return; }
    const key = makeStorageKey(empresa, setor);
    const session: ChecklistSession = { empresa, responsavel, dataInspecao, setor, items, savedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(session));
    toast.success(`Checklist SST salvo: "${empresa}"${setor ? ` — ${setor}` : ""}`);
  }, [empresa, responsavel, dataInspecao, setor, items]);

  const handleReset = useCallback(() => {
    if (!window.confirm("Limpar todos os status e observações?")) return;
    setItems(getInitialItems());
    toast.info("Checklist reiniciado.");
  }, []);

  const handleExportHTML = useCallback(() => {
    const statusLabel: Record<ItemStatus, string> = {
      conforme: "✅ Conforme",
      nao_conforme: "❌ Não Conforme",
      nao_aplicavel: "➖ N/A",
      pendente: "⏳ Pendente",
    };

    const rows = items.map((item) => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:11px;white-space:nowrap">${item.norma}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:11px">${item.categoria}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:11px">${item.descricao}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:11px;white-space:nowrap">${statusLabel[item.status]}</td>
        <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:11px">${item.observacao || ""}</td>
      </tr>`).join("");

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Checklist SST — ${empresa}</title>
<style>body{font-family:Arial,sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th{background:#0f172a;color:#fff;padding:8px 10px;font-size:11px;text-align:left}tr:nth-child(even){background:#f8fafc}</style>
</head>
<body>
<h2 style="margin:0 0 4px">LBM BORATTI — Checklist SST</h2>
<p style="margin:0 0 4px;font-size:12px">Empresa: <strong>${empresa}</strong>${setor ? ` | Setor: <strong>${setor}</strong>` : ""} | Responsável: <strong>${responsavel || "—"}</strong> | Data: <strong>${dataInspecao}</strong></p>
<p style="margin:0 0 16px;font-size:12px">Conformidade: <strong>${compliancePct}%</strong> | Conforme: ${conformeCount} | Não Conforme: ${naoConformeCount} | N/A: ${naCount} | Pendente: ${pendingCount}</p>
<table>
<thead><tr><th>Norma</th><th>Categoria</th><th>Item</th><th>Status</th><th>Observação</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `checklist-sst-${empresa.toLowerCase().replace(/\s+/g, "-") || "boratti"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório HTML exportado.");
  }, [empresa, responsavel, dataInspecao, setor, items, compliancePct, conformeCount, naoConformeCount, naCount, pendingCount]);

  /* ===== STYLES ===== */

  const bg = isDark ? "#0b1120" : "#f1f5f9";
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";
  const textMain = isDark ? "#e2e8f0" : "#1e293b";
  const textMuted = isDark ? "#64748b" : "#94a3b8";
  const inputBg = isDark ? "#0b1120" : "#f8fafc";

  /* ===== RENDER ===== */

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ background: bg }}>

      {/* ===== HEADER ===== */}
      <div className="px-6 py-4 flex items-center gap-4" style={{ background: "#0f172a" }}>
        <img src={logoLbm} alt="LBM BORATTI" className="h-12 w-auto max-w-[180px] object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-white tracking-wide">LBM BORATTI — Checklist SST</p>
          <p className="text-[11px] text-white/50">Auditoria de Conformidade Normativa</p>
        </div>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-1 print:hidden">
          <NavLink
            to="/"
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            activeClassName="bg-white/15 text-white"
          >
            Psicossocial
          </NavLink>
          <NavLink
            to="/checklist"
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            activeClassName="bg-white/15 text-white"
          >
            Checklist SST
          </NavLink>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="print:hidden relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 border shrink-0"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
            borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
            color: isDark ? "#e2e8f0" : "#1e293b",
            boxShadow: isDark ? "0 0 12px rgba(59,130,246,0.15)" : "0 0 12px rgba(250,204,21,0.25)",
          }}
          title={isDark ? "Modo Claro" : "Modo Escuro"}
        >
          {isDark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-blue-600" />}
          <span className="hidden sm:inline">{isDark ? "Claro" : "Escuro"}</span>
        </button>
      </div>
      <div className="h-1" style={{ background: "#1e4a7a" }} />

      {/* ===== SESSION INPUTS ===== */}
      <div
        className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b"
        style={{ background: cardBg, borderColor }}
      >
        <div className="space-y-1">
          <Label className="text-xs font-semibold" style={{ color: textMuted }}>Empresa</Label>
          <Input
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Nome da empresa"
            style={{ background: inputBg, borderColor, color: textMain }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold" style={{ color: textMuted }}>Responsável</Label>
          <Input
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Técnico / Engenheiro SST"
            style={{ background: inputBg, borderColor, color: textMain }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold" style={{ color: textMuted }}>Setor / Área</Label>
          <Input
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            placeholder="Ex: Produção, Administrativo..."
            style={{ background: inputBg, borderColor, color: textMain }}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold" style={{ color: textMuted }}>Data da Inspeção</Label>
          <Input
            type="date"
            value={dataInspecao}
            onChange={(e) => setDataInspecao(e.target.value)}
            style={{ background: inputBg, borderColor, color: textMain }}
          />
        </div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="px-6 pt-5 pb-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <SummaryCard label="Total de Itens" value={totalItems} isDark={isDark} />
        <SummaryCard label="Conformes" value={conformeCount} accentColor="hsl(152,60%,42%)" isDark={isDark} />
        <SummaryCard label="Não Conformes" value={naoConformeCount} accentColor="hsl(0,72%,51%)" isDark={isDark} />
        <SummaryCard label="Não Aplicável" value={naCount} accentColor={textMuted} isDark={isDark} />
        <SummaryCard label="Pendentes" value={pendingCount} accentColor="hsl(45,93%,47%)" isDark={isDark} />
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className="px-6 pb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold" style={{ color: textMuted }}>
            Conformidade Geral {applicableItems > 0 ? `(${conformeCount} de ${applicableItems} itens aplicáveis)` : ""}
          </span>
          <span className="text-sm font-bold" style={{ color: progressColor }}>{compliancePct}%</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: isDark ? "#1e293b" : "#e2e8f0" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${compliancePct}%`, background: progressColor }}
          />
        </div>
      </div>

      {/* ===== CHECKLIST TABS ===== */}
      <div className="flex-1 px-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab triggers — scrollable row */}
          <div className="overflow-x-auto pb-1 mb-4">
            <TabsList
              className="h-auto inline-flex flex-nowrap gap-1 p-1 rounded-lg"
              style={{ background: isDark ? "#0f172a" : "#e2e8f0", minWidth: "max-content" }}
            >
              <TabsTrigger value="Todos" className="text-xs px-3 py-1.5 rounded-md data-[state=active]:shadow-sm" style={{ whiteSpace: "nowrap" }}>
                Todos ({totalItems})
              </TabsTrigger>
              {CHECKLIST_CATEGORIAS.map((cat) => {
                const catItems = items.filter((i) => i.categoria === cat);
                const catConforme = catItems.filter((i) => i.status === "conforme").length;
                const catTotal = catItems.length;
                const allDone = catItems.every((i) => i.status !== "pendente");
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="text-xs px-3 py-1.5 rounded-md data-[state=active]:shadow-sm"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {allDone && catConforme === catTotal ? "✓ " : ""}{cat} ({catConforme}/{catTotal})
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Single content area driven by filteredItems */}
          {["Todos", ...CHECKLIST_CATEGORIAS].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    isDark={isDark}
                    onStatusChange={handleStatusChange}
                    onObservacaoChange={handleObservacaoChange}
                  />
                ))}
                {filteredItems.length === 0 && (
                  <p className="text-center py-10 text-sm" style={{ color: textMuted }}>Nenhum item encontrado.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* ===== STICKY BOTTOM ACTION BAR ===== */}
      <div
        className="print:hidden sticky bottom-0 w-full border-t z-50 py-3 px-6"
        style={{ background: isDark ? "rgba(11,17,32,0.95)" : "rgba(241,245,249,0.95)", borderColor, backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center justify-center gap-3 max-w-lg mx-auto">
          <Button onClick={handleSave} size="sm" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button onClick={handleExportHTML} variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar HTML
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistSST;
