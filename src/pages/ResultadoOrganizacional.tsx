import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import logoLbm from "@/assets/logo-lbm.jpg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Download, Save, Printer, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FACTORS = [
  { key: "carga", label: "Carga e Ritmo de Trabalho" },
  { key: "jornada", label: "Jornada e Organização do Tempo" },
  { key: "autonomia", label: "Autonomia e Controle" },
  { key: "exigencias", label: "Exigências Cognitivas e Emocionais" },
  { key: "comunicacao", label: "Comunicação, Ambiente e Liderança" },
] as const;

type FactorKey = (typeof FACTORS)[number]["key"];
type ClassificacaoGeral = "Conforme" | "Atenção" | "Crítico" | "";

const indiceTextColor: Record<string, string> = {
  Conforme: "text-status-conforme",
  "Atenção": "text-status-atencao",
  "Crítico": "text-status-critico",
};

const indiceBorderColor: Record<string, string> = {
  Conforme: "border-status-conforme",
  "Atenção": "border-status-atencao",
  "Crítico": "border-status-critico",
};

const getClassificacaoAutomatica = (value: number): ClassificacaoGeral => {
  if (value <= 40) return "Conforme";
  if (value <= 60) return "Atenção";
  return "Crítico";
};

const STORAGE_PREFIX = "avaliacao_";

const getSavedEmpresas = (): string[] => {
  const set = new Set<string>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "");
        if (d.empresa) set.add(d.empresa);
      } catch { /* ignore */ }
    }
  }
  return Array.from(set).sort();
};

const getSavedSetores = (empresaNome: string): string[] => {
  const setores: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      try {
        const d = JSON.parse(localStorage.getItem(key) || "");
        if (d.empresa?.toLowerCase() === empresaNome.toLowerCase() && d.setor) {
          setores.push(d.setor);
        }
      } catch { /* ignore */ }
    }
  }
  return setores.sort();
};

const makeStorageKey = (emp: string, set: string) => {
  const base = emp.trim().toLowerCase().replace(/\s+/g, "_");
  const s = set.trim().toLowerCase().replace(/\s+/g, "_");
  return `${STORAGE_PREFIX}${base}${s ? `__${s}` : ""}`;
};

