import { useState, useMemo, useRef, useCallback } from "react";
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
import { Download, Save, Printer } from "lucide-react";
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

const ResultadoOrganizacional = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!reportRef.current) return;
    const el = reportRef.current;
    // Temporarily expand to full width for capture
    const origMaxW = el.style.maxWidth;
    const origMargin = el.style.margin;
    el.style.maxWidth = "none";
    el.style.margin = "0";

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 1400,
      scrollY: -window.scrollY,
    });

    el.style.maxWidth = origMaxW;
    el.style.margin = origMargin;

    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const usableW = pageWidth - margin * 2;
    const usableH = pageHeight - margin * 2;
    const imgRatio = canvas.height / canvas.width;
    const totalImgH = usableW * imgRatio;

    if (totalImgH <= usableH) {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", margin, margin, usableW, totalImgH);
    } else {
      // Multi-page: slice source canvas per page
      const pxPerPage = (usableH / totalImgH) * canvas.height;
      let srcY = 0;
      let page = 0;
      while (srcY < canvas.height - 1) {
        const sliceH = Math.min(pxPerPage, canvas.height - srcY);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const sliceImg = sliceCanvas.toDataURL("image/png");
        const drawH = (sliceH / canvas.width) * usableW;
        if (page > 0) pdf.addPage();
        pdf.addImage(sliceImg, "PNG", margin, margin, usableW, drawH);
        srcY += sliceH;
        page++;
      }
    }
    pdf.save("resultado-organizacional.pdf");
  }, []);

  const handleExportHTML = useCallback(() => {
    if (!reportRef.current) return;
    const content = reportRef.current.innerHTML;
    const htmlString = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Avaliação Psicossocial Organizacional</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fff; color: #1e293b; }
  .report { max-width: 1400px; margin: 0 auto; padding: 32px; }
  input, select, textarea { border: 1px solid #ddd; border-radius: 6px; padding: 4px 8px; font-size: 14px; background: #fff; }
  @media print {
    @page { size: A4 landscape; margin: 10mm; }
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  }
</style>
</head>
<body>
<div class="report">
${content}
</div>
</body>
</html>`;
    const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultado-organizacional.html";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const [numEntrevistados, setNumEntrevistados] = useState<number | "">("");
  const [empresa, setEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [setor, setSetor] = useState("");
  const [dataAvaliacao, setDataAvaliacao] = useState("");
  const [conclusao, setConclusao] = useState("");
  const [factors, setFactors] = useState<Record<FactorKey, number>>({
    carga: 0,
    jornada: 0,
    autonomia: 0,
    exigencias: 0,
    comunicacao: 0,
  });
  const [classificacaoTecnica, setClassificacaoTecnica] = useState<ClassificacaoGeral>("");

  const handleSave = useCallback(() => {
    if (!empresa.trim()) {
      toast.error("Preencha o nome da empresa antes de salvar.");
      return;
    }
    const key = `avaliacao_${empresa.trim().toLowerCase().replace(/\s+/g, "_")}`;
    const payload = {
      empresa, cnpj, setor, dataAvaliacao, numEntrevistados, factors, classificacaoTecnica, conclusao,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
    toast.success(`Avaliação salva para "${empresa}".`);
  }, [empresa, cnpj, setor, dataAvaliacao, numEntrevistados, factors, classificacaoTecnica, conclusao]);

  const handleLoadEmpresa = useCallback(() => {
    if (!empresa.trim()) return;
    const key = `avaliacao_${empresa.trim().toLowerCase().replace(/\s+/g, "_")}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setCnpj(d.cnpj || "");
        setSetor(d.setor || "");
        setDataAvaliacao(d.dataAvaliacao || "");
        setNumEntrevistados(d.numEntrevistados ?? "");
        setFactors(d.factors || { carga: 0, jornada: 0, autonomia: 0, exigencias: 0, comunicacao: 0 });
        setClassificacaoTecnica(d.classificacaoTecnica || "");
        setConclusao(d.conclusao || "");
        toast.info(`Avaliação carregada para "${empresa}".`);
      } catch { /* ignore */ }
    }
  }, [empresa]);

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
    // Probabilidade alinhada com faixas do Índice Geral
    let prob = 1;
    if (avg > 80) prob = 5;
    else if (avg > 60) prob = 4;
    else if (avg > 40) prob = 3;
    else if (avg > 20) prob = 2;

    // Severidade baseada no fator máximo
    const maxFactor = Math.max(...Object.values(factors));
    let sev = 1;
    if (maxFactor > 80) sev = 5;
    else if (maxFactor > 60) sev = 4;
    else if (maxFactor > 40) sev = 3;
    else if (maxFactor > 20) sev = 2;

    const risk = prob * sev;
    // Classificação de risco alinhada com o Índice Geral
    let classificacao = "Baixo";
    if (risk >= 20) classificacao = "Crítico";
    else if (risk >= 12) classificacao = "Alto";
    else if (risk >= 6) classificacao = "Moderado";

    return { probabilidade: prob, severidade: sev, classificacao };
  }, [indiceGeral, factors]);

  const chartData = FACTORS.map((f) => ({
    name: f.label,
    value: factors[f.key],
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Report content */}
      <div ref={reportRef} className="w-full bg-white flex-1" style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* ===== PAGE 1: Identification + Index ===== */}
        <div className="print-page px-8 py-6 flex flex-col">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
              Avaliação Psicossocial Organizacional
            </h1>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-3 gap-6 flex-1">
            {/* Left: Identification */}
            <div className="col-span-2 flex flex-col">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Empresa
                  </Label>
                  <Input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    onBlur={handleLoadEmpresa}
                    className="h-9 text-sm bg-white border-border"
                    placeholder="Nome da empresa"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    CNPJ
                  </Label>
                  <Input
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="h-9 text-sm bg-white border-border"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Setor
                  </Label>
                  <Input
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    className="h-9 text-sm bg-white border-border"
                    placeholder="Setor avaliado"
                  />
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
                <div className="grid grid-cols-5 gap-3">
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

          <div className="grid grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-foreground mb-2">
                Matriz AIHA — Avaliação de Risco
              </h3>
              <div className="border rounded-lg p-3 bg-white flex-1 flex items-center justify-center">
                <AIHAMatrix data={aiha} />
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-foreground mb-2">
                Conclusão Executiva
              </h3>
              <div className="border rounded-lg p-3 bg-white flex-1">
                <Textarea
                  value={conclusao}
                  onChange={(e) => setConclusao(e.target.value)}
                  placeholder="Resumo executivo da avaliação..."
                  className="border-0 p-0 resize-none text-sm bg-white focus-visible:ring-0 h-full min-h-[150px]"
                  maxLength={500}
                />
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
