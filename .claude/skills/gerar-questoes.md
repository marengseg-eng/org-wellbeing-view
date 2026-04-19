---
description: Gera questões Likert para um fator psicossocial e adiciona em src/data/questionario.ts
---

# Gerar Questões de Questionário

Cria perguntas no formato Likert (NUNCA → COM MUITA FREQUÊNCIA) para um fator psicossocial existente.

## Escala Likert do sistema

```typescript
{ value: 0, label: "NUNCA" }
{ value: 1, label: "RARAMENTE" }
{ value: 2, label: "EVENTUALMENTE" }
{ value: 3, label: "COM FREQUÊNCIA" }
{ value: 4, label: "COM MUITA FREQUÊNCIA" }
```

**Importante sobre scoring:** Questões `invertida: true` têm pontuação invertida — são formuladas positivamente (ex: "Tenho autonomia..."). O sistema soma 4-valor automaticamente.

## Passo 1 — Coletar dados

Pergunte ao usuário:
1. **fator** — qual `FactorKey` existente (leia `src/data/factorDefinitions.ts` para listar as opções)
2. **quantidade** — quantas questões (recomendado: 2 a 4 por fator)
3. **textos** — o usuário pode fornecer os textos ou você pode gerá-los com base no contexto SST

## Passo 2 — Gerar textos de qualidade

Se o usuário pedir para gerar, crie questões que:
- Usem linguagem clara e direta para trabalhadores
- Misturem questões negativas (padrão) e positivas (invertida)
- Referenciem situações concretas do trabalho
- Evitem dupla negação

Exemplos de padrão para fator `ritmo`:
- Negativa: `"Sinto que o ritmo de trabalho exigido é excessivo para mim."` (invertida: false)
- Positiva: `"Consigo realizar minhas tarefas sem pressão excessiva de tempo."` (invertida: true)

## Passo 3 — Ler questionario.ts

Leia `src/data/questionario.ts` para encontrar o último `id` usado.

## Passo 4 — Editar questionario.ts

Adicione ao final do array `QUESTOES`, com IDs sequenciais:
```typescript
{
  id: <proximo_id>,
  texto: "<texto da questão>",
  fator: "<factorKey>",
  invertida: <true|false>,  // omitir se false
},
```

## Passo 5 — Confirmar

Mostre as questões adicionadas com seus IDs e explique o impacto no scoring do fator.
