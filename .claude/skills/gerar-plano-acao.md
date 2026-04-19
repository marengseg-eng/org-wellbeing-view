---
description: Gera um plano de ação 5W2H completo a partir de fatores de risco elevados de uma avaliação SST
---

# Gerar Plano de Ação 5W2H

Cria ações 5W2H prontas para uso, baseadas nos fatores com risco "Atenção", "Elevado" ou "Crítico".

## Estrutura 5W2H do sistema

```typescript
interface Acao5W2H {
  id: string;
  what: string;    // O quê — ação a executar
  why: string;     // Por quê — justificativa normativa
  where: string;   // Onde — local/setor
  when: string;    // Quando — prazo
  who: string;     // Quem — responsável
  how: string;     // Como — método
  howMuch: string; // Quanto custa
  status: "pendente" | "em_andamento" | "concluida";
}
```

## Classificação de urgência por prazo

- **Crítico** → 15 dias — urgente
- **Elevado** → 30 dias — curto prazo
- **Atenção** → 60-90 dias — médio prazo
- **Conforme** → não gera ação

## Passo 1 — Coletar contexto

Pergunte ao usuário:
1. **Empresa** — nome da empresa avaliada
2. **Setor** — tipo do setor (GHE)
3. **Fatores críticos** — quais fatores e suas classificações (ex: ritmo=Crítico, sobrecarga=Elevado)

## Passo 2 — Carregar templates

Leia `src/data/factorDefinitions.ts` para usar os `FACTOR_5W2H_TEMPLATES` e `FACTOR_RECOMMENDATIONS` como base para cada fator informado.

## Passo 3 — Gerar ações

Para cada fator com risco elevado, gere uma `Acao5W2H` com:
- `id`: `rec-<fator>-<index>`
- `what`: use o template ou a recomendação mais prioritária
- `why`: inclua o fator, classificação e norma referenciada
- `where`: `<empresa> — <setor>`
- `when`: prazo conforme urgência acima
- `who`: adapte ao setor (ex: SESMT, médico do trabalho para SAÚDE)
- `how`: detalhe o método do template
- `howMuch`: `"A definir conforme diagnóstico e orçamento"`
- `status`: `"pendente"`

## Passo 4 — Apresentar resultado

Mostre as ações em tabela markdown com colunas: Fator | O quê | Prazo | Responsável | Status.

Ofereça exportar como JSON para colar na aplicação ou gerar um relatório em PDF.

## Passo 5 — Sugerir próximos passos

- Fatores novos identificados → `/add-fator-psicossocial`
- Setor sem mapeamento → `/novo-setor`
- Questões insuficientes → `/gerar-questoes`
