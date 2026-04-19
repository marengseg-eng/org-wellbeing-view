---
description: Cria um novo tipo de setor (GHE) com mapeamento de fatores psicossociais em SECTOR_FACTORS
---

# Novo Setor (GHE)

Adiciona um novo tipo de setor de avaliação ao sistema, com seus fatores psicossociais aplicáveis.

## Setores existentes (referência)

- `GERAL` — todos os 14 fatores
- `CONSTRUÇÃO` — fatores de risco físico e sobrecarga predominantes
- `SAÚDE` — inclui demanda emocional, assédio, ritmo intenso
- `ESCRITÓRIO` — foco em fatores cognitivos e relacionamentos
- `INDÚSTRIA` — fatores de ritmo, ruído, esforço físico

## Passo 1 — Coletar dados

Pergunte ao usuário:
1. **Nome do setor** — será a chave (ex: `TECNOLOGIA`, `EDUCAÇÃO`, `LOGÍSTICA`)
2. **Descrição** — contexto de trabalho do setor
3. **Fatores aplicáveis** — quais `FactorKey` fazem sentido para este setor

Se o usuário não souber os fatores, leia `src/data/factorDefinitions.ts` para listar todos os 14 fatores disponíveis e ajude a selecionar com base na descrição do setor.

## Passo 2 — Validar fatores

Confirme que todos os fatores selecionados existem no `ALL_FACTORS`. Se o setor precisar de um fator novo, sugira usar `/add-fator-psicossocial` primeiro.

## Passo 3 — Editar SECTOR_FACTORS

Leia `src/data/factorDefinitions.ts` e adicione ao objeto `SECTOR_FACTORS`:
```typescript
"<NOME_SETOR>": [
  "<fator1>",
  "<fator2>",
  // ... fatores selecionados
],
```

## Passo 4 — Verificar UI

O setor aparece como opção no dropdown da página. Verifique se há lógica de enum/opções em `src/pages/ResultadoOrganizacional.tsx` que precise ser atualizada (busque por `setorTipo` ou a lista de opções do select).

## Passo 5 — Confirmar

Liste o novo setor, seus fatores e o peso total ponderado calculado (soma dos weights dos fatores selecionados).
