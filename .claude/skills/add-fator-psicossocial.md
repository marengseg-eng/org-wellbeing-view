---
description: Adiciona um novo fator psicossocial completo ao sistema SST (ALL_FACTORS, SECTOR_FACTORS, FACTOR_RECOMMENDATIONS, FACTOR_5W2H_TEMPLATES)
---

# Add Fator Psicossocial

Quando o usuário invocar esta skill, você deve coletar as informações necessárias e adicionar o novo fator em **todos os 4 lugares obrigatórios** em `src/data/factorDefinitions.ts`.

## Passo 1 — Coletar dados

Se o usuário não forneceu os dados, pergunte:
1. **key** — identificador snake_case (ex: `assedio_moral`)
2. **label** — nome legível (ex: `"Assédio Moral"`)
3. **weight** — peso de 1.0 a 1.5 (1.0 = padrão, 1.5 = crítico)
4. **norma** — referência normativa (ex: `"NR-01, ISO 45003"`)
5. **setores** — em quais setores aplica: GERAL, CONSTRUÇÃO, SAÚDE, ESCRITÓRIO, INDÚSTRIA
6. **recomendações** — liste 5 a 9 ações recomendadas (pode gerar baseado no contexto SST)
7. **5W2H** — template de plano de ação (pode gerar automaticamente)

## Passo 2 — Ler o arquivo

Leia `src/data/factorDefinitions.ts` completo antes de editar.

## Passo 3 — Editar em 4 lugares

### Lugar 1: ALL_FACTORS (array no topo)
Adicione ao final do array, antes do `] as const`:
```typescript
{ key: "<key>", label: "<label>", weight: <weight>, norma: "<norma>" },
```

### Lugar 2: SECTOR_FACTORS
Para cada setor selecionado, adicione `"<key>"` ao array correspondente.

### Lugar 3: FACTOR_RECOMMENDATIONS
Adicione entrada com 5-9 recomendações técnicas em português, referenciando as normas:
```typescript
<key>: [
  "Recomendação 1 — referenciando NR-XX art. X...",
  ...
],
```

### Lugar 4: FACTOR_5W2H_TEMPLATES
Adicione template completo:
```typescript
<key>: {
  what: "O que fazer — ação principal",
  why: "Por quê — Fator <label> representa risco conforme <norma>",
  where: "Onde — setores afetados",
  when: "Quando — prazo (ex: 30 dias — curto prazo)",
  who: "Quem — SESMT, RH, Gestores",
  how: "Como — método de implementação",
  howMuch: "A definir conforme diagnóstico",
},
```

## Passo 4 — Verificar TypeScript

Após editar, verifique se o tipo `FactorKey` foi atualizado automaticamente (é derivado do `ALL_FACTORS` via `typeof`). Não é necessário alterar manualmente.

## Passo 5 — Confirmar

Liste para o usuário os 4 lugares onde o fator foi adicionado e sugira criar questões com `/gerar-questoes`.