const ResultadoOrganizacional = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const [numEntrevistados, setNumEntrevistados] = useState<number | "">("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [setor, setSetor] = useState("");
  const [dataAvaliacao, setDataAvaliacao] = useState("");
  const [conclusao, setConclusao] = useState("");
  const [recomendacoes, setRecomendacoes] = useState<string[]>([""]);
  const [factors, setFactors] = useState<Record<FactorKey, number>>({
    carga: 0, jornada: 0, autonomia: 0, exigencias: 0, comunicacao: 0,
  });
  const [classificacaoTecnica, setClassificacaoTecnica] = useState<ClassificacaoGeral>("");

  // Empresa search
  const [savedEmpresas, setSavedEmpresas] = useState<string[]>([]);
  const [showEmpresaList, setShowEmpresaList] = useState(false);
  const empresaInputRef = useRef<HTMLDivElement>(null);

  // Setor search
  const [savedSetores, setSavedSetores] = useState<string[]>([]);
  const [showSetorList, setShowSetorList] = useState(false);
  const setorInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedEmpresas(getSavedEmpresas());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (empresaInputRef.current && !empresaInputRef.current.contains(e.target as Node)) {
        setShowEmpresaList(false);
      }
      if (setorInputRef.current && !setorInputRef.current.contains(e.target as Node)) {
        setShowSetorList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredEmpresas = useMemo(() => {
    if (!empresa.trim()) return savedEmpresas;
    const q = empresa.toLowerCase();
    return savedEmpresas.filter((e) => e.toLowerCase().includes(q));
  }, [empresa, savedEmpresas]);

  const filteredSetores = useMemo(() => {
    if (!setor.trim()) return savedSetores;
    const q = setor.toLowerCase();
    return savedSetores.filter((s) => s.toLowerCase().includes(q));
  }, [setor, savedSetores]);

  // Update saved setores when empresa changes
  useEffect(() => {
    if (empresa.trim()) {
      setSavedSetores(getSavedSetores(empresa));
    } else {
      setSavedSetores([]);
    }
  }, [empresa, savedEmpresas]);

  const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const addRecomendacao = () => setRecomendacoes((prev) => [...prev, ""]);
  const removeRecomendacao = (index: number) =>
    setRecomendacoes((prev) => prev.filter((_, i) => i !== index));
  const updateRecomendacao = (index: number, value: string) =>
    setRecomendacoes((prev) => prev.map((r, i) => (i === index ? value : r)));

  const loadEmpresaSetor = useCallback((empresaNome: string, setorNome?: string) => {
    // If only empresa selected (no setor), load first available or just set empresa+cnpj
    const key = makeStorageKey(empresaNome, setorNome || "");
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setEmpresa(d.empresa || empresaNome);
        setCnpj(d.cnpj || "");
        setSetor(d.setor || "");
        setDataAvaliacao(d.dataAvaliacao || "");
        setNumEntrevistados(d.numEntrevistados ?? "");
        setFactors(d.factors || { carga: 0, jornada: 0, autonomia: 0, exigencias: 0, comunicacao: 0 });
        setClassificacaoTecnica(d.classificacaoTecnica || "");
        setConclusao(d.conclusao || "");
        setRecomendacoes(d.recomendacoes || [""]);
        toast.info(`Avaliação carregada: "${d.empresa}"${d.setor ? ` — ${d.setor}` : ""}`);
      } catch { /* ignore */ }
    } else {
      // No exact match — just set the empresa name and load cnpj from any setor
      setEmpresa(empresaNome);
      const setores = getSavedSetores(empresaNome);
      if (setores.length > 0) {
        const firstKey = makeStorageKey(empresaNome, setores[0]);
        const firstSaved = localStorage.getItem(firstKey);
        if (firstSaved) {
          try {
            const d = JSON.parse(firstSaved);
            setCnpj(d.cnpj || "");
          } catch { /* ignore */ }
        }
      }
      setSetor("");
    }
    setShowEmpresaList(false);
    setShowSetorList(false);
  }, []);

  const indiceGeral = useMemo(() => {
    const values = Object.values(factors);
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10;
  }, [factors]);

  const classificacaoAutomatica = useMemo(
    () => getClassificacaoAutomatica(indiceGeral),
    [indiceGeral]
  );

  const classificacaoEfetiva = classificacaoTecnica || classificacaoAutomatica;

  const aiha = useMemo(() => {
    const avg = indiceGeral;
    let level = 1;
    if (avg > 80) level = 5;
    else if (avg > 60) level = 4;
    else if (avg > 40) level = 3;
    else if (avg > 20) level = 2;
    const prob = level;
    const sev = level;
    const risk = prob * sev;
    let classificacao: string;
    if (risk <= 4) classificacao = "Conforme";
    else if (risk <= 9) classificacao = "Atenção";
    else classificacao = "Crítico";
    return { probabilidade: prob, severidade: sev, classificacao };
  }, [indiceGeral]);

  const chartData = FACTORS.map((f) => ({
    name: f.label,
    value: factors[f.key],
  }));

  const handleSave = useCallback(() => {
    if (!empresa.trim()) {
      toast.error("Preencha o nome da empresa antes de salvar.");
      return;
    }
    const key = makeStorageKey(empresa, setor);
    const payload = {
      empresa, cnpj, setor, dataAvaliacao, numEntrevistados, factors,
      classificacaoTecnica, conclusao, recomendacoes,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
    setSavedEmpresas(getSavedEmpresas());
    setSavedSetores(getSavedSetores(empresa));
    toast.success(`Avaliação salva: "${empresa}"${setor ? ` — ${setor}` : ""}`);
  }, [empresa, cnpj, setor, dataAvaliacao, numEntrevistados, factors, classificacaoTecnica, conclusao, recomendacoes]);

  const handlePrint = useCallback(() => { window.print(); }, []);

  const handleExportPDF = useCallback(async () => {
    if (!reportRef.current) return;
    const el = reportRef.current;

    const MARGIN_MM = 6;
    const A4_W = 210;
    const A4_H = 297;
    const usableW = A4_W - MARGIN_MM * 2;
    const usableH = A4_H - MARGIN_MM * 2;

    // Save originals
    const origWidth = el.style.width;
    const origMaxWidth = el.style.maxWidth;
    const origMargin = el.style.margin;

    // Hide print:hidden elements
    const hiddenEls = el.querySelectorAll('.print\\:hidden');
    const hiddenOrigDisplay: string[] = [];
    hiddenEls.forEach((h) => {
      const htmlEl = h as HTMLElement;
      hiddenOrigDisplay.push(htmlEl.style.display);
      htmlEl.style.display = 'none';
    });

    // Expand textareas
    const textareas = el.querySelectorAll("textarea");
    const origHeights: string[] = [];
    textareas.forEach((ta) => {
      origHeights.push(ta.style.height);
      ta.style.height = ta.scrollHeight + "px";
    });

    // Force consistent width
    el.style.width = "1400px";
    el.style.maxWidth = "1400px";
    el.style.margin = "0";

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 1400,
        windowWidth: 1400,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pxPerMM = canvas.width / usableW;
      const sliceHeightPx = Math.floor(usableH * pxPerMM);

      let heightLeft = canvas.height;
      let page = 0;

      while (heightLeft > 0) {
        const currentSlicePx = Math.min(sliceHeightPx, heightLeft);
        const currentSliceMM = currentSlicePx / pxPerMM;

        if (page > 0) pdf.addPage();

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = currentSlicePx;
        const ctx = tempCanvas.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, currentSlicePx);
        ctx.drawImage(
          canvas,
          0, canvas.height - heightLeft,
          canvas.width, currentSlicePx,
          0, 0,
          canvas.width, currentSlicePx
        );

        pdf.addImage(
          tempCanvas.toDataURL("image/png"),
          "PNG",
          MARGIN_MM, MARGIN_MM,
          usableW, currentSliceMM
        );

        heightLeft -= currentSlicePx;
        page++;
      }

      pdf.save(`avaliacao-${empresa || "organizacional"}.pdf`);
    } finally {
      // Restore everything
      el.style.width = origWidth;
      el.style.maxWidth = origMaxWidth;
      el.style.margin = origMargin;
      textareas.forEach((ta, i) => { ta.style.height = origHeights[i]; });
      hiddenEls.forEach((h, i) => {
        (h as HTMLElement).style.display = hiddenOrigDisplay[i];
      });
    }
  }, [empresa]);

  const handleExportHTML = useCallback(async () => {
    const statusColor = (s: string) => {
      if (s === "Conforme") return "#22c55e";
      if (s === "Atenção") return "#f59e0b";
      return "#ef4444";
    };

    const barColor = (v: number) => {
      if (v <= 30) return "#22c55e";
      if (v <= 60) return "#f59e0b";
      return "#ef4444";
    };

    // Convert FactorChart SVG to base64 image
    let chartImgBase64 = "";
    const chartContainer = reportRef.current?.querySelector(".recharts-responsive-container");
    if (chartContainer) {
      try {
        const chartCanvas = await html2canvas(chartContainer as HTMLElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        chartImgBase64 = chartCanvas.toDataURL("image/png");
      } catch { /* fallback to CSS bars */ }
    }

    const factorRows = FACTORS.map((f) => {
      const v = factors[f.key];
      const color = barColor(v);
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:14px;width:55%;">${f.label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;width:35%;">
          <div style="background:#f1f5f9;border-radius:6px;height:22px;position:relative;overflow:hidden;">
            <div style="background:${color};height:100%;width:${v}%;border-radius:6px;transition:width 0.3s;"></div>
          </div>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:${color};text-align:center;font-size:14px;width:10%;">${v}%</td>
      </tr>`;
    }).join("\n");

    // AIHA Matrix as HTML table - full 5x5 grid
    const aihaColor = statusColor(aiha.classificacao);
    const risk = aiha.probabilidade * aiha.severidade;

    const getCellBg = (r: number) => {
      if (r <= 3) return "#2d8a4e";
      if (r <= 5) return "#6fbf50";
      if (r <= 10) return "#e6b422";
      if (r <= 15) return "#e07830";
      if (r <= 20) return "#cc3333";
      return "#991b1b";
    };

    // Build 5x5 matrix rows (prob 5 at top, 1 at bottom)
    let matrixRows = "";
    for (let p = 5; p >= 1; p--) {
      let cells = `<td style="width:36px;text-align:center;font-weight:700;font-size:12px;color:#64748b;padding:4px;">${p}</td>`;
      for (let s = 1; s <= 5; s++) {
        const cr = p * s;
        const isSelected = aiha.probabilidade === p && aiha.severidade === s;
        const border = isSelected ? "3px solid #1e293b" : "1px solid rgba(255,255,255,0.3)";
        const transform = isSelected ? "font-size:14px;font-weight:900;" : "font-size:11px;font-weight:700;";
        cells += `<td style="background:${getCellBg(cr)};color:#fff;text-align:center;padding:8px 4px;border-radius:4px;border:${border};${transform}">${cr}</td>`;
      }
      matrixRows += `<tr>${cells}</tr>`;
    }

    const aihaTableHtml = `
      <div style="display:flex;gap:32px;align-items:flex-start;margin-top:12px;flex-wrap:wrap;">
        <div>
          <div style="text-align:center;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Severidade →</div>
          <table style="border-collapse:separate;border-spacing:3px;">
            <thead>
              <tr>
                <th style="width:36px;font-size:10px;color:#64748b;writing-mode:vertical-rl;transform:rotate(180deg);padding:4px;">Prob →</th>
                <th style="text-align:center;font-size:11px;font-weight:700;color:#64748b;padding:4px;">1</th>
                <th style="text-align:center;font-size:11px;font-weight:700;color:#64748b;padding:4px;">2</th>
                <th style="text-align:center;font-size:11px;font-weight:700;color:#64748b;padding:4px;">3</th>
                <th style="text-align:center;font-size:11px;font-weight:700;color:#64748b;padding:4px;">4</th>
                <th style="text-align:center;font-size:11px;font-weight:700;color:#64748b;padding:4px;">5</th>
              </tr>
            </thead>
            <tbody>${matrixRows}</tbody>
          </table>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;min-width:200px;">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
            <div style="text-align:center;background:#f8fafc;padding:14px 8px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#64748b;">Probabilidade</div>
              <div style="font-size:28px;font-weight:800;color:${aihaColor};margin-top:2px;">${aiha.probabilidade}</div>
            </div>
            <div style="text-align:center;background:#f8fafc;padding:14px 8px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#64748b;">Severidade</div>
              <div style="font-size:28px;font-weight:800;color:${aihaColor};margin-top:2px;">${aiha.severidade}</div>
            </div>
            <div style="text-align:center;background:#f8fafc;padding:14px 8px;border-radius:8px;border:1px solid #e2e8f0;">
              <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#64748b;">Risco (P×S)</div>
              <div style="font-size:28px;font-weight:800;color:${aihaColor};margin-top:2px;">${risk}</div>
              <div style="display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#fff;background:${aihaColor};margin-top:4px;">${aiha.classificacao}</div>
            </div>
          </div>
        </div>
      </div>`;

    const recsHtml = recomendacoes
      .filter((r) => r.trim())
      .map((r) => `<li style="margin-bottom:8px;font-size:14px;color:#334155;line-height:1.5;">${r}</li>`)
      .join("\n");

    const htmlString = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Avaliação Psicossocial — ${empresa || "Organizacional"}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #fff; color: #1e293b; }
  .page { max-width: 900px; margin: 0 auto; padding: 40px 32px; }
  .header { background: #1e293b; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; border-radius: 8px 8px 0 0; }
  .header h1 { color: #fff; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; text-align: right; line-height: 1.3; }
  .header p { color: rgba(255,255,255,0.5); font-size: 11px; margin-top: 4px; }
  .accent-bar { height: 4px; background: #1e4a7a; }
  .section { margin-top: 28px; }
  .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px 24px; }
  .field label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }
  .field .value { font-size: 15px; font-weight: 500; color: #1e293b; margin-top: 2px; padding: 6px 0; border-bottom: 1px solid #e2e8f0; min-height: 28px; }
  .index-box { text-align: center; padding: 28px 20px; border: 2px solid ${statusColor(classificacaoEfetiva)}; border-radius: 12px; margin-top: 16px; }
  .index-value { font-size: 56px; font-weight: 800; color: ${statusColor(classificacaoEfetiva)}; }
  .badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #fff; background: ${statusColor(classificacaoEfetiva)}; margin-top: 8px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  table th { text-align: left; padding: 10px 12px; background: #f1f5f9; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  .conclusao { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.7; color: #334155; white-space: pre-wrap; margin-top: 8px; min-height: 60px; }
  ol { padding-left: 24px; margin-top: 8px; }
  .chart-img { width: 100%; max-width: 100%; height: auto; border-radius: 8px; margin-top: 8px; }
  @media print {
    @page { size: A4 portrait; margin: 15mm; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div><span style="color:rgba(255,255,255,0.6);font-size:12px;">Consultoria em Segurança e Saúde do Trabalho</span></div>
    <div>
      <h1>Avaliação Psicossocial<br>Organizacional</h1>
      <p>Gerenciamento de Riscos Psicossociais — NR-1</p>
    </div>
  </div>
  <div class="accent-bar"></div>

  <div class="section">
    <div class="section-title">Identificação</div>
    <div class="grid-2">
      <div class="field"><label>Empresa</label><div class="value">${empresa || "—"}</div></div>
      <div class="field"><label>CNPJ</label><div class="value">${cnpj || "—"}</div></div>
    </div>
    <div class="grid-3" style="margin-top:12px;">
      <div class="field"><label>Setor</label><div class="value">${setor || "—"}</div></div>
      <div class="field"><label>Data</label><div class="value">${dataAvaliacao || "—"}</div></div>
      <div class="field"><label>Nº de Entrevistados</label><div class="value">${numEntrevistados || "—"}</div></div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:1fr 280px;gap:24px;margin-top:28px;">
    <div class="section" style="margin-top:0;">
      <div class="section-title">Fatores Psicossociais</div>
      <table>
        <thead><tr><th>Fator</th><th style="text-align:center;">Barra</th><th style="text-align:center;">Resultado</th></tr></thead>
        <tbody>${factorRows}</tbody>
      </table>
    </div>
    <div class="index-box">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#64748b;letter-spacing:1px;">Índice Geral Psicossocial</div>
      <div class="index-value">${indiceGeral}%</div>
      <div class="badge">${classificacaoEfetiva}</div>
      ${classificacaoTecnica ? `<div style="margin-top:12px;font-size:11px;color:#64748b;">Classificação Técnica: <strong>${classificacaoTecnica}</strong></div>` : ""}
    </div>
  </div>

  ${chartImgBase64 ? `
  <div class="section">
    <div class="section-title">Gráfico de Fatores</div>
    <img src="${chartImgBase64}" alt="Gráfico de Fatores Psicossociais" class="chart-img" />
  </div>` : ""}

  <div class="section">
    <div class="section-title">Matriz de Risco — AIHA</div>
    ${aihaTableHtml}
  </div>

  <div class="section">
    <div class="section-title">Conclusão Executiva</div>
    <div class="conclusao">${conclusao || "—"}</div>
  </div>

  ${recsHtml ? `
  <div class="section">
    <div class="section-title">Recomendações</div>
    <ol>${recsHtml}</ol>
  </div>` : ""}
</div>
</body>
</html>`;
    const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avaliacao-${empresa || "organizacional"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [empresa, cnpj, setor, dataAvaliacao, numEntrevistados, factors, classificacaoTecnica, classificacaoEfetiva, conclusao, recomendacoes, indiceGeral, aiha]);


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Report content */}
      <div ref={reportRef} className="w-full bg-white flex-1" style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* ===== HEADER — Identidade Visual ===== */}
        <div className="bg-brand-dark px-8 py-5 flex items-center gap-6 rounded-t-lg">
          <div className="flex-shrink-0">
            <img
              src={logoUrl || logoLbm}
              alt="LBM BORATTI"
              className="h-14 w-auto max-w-[220px] object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/60 font-medium tracking-wide">
              Consultoria em Segurança e Saúde do Trabalho
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <h2 className="text-lg font-bold text-white uppercase tracking-tight leading-tight">
              Avaliação Psicossocial<br />Organizacional
            </h2>
            <p className="text-[10px] text-white/40 mt-1 font-medium">
              Gerenciamento de Riscos Psicossociais — NR-1
            </p>
          </div>
        </div>

        <div className="h-1 bg-brand-primary" />

        {/* ===== PAGE 1: Identification + Index ===== */}
        <div className="print-page px-8 py-6 flex flex-col">
          <div className="grid grid-cols-3 gap-6 flex-1">
            {/* Left: Identification */}
            <div className="col-span-2 flex flex-col">
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {/* Empresa with search */}
                <div className="col-span-2 space-y-1 relative" ref={empresaInputRef}>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Empresa
                  </Label>
                  <div className="relative">
                    <Input
                      value={empresa}
                      onChange={(e) => {
                        setEmpresa(e.target.value);
                        setShowEmpresaList(true);
                      }}
                      onFocus={() => setShowEmpresaList(true)}
                      className="h-9 text-sm bg-white border-border pr-8"
                      placeholder="Pesquisar ou digitar empresa..."
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                  {showEmpresaList && filteredEmpresas.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredEmpresas.map((e) => (
                        <button
                          key={e}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => loadEmpresaSetor(e)}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    CNPJ
                  </Label>
                  <Input
                    value={cnpj}
                    onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                    className="h-9 text-sm bg-white border-border"
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                </div>
                <div className="space-y-1 relative" ref={setorInputRef}>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Setor
                  </Label>
                  <div className="relative">
                    <Input
                      value={setor}
                      onChange={(e) => {
                        setSetor(e.target.value);
                        setShowSetorList(true);
                      }}
                      onFocus={() => setShowSetorList(true)}
                      className="h-9 text-sm bg-white border-border pr-8"
                      placeholder="Pesquisar ou digitar setor..."
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  </div>
                  {showSetorList && filteredSetores.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredSetores.map((s) => (
                        <button
                          key={s}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => loadEmpresaSetor(empresa, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Data
                  </Label>
                  <Input
                    type="date"
                    value={dataAvaliacao}
                    onChange={(e) => setDataAvaliacao(e.target.value)}
                    className="h-9 text-sm bg-white border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Nº de Entrevistados
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={numEntrevistados}
                    onChange={(e) =>
                      setNumEntrevistados(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="h-9 text-sm bg-white border-border"
                    placeholder="Ex: 50"
                    required
                  />
                </div>
              </div>
              {numEntrevistados !== "" && numEntrevistados > 0 && (
                <p className="text-xs text-muted-foreground italic mt-2">
                  Avaliação baseada em entrevistas individualizadas com{" "}
                  <span className="font-semibold text-foreground">{numEntrevistados}</span>{" "}
                  colaboradores.
                </p>
              )}

              {/* Factor inputs */}
              <div className="mt-auto pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Fatores Psicossociais (%)
                </h3>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3 lg:grid-cols-5">
                  {FACTORS.map((f) => (
                    <div key={f.key} className="space-y-1">
                      <Label className="text-[10px] leading-tight text-muted-foreground line-clamp-2">
                        {f.label}
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
                        className="h-9 text-sm bg-white border-border"
                        placeholder="0–100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Index block */}
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 p-6",
                classificacaoEfetiva ? indiceBorderColor[classificacaoEfetiva] : "border-border"
              )}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Índice Geral Psicossocial
              </span>
              <span
                className={cn(
                  "text-7xl font-bold leading-none",
                  classificacaoEfetiva
                    ? indiceTextColor[classificacaoEfetiva]
                    : "text-muted-foreground"
                )}
              >
                {indiceGeral}%
              </span>
              <div className="mt-4">
                <StatusBadge status={classificacaoAutomatica} />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">Classificação Automática</span>

              <Separator className="my-4 w-full" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Classificação Técnica Final
              </span>
              <Select
                value={classificacaoTecnica}
                onValueChange={(v) => setClassificacaoTecnica(v as ClassificacaoGeral)}
              >
                <SelectTrigger className="h-9 text-sm bg-white border-border w-full">
                  <SelectValue placeholder="Automática" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="Atenção">Atenção</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
              {classificacaoTecnica && (
                <div className="mt-2">
                  <StatusBadge status={classificacaoEfetiva} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== PAGE 2: Chart + AIHA Matrix + Conclusion ===== */}
        <div className="print-page px-8 py-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-foreground mb-2">
              Distribuição dos Fatores Psicossociais
            </h3>
            <div className="border rounded-lg p-3 bg-white">
              <FactorChart factors={chartData} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-foreground mb-2">
                Matriz AIHA — Avaliação de Risco
              </h3>
              <div className="border rounded-lg p-3 bg-white flex-1 flex items-center justify-center">
                <AIHAMatrix data={aiha} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">
                  Conclusão Executiva
                </h3>
                <div className="border rounded-lg p-3 bg-white">
                  <Textarea
                    value={conclusao}
                    onChange={(e) => setConclusao(e.target.value)}
                    placeholder="Resumo executivo da avaliação psicossocial organizacional..."
                    className="border-0 p-0 resize-none text-sm bg-white focus-visible:ring-0 min-h-[180px]"
                    maxLength={2000}
                  />
                  <p className="text-[10px] text-muted-foreground text-right mt-1">
                    {conclusao.length}/2000
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Recomendações
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRecomendacao}
                    className="print:hidden h-7 text-xs gap-1"
                  >
                    + Item
                  </Button>
                </div>
                <div className="border rounded-lg p-3 bg-white space-y-2">
                  {recomendacoes.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-muted-foreground mt-2 min-w-[20px]">
                        {i + 1}.
                      </span>
                      <Input
                        value={rec}
                        onChange={(e) => updateRecomendacao(i, e.target.value)}
                        placeholder={`Recomendação ${i + 1}...`}
                        className="h-8 text-sm bg-white border-border flex-1"
                      />
                      {recomendacoes.length > 1 && (
                        <button
                          onClick={() => removeRecomendacao(i)}
                          className="print:hidden text-muted-foreground hover:text-destructive mt-1.5"
                          title="Remover"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar - fixed bottom */}
      <div className="print:hidden sticky bottom-0 w-full border-t bg-background/95 backdrop-blur py-3 z-50">
        <div className="flex items-center justify-center gap-3 px-8" style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Button onClick={handleSave} className="gap-2" size="sm">
            <Save className="h-4 w-4" />
            Salvar Avaliação
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleExportHTML} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar HTML
          </Button>
          <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultadoOrganizacional;
