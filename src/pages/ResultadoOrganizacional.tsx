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
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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

  const handleExportPDF = useCallback(async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgRatio = canvas.height / canvas.width;
    const imgWidth = pageWidth - 16;
    const imgHeight = imgWidth * imgRatio;

    if (imgHeight <= pageHeight - 16) {
      pdf.addImage(imgData, "PNG", 8, 8, imgWidth, imgHeight);
    } else {
      let remainingHeight = canvas.height;
      let srcY = 0;
      const sliceRatio = ((pageHeight - 16) / imgHeight) * canvas.height;
      while (remainingHeight > 0) {
        const sliceH = Math.min(sliceRatio, remainingHeight);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceH;
        const ctx = sliceCanvas.getContext("2d");
        ctx?.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const sliceImg = sliceCanvas.toDataURL("image/png");
        const drawH = (sliceH / canvas.width) * imgWidth;
        pdf.addImage(sliceImg, "PNG", 8, 8, imgWidth, drawH);
        remainingHeight -= sliceH;
        srcY += sliceH;
        if (remainingHeight > 0) pdf.addPage();
      }
    }
    pdf.save("resultado-organizacional.pdf");
  }, []);

  const [numEntrevistados, setNumEntrevistados] = useState<number | "">("");
  const [empresa, setEmpresa] = useState("");
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

  const classificacaoEfetiva = classificacaoTecnica || classificacaoAutomatica;

  const chartData = FACTORS.map((f) => ({
    name: f.label,
    value: factors[f.key],
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Export button - hidden on print/PDF */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2 bg-white shadow-sm">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Report content */}
      <div ref={reportRef} className="w-full bg-white px-8 py-6" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Title */}
        <div className="text-center mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            Avaliação Psicossocial Organizacional
          </h1>
        </div>
        <Separator className="mb-4" />

        {/* Top row: Identification left, Index right */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Left: Identification */}
          <div className="col-span-2 space-y-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Empresa
                </Label>
                <Input
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="h-8 text-sm bg-white border-border"
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Setor
                </Label>
                <Input
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  className="h-8 text-sm bg-white border-border"
                  placeholder="Setor avaliado"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data
                </Label>
                <Input
                  type="date"
                  value={dataAvaliacao}
                  onChange={(e) => setDataAvaliacao(e.target.value)}
                  className="h-8 text-sm bg-white border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nº de Entrevistados
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={numEntrevistados}
                  onChange={(e) =>
                    setNumEntrevistados(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="h-8 text-sm bg-white border-border"
                  placeholder="Ex: 50"
                  required
                />
              </div>
            </div>
            {numEntrevistados !== "" && numEntrevistados > 0 && (
              <p className="text-xs text-muted-foreground italic mt-1">
                Avaliação baseada em entrevistas individualizadas com{" "}
                <span className="font-semibold text-foreground">{numEntrevistados}</span>{" "}
                colaboradores.
              </p>
            )}

            {/* Factor inputs inline */}
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Fatores Psicossociais (%)
              </h3>
              <div className="grid grid-cols-5 gap-2">
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
                      className="h-8 text-sm bg-white border-border"
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
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Índice Geral Psicossocial
            </span>
            <span
              className={cn(
                "text-6xl font-bold leading-none",
                classificacaoEfetiva
                  ? indiceTextColor[classificacaoEfetiva]
                  : "text-muted-foreground"
              )}
            >
              {indiceGeral}%
            </span>
            <div className="mt-3">
              <StatusBadge status={classificacaoAutomatica} />
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">Classificação Automática</span>

            <Separator className="my-3 w-full" />

            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Classificação Técnica Final
            </span>
            <Select
              value={classificacaoTecnica}
              onValueChange={(v) => setClassificacaoTecnica(v as ClassificacaoGeral)}
            >
              <SelectTrigger className="h-8 text-sm bg-white border-border w-full">
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

        {/* Central: Chart full width */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Distribuição dos Fatores Psicossociais
          </h3>
          <div className="border rounded-lg p-4 bg-white">
            <FactorChart factors={chartData} />
          </div>
        </div>

        {/* Bottom: AIHA left, Conclusion right */}
        <div className="grid grid-cols-2 gap-6">
          {/* AIHA */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Matriz AIHA — Avaliação de Risco
            </h3>
            <div className="border rounded-lg p-4 bg-white">
              <AIHAMatrix data={aiha} onChange={setAiha} />
            </div>
          </div>

          {/* Conclusion */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Conclusão Executiva
            </h3>
            <div className="border rounded-lg p-4 bg-white h-full">
              <Textarea
                value={conclusao}
                onChange={(e) => setConclusao(e.target.value)}
                placeholder="Resumo executivo da avaliação (máximo 3 linhas)..."
                className="border-0 p-0 resize-none text-sm bg-white focus-visible:ring-0 min-h-[100px]"
                maxLength={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoOrganizacional;
