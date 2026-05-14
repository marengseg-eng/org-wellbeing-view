import {
  AlertTriangle,
  Anchor,
  ArrowDownToLine,
  Award,
  Ban,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  CloudLightning,
  Eye,
  FileWarning,
  Flame,
  HardHat,
  HeartPulse,
  HelpCircle,
  LifeBuoy,
  Lock,
  Map,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Stethoscope,
  Target,
  Users,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SlideTone = "amber" | "blue" | "red" | "emerald" | "slate";

type Slide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: SlideTone;
  impact?: string;
  bullets: string[];
};

const toneStyles: Record<SlideTone, string> = {
  amber: "from-amber-400 via-orange-500 to-red-600",
  blue: "from-sky-400 via-blue-600 to-indigo-800",
  red: "from-red-500 via-rose-700 to-slate-950",
  emerald: "from-emerald-400 via-teal-600 to-slate-900",
  slate: "from-slate-300 via-slate-600 to-slate-950",
};

const slides: Slide[] = [
  {
    eyebrow: "NR 35 • Slide 01",
    title: "Trabalho em Altura",
    subtitle: "Treinamento de impacto para prevenir quedas, salvar vidas e fortalecer a cultura de segurança.",
    icon: HardHat,
    tone: "blue",
    impact: "2 m ou mais exige controle total",
    bullets: ["Conceitos essenciais da NR 35", "Planejamento, execução e emergência", "Atitude segura antes, durante e depois da atividade"],
  },
  {
    eyebrow: "NR 35 • Slide 02",
    title: "Por que este tema é crítico?",
    subtitle: "Queda de altura é evento de alta severidade: segundos de descuido podem mudar uma vida inteira.",
    icon: AlertTriangle,
    tone: "red",
    impact: "A queda não avisa",
    bullets: ["Fatalidade, afastamento e sequelas permanentes", "Impacto humano, operacional e financeiro", "Prevenção começa antes da subida"],
  },
  {
    eyebrow: "NR 35 • Slide 03",
    title: "Objetivo da NR 35",
    subtitle: "Estabelecer requisitos mínimos e medidas de proteção para trabalho em altura.",
    icon: BookOpenCheck,
    tone: "emerald",
    bullets: ["Garantir planejamento e organização", "Definir responsabilidades", "Proteger trabalhadores direta e indiretamente envolvidos"],
  },
  {
    eyebrow: "NR 35 • Slide 04",
    title: "Quando a NR 35 se aplica?",
    subtitle: "Todo trabalho executado acima de 2 metros do nível inferior, onde exista risco de queda.",
    icon: ArrowDownToLine,
    tone: "amber",
    impact: "Altura + risco = NR 35",
    bullets: ["Telhados, andaimes, escadas, plataformas e estruturas", "Atividades rotineiras e não rotineiras", "Acesso, permanência e deslocamento em altura"],
  },
  {
    eyebrow: "NR 35 • Slide 05",
    title: "Hierarquia de controle",
    subtitle: "A melhor proteção é eliminar o risco antes de depender do equipamento individual.",
    icon: ShieldCheck,
    tone: "blue",
    bullets: ["Evitar trabalho em altura sempre que possível", "Eliminar ou reduzir risco com proteção coletiva", "Usar EPI como última barreira de defesa"],
  },
  {
    eyebrow: "NR 35 • Slide 06",
    title: "Responsabilidades da empresa",
    subtitle: "Segurança em altura precisa de gestão, recursos, procedimentos e supervisão.",
    icon: ClipboardCheck,
    tone: "slate",
    bullets: ["Implementar medidas de prevenção", "Assegurar capacitação e autorização", "Disponibilizar sistemas de proteção adequados"],
  },
  {
    eyebrow: "NR 35 • Slide 07",
    title: "Responsabilidades do trabalhador",
    subtitle: "O trabalhador é protagonista: cumprir procedimentos, comunicar riscos e recusar condição insegura.",
    icon: Users,
    tone: "emerald",
    bullets: ["Usar corretamente EPI e EPC", "Interromper atividade diante de risco grave", "Zelar pela própria segurança e pela equipe"],
  },
  {
    eyebrow: "NR 35 • Slide 08",
    title: "Autorização para trabalhar",
    subtitle: "Somente trabalhador capacitado, avaliado e autorizado deve executar atividade em altura.",
    icon: Award,
    tone: "amber",
    bullets: ["Treinamento periódico e compatível com o risco", "Aptidão médica e condições psicofisiológicas", "Registro formal da autorização"],
  },
  {
    eyebrow: "NR 35 • Slide 09",
    title: "Análise de risco",
    subtitle: "Antes de subir, enxergue o cenário completo: pessoas, ambiente, tarefa, ferramentas e energia.",
    icon: Eye,
    tone: "blue",
    impact: "Pare • pense • controle",
    bullets: ["Identificar perigos e consequências", "Definir medidas preventivas", "Comunicar a equipe antes da execução"],
  },
  {
    eyebrow: "NR 35 • Slide 10",
    title: "Permissão de trabalho",
    subtitle: "Atividades não rotineiras exigem liberação formal, rastreável e alinhada com a análise de risco.",
    icon: FileWarning,
    tone: "red",
    bullets: ["Validade limitada à tarefa e ao turno", "Assinaturas e responsáveis definidos", "Critérios claros para suspensão"],
  },
  {
    eyebrow: "NR 35 • Slide 11",
    title: "Planejamento da tarefa",
    subtitle: "Planejar é decidir como ninguém vai cair: método, acesso, ancoragem, clima, isolamento e resgate.",
    icon: Map,
    tone: "emerald",
    bullets: ["Sequência de execução segura", "Ferramentas amarradas e materiais controlados", "Equipe, comunicação e supervisão definidos"],
  },
  {
    eyebrow: "NR 35 • Slide 12",
    title: "Condições impeditivas",
    subtitle: "Algumas condições exigem parada imediata. Segurança não negocia com pressa.",
    icon: Ban,
    tone: "red",
    impact: "Se não está seguro, não suba",
    bullets: ["Vento forte, chuva, descargas atmosféricas ou baixa visibilidade", "EPI danificado ou ancoragem duvidosa", "Trabalhador sem autorização, sem saúde ou sem orientação"],
  },
  {
    eyebrow: "NR 35 • Slide 13",
    title: "Sistemas de proteção coletiva",
    subtitle: "Guarda-corpos, redes, plataformas e isolamento reduzem o risco para todos.",
    icon: ShieldAlert,
    tone: "blue",
    bullets: ["Priorizar EPC no projeto da atividade", "Impedir acesso de pessoas não envolvidas", "Manter proteções íntegras durante toda a tarefa"],
  },
  {
    eyebrow: "NR 35 • Slide 14",
    title: "EPI contra quedas",
    subtitle: "Cinturão, talabarte, trava-quedas, conectores e capacete formam um sistema — não peças isoladas.",
    icon: LifeBuoy,
    tone: "amber",
    bullets: ["Selecionar conforme atividade e fator de queda", "Ajustar ao corpo antes de iniciar", "Nunca improvisar componentes"],
  },
  {
    eyebrow: "NR 35 • Slide 15",
    title: "Ponto de ancoragem",
    subtitle: "A ancoragem precisa ser planejada, resistente, compatível e posicionada para reduzir a queda livre.",
    icon: Anchor,
    tone: "slate",
    impact: "Sua vida está presa aqui",
    bullets: ["Preferir ponto acima do usuário", "Verificar certificação, inspeção e capacidade", "Evitar cantos vivos e superfícies abrasivas"],
  },
  {
    eyebrow: "NR 35 • Slide 16",
    title: "Fator de queda e zona livre",
    subtitle: "Conheça a distância necessária para o sistema funcionar sem impacto no nível inferior.",
    icon: Target,
    tone: "blue",
    bullets: ["Calcular queda livre, absorvedor e altura do trabalhador", "Considerar elasticidade, deslocamento e obstáculos", "Reduzir folgas no talabarte"],
  },
  {
    eyebrow: "NR 35 • Slide 17",
    title: "Inspeção antes do uso",
    subtitle: "Equipamento sem inspeção é falsa sensação de segurança.",
    icon: CheckCircle2,
    tone: "emerald",
    bullets: ["Verificar costuras, fitas, argolas e mosquetões", "Conferir etiquetas, validade e rastreabilidade", "Retirar de uso qualquer item suspeito"],
  },
  {
    eyebrow: "NR 35 • Slide 18",
    title: "Escadas portáteis",
    subtitle: "Escada é acesso temporário, não plataforma improvisada para qualquer tarefa.",
    icon: Lock,
    tone: "amber",
    bullets: ["Apoio firme, amarração e ângulo adequado", "Três pontos de contato sempre que aplicável", "Nunca trabalhar no último degrau"],
  },
  {
    eyebrow: "NR 35 • Slide 19",
    title: "Andaimes e plataformas",
    subtitle: "Montagem, liberação e uso devem seguir projeto, inspeção e limites de carga.",
    icon: HardHat,
    tone: "slate",
    bullets: ["Piso completo, estável e sem vãos perigosos", "Guarda-corpo, rodapé e acesso seguro", "Proibir alterações por pessoa não autorizada"],
  },
  {
    eyebrow: "NR 35 • Slide 20",
    title: "Telhados e coberturas",
    subtitle: "Fragilidade, inclinação, claraboias e bordas tornam o telhado um dos cenários mais críticos.",
    icon: CloudLightning,
    tone: "red",
    bullets: ["Usar passarelas e linhas de vida quando necessário", "Isolar área inferior contra queda de objetos", "Nunca pisar em telha frágil ou translúcida sem proteção"],
  },
  {
    eyebrow: "NR 35 • Slide 21",
    title: "Clima e ambiente",
    subtitle: "O ambiente muda rápido. A permissão segura agora pode não ser segura daqui a dez minutos.",
    icon: Wind,
    tone: "blue",
    bullets: ["Monitorar vento, chuva, calor e iluminação", "Suspender atividade com raio ou instabilidade", "Reavaliar riscos após qualquer mudança"],
  },
  {
    eyebrow: "NR 35 • Slide 22",
    title: "Comunicação e isolamento",
    subtitle: "Quem está embaixo também precisa estar protegido. Queda de objetos mata.",
    icon: Radio,
    tone: "amber",
    bullets: ["Sinalizar e bloquear a área de risco", "Definir canal de comunicação da equipe", "Amarrar ferramentas e controlar materiais"],
  },
  {
    eyebrow: "NR 35 • Slide 23",
    title: "Emergência e resgate",
    subtitle: "Plano de resgate não pode começar depois da queda. Cada minuto suspenso aumenta o risco.",
    icon: Siren,
    tone: "red",
    impact: "Resgate rápido salva vidas",
    bullets: ["Equipe treinada e recursos disponíveis", "Procedimento de acionamento claro", "Simulados para testar tempo de resposta"],
  },
  {
    eyebrow: "NR 35 • Slide 24",
    title: "Saúde, atenção e comportamento",
    subtitle: "Cansaço, medicamentos, pressa e excesso de confiança também são riscos de queda.",
    icon: HeartPulse,
    tone: "emerald",
    bullets: ["Avaliar condição física e emocional", "Hidratação, pausas e foco na tarefa", "Praticar recusa segura sem medo de punição"],
  },
  {
    eyebrow: "NR 35 • Slide 25",
    title: "Compromisso final",
    subtitle: "Voltar para casa inteiro é o indicador mais importante de qualquer trabalho em altura.",
    icon: Stethoscope,
    tone: "blue",
    impact: "Minha atitude segura protege a equipe",
    bullets: ["Eu planejo antes de subir", "Eu uso proteção 100% do tempo", "Eu paro quando identificar risco grave"],
  },
];

