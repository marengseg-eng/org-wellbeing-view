import type { FactorKey } from "./factorDefinitions";

export const LIKERT_OPTIONS = [
  { value: 0, label: "NUNCA" },
  { value: 1, label: "RARAMENTE" },
  { value: 2, label: "EVENTUALMENTE" },
  { value: 3, label: "COM FREQUÊNCIA" },
  { value: 4, label: "COM MUITA FREQUÊNCIA" },
] as const;

export interface Questao {
  id: number;
  texto: string;
  fator: FactorKey;
  invertida?: boolean; // true = pergunta positiva (pontuação invertida)
}

export const QUESTOES: Questao[] = [
  { id: 1, texto: "Você NÃO tem possibilidade de fazer pausas durante o seu dia de trabalho para descansar, beber água ou fazer suas necessidades fisiológicas?", fator: "ritmo" },
  { id: 2, texto: "Na sua rotina, você precisa manter um ritmo intenso de trabalho, que considere anormal, com sobrecarga de esforço?", fator: "sobrecarga" },
  { id: 3, texto: "Você tem que trabalhar em turnos diferentes ao longo da semana?", fator: "fadiga" },
  { id: 4, texto: "Você considera seu trabalho monótono, com tarefas repetitivas e sem esforço mental?", fator: "ritmo" },
  { id: 5, texto: "Você trabalha em turno noturno (das 22h às 5h)?", fator: "fadiga" },
  { id: 6, texto: "Suas tarefas são determinadas por metas de produção fixas e rigorosas?", fator: "remuneracao" },
  { id: 7, texto: "A sua remuneração está diretamente ligada à quantidade de trabalho produzido?", fator: "remuneracao" },
  { id: 8, texto: "O ritmo do seu trabalho é controlado por um equipamento ou máquina (ferramentas externas, como sistemas, cronômetro)?", fator: "ritmo" },
  { id: 9, texto: "Você costuma realizar muitas demandas ao mesmo tempo que exigem muita atenção?", fator: "atencao" },
  { id: 10, texto: "Você sente que não tem autonomia para tomar decisões sobre suas tarefas?", fator: "autonomia" },
  { id: 11, texto: "Você é impedido de realizar seus intervalos de refeição ou descanso entre jornadas?", fator: "sobrecarga" },
  { id: 12, texto: "O seu trabalho exige o uso excessivo ou intenso da sua voz (ex: falar alto, por longos períodos)?", fator: "fadiga" },
  { id: 13, texto: "No trabalho você passa por situações frequentes e excessivas de estresse?", fator: "estresse" },
  { id: 14, texto: "Você sente que a quantidade de informações e decisões no trabalho é excessiva e constante?", fator: "atencao" },
  { id: 15, texto: "Seu trabalho demanda um nível frequente e excessivo de atenção, onde um erro pode gerar consequências graves?", fator: "atencao" },
  { id: 16, texto: "Você possui dificuldade em se comunicar com outras pessoas devido ao ambiente (colegas ou superiores, ruído, distância, ferramentas inadequadas, barreiras)?", fator: "conflitos" },
  { id: 17, texto: "O seu trabalho traz sobrecarga emocional, envolvendo sofrimento humano ou animal que geram impacto emocional significativo para você?", fator: "emocional" },
  { id: 18, texto: "Você costuma receber ordens ou metas de diversas fontes que se contradizem?", fator: "lideranca" },
  { id: 19, texto: "As lideranças são avaliadas pela capacidade de manter ambientes saudáveis?", fator: "lideranca", invertida: true },
];

/** Dado as respostas (questionId → valor 0-4), calcula o % de cada fator (0-100) */
export function calcularFatoresPorQuestionario(
  respostas: Record<number, number>
): Record<string, number> {
  const somas: Record<string, number> = {};
  const contagens: Record<string, number> = {};

  QUESTOES.forEach((q) => {
    if (respostas[q.id] === undefined) return;
    let valor = respostas[q.id];
    if (q.invertida) valor = 4 - valor; // inverter escala para perguntas positivas
    if (!somas[q.fator]) { somas[q.fator] = 0; contagens[q.fator] = 0; }
    somas[q.fator] += valor;
    contagens[q.fator] += 1;
  });

  const resultado: Record<string, number> = {};
  Object.keys(somas).forEach((fator) => {
    const maxPossivel = contagens[fator] * 4;
    resultado[fator] = maxPossivel > 0 ? Math.round((somas[fator] / maxPossivel) * 100) : 0;
  });

  return resultado;
}

/** Escala de conformidade do questionário: 0-20 pontos */
export function calcularEscalaConformidade(respostas: Record<number, number>): {
  pontuacao: number;
  nivel: string;
  cor: string;
} {
  // Soma invertida: NUNCA=4, RARAMENTE=3, EVENTUALMENTE=2, COM FREQUÊNCIA=1, COM MUITA FREQUÊNCIA=0
  // Exceto questão 19 que já é positiva (não inverter novamente)
  let total = 0;
  let respondidas = 0;
  QUESTOES.forEach((q) => {
    if (respostas[q.id] === undefined) return;
    respondidas++;
    if (q.invertida) {
      total += respostas[q.id]; // já é positiva
    } else {
      total += (4 - respostas[q.id]); // inverter: NUNCA = melhor = 4 pontos
    }
  });
  // Normalizar para escala 0-20 (19 questões × 4 = 76 máx → mapear para 0-20)
  const pontuacao = respondidas > 0 ? Math.round((total / (respondidas * 4)) * 20) : 0;

  let nivel: string;
  let cor: string;
  if (pontuacao >= 17) { nivel = "EXCELENTE (CONFORME)"; cor = "hsl(152,60%,42%)"; }
  else if (pontuacao >= 13) { nivel = "BOM (EM EVOLUÇÃO)"; cor = "hsl(152,40%,55%)"; }
  else if (pontuacao >= 9) { nivel = "REGULAR (PRECISA MELHORAR)"; cor = "hsl(45,93%,47%)"; }
  else if (pontuacao >= 5) { nivel = "ALTO RISCO"; cor = "hsl(25,95%,53%)"; }
  else { nivel = "CRÍTICO"; cor = "hsl(0,72%,51%)"; }

  return { pontuacao, nivel, cor };
}