const AgendaPill = ({ children }: { children: string }) => (
  <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur">
    {children}
  </span>
);

const SlideCard = ({ slide, index }: { slide: Slide; index: number }) => {
  const Icon = slide.icon;

  return (
    <section className="print-page group relative mx-auto grid min-h-[760px] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950 text-white shadow-2xl shadow-slate-950/40 print:my-0 print:min-h-[190mm] print:rounded-none print:border-0 print:shadow-none md:grid-cols-[0.9fr_1.1fr]">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", toneStyles[slide.tone])} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_84%_8%,rgba(255,255,255,0.18),transparent_22%),linear-gradient(135deg,rgba(2,6,23,0.05),rgba(2,6,23,0.76))]" />
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full border border-white/15" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full border border-white/10" />

      <div className="relative flex flex-col justify-between p-8 md:p-12">
        <div>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/20 px-5 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]" />
            {slide.eyebrow}
          </div>
          <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/25 bg-white/15 shadow-2xl shadow-black/20 backdrop-blur transition-transform duration-500 group-hover:scale-105">
            <Icon className="h-20 w-20" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <div className="text-7xl font-black leading-none text-white/15 md:text-9xl">{String(index + 1).padStart(2, "0")}</div>
          {slide.impact && (
            <div className="max-w-sm rounded-2xl border border-white/25 bg-white/15 p-5 text-2xl font-black uppercase leading-tight tracking-tight shadow-xl shadow-black/20 backdrop-blur">
              {slide.impact}
            </div>
          )}
        </div>
      </div>

      <div className="relative flex flex-col justify-center bg-slate-950/65 p-8 backdrop-blur-sm md:p-14">
        <h2 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">{slide.title}</h2>
        <p className="mt-7 max-w-2xl text-xl font-medium leading-relaxed text-white/78 md:text-2xl">{slide.subtitle}</p>
        <div className="mt-10 grid gap-4">
          {slide.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.08] p-5 shadow-lg shadow-black/10 backdrop-blur">
              <CheckCircle2 className="mt-1 h-6 w-6 flex-none text-emerald-300" />
              <p className="text-lg font-semibold leading-snug text-white/90">{bullet}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const handlePrint = () => window.print();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-6 py-12 print:hidden md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.28),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(245,158,11,0.22),transparent_24%),linear-gradient(135deg,#020617,#0f172a_55%,#111827)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-amber-100">
              <Flame className="h-4 w-4" /> Treinamento NR 35
            </div>
            <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl">
              Trabalho em Altura em <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-red-500 bg-clip-text text-transparent">25 slides visuais</span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">
              Material pronto para apresentação, integração, DDS ampliado ou impressão em PDF. Conteúdo direto, visual forte e focado em comportamento seguro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AgendaPill>25 slides</AgendaPill>
              <AgendaPill>NR 35</AgendaPill>
              <AgendaPill>Quedas • EPI • Resgate</AgendaPill>
              <AgendaPill>HTML premium</AgendaPill>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button onClick={handlePrint} className="h-14 rounded-2xl bg-amber-400 px-8 text-base font-black text-slate-950 hover:bg-amber-300">
              Imprimir / salvar PDF
            </Button>
            <Button variant="outline" asChild className="h-14 rounded-2xl border-white/20 bg-white/10 px-8 text-base font-black text-white hover:bg-white/20 hover:text-white">
              <a href="/nr35-premium.html" target="_blank" rel="noreferrer">Abrir HTML premium</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="slides" className="space-y-10 px-4 py-10 print:space-y-0 print:p-0 md:px-8">
        {slides.map((slide, index) => (
          <SlideCard key={slide.eyebrow} slide={slide} index={index} />
        ))}
      </section>

      <section className="border-t border-white/10 px-6 py-10 text-center text-slate-400 print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <HelpCircle className="h-6 w-6 text-amber-300" />
          <p className="text-sm md:text-base">Use este material como base e complemente com procedimentos internos, equipamentos reais da empresa e riscos específicos da atividade.</p>
        </div>
      </section>
    </main>
  );
};

export default Index;
