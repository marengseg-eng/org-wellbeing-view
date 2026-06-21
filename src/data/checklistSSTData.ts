export interface ChecklistItemTemplate {
  id: string;
  categoria: string;
  descricao: string;
  norma: string;
}

export const CHECKLIST_CATEGORIAS = [
  "EPIs",
  "EPCs",
  "Instalações Elétricas",
  "Incêndio",
  "Ergonomia",
  "Máquinas e Equipamentos",
  "Produtos Químicos",
  "Saúde Ocupacional",
  "Documentação",
] as const;

export type CategoriaSST = (typeof CHECKLIST_CATEGORIAS)[number];

export const CHECKLIST_ITEMS_TEMPLATE: ChecklistItemTemplate[] = [
  // ===== EPIs — NR-6 =====
  { id: "epi-01", categoria: "EPIs", descricao: "Capacetes de proteção fornecidos, certificados (CA) e em bom estado de conservação", norma: "NR-6 §6.3" },
  { id: "epi-02", categoria: "EPIs", descricao: "Óculos de proteção adequados ao tipo de risco (impacto, química, UV) com CA válido", norma: "NR-6 §6.3" },
  { id: "epi-03", categoria: "EPIs", descricao: "Luvas de proteção fornecidas conforme o agente de risco (química, mecânica, elétrica)", norma: "NR-6 §6.3" },
  { id: "epi-04", categoria: "EPIs", descricao: "Calçados de segurança (biqueira de aço / dielétrico / impermeável) com CA e em uso", norma: "NR-6 §6.3" },
  { id: "epi-05", categoria: "EPIs", descricao: "Protetores auriculares (moldados ou inserção) fornecidos onde NEN > 85 dB(A)", norma: "NR-6 / NR-15 Anexo 1" },
  { id: "epi-06", categoria: "EPIs", descricao: "Respiradores/máscaras com filtro adequado (P2, P3, vapores orgânicos) com CA e prazo vigente", norma: "NR-6 §6.3" },
  { id: "epi-07", categoria: "EPIs", descricao: "Cintos de segurança tipo paraquedista + talabarte fornecidos para trabalho em altura > 2 m", norma: "NR-6 / NR-35 §35.4" },
  { id: "epi-08", categoria: "EPIs", descricao: "Registro de entrega de EPIs assinado pelo trabalhador (ficha de EPI) arquivado", norma: "NR-6 §6.7" },
  { id: "epi-09", categoria: "EPIs", descricao: "Trabalhadores treinados para uso, guarda, higienização e descarte correto dos EPIs", norma: "NR-6 §6.7.1" },

  // ===== EPCs — NR-26 / NR-12 =====
  { id: "epc-01", categoria: "EPCs", descricao: "Extintores de incêndio sinalizados, com lacre, pressão adequada e prazo de validade vigente", norma: "NR-23 §23.9 / ABNT NBR 12693" },
  { id: "epc-02", categoria: "EPCs", descricao: "Hidrantes e sistemas fixos de combate a incêndio com mangueiras e esguichos em boas condições", norma: "NR-23 §23.10" },
  { id: "epc-03", categoria: "EPCs", descricao: "Chuveiros de emergência (deluge/eye-wash) instalados nas áreas de risco químico e funcionais", norma: "NR-26 §26.12" },
  { id: "epc-04", categoria: "EPCs", descricao: "Sinalização de segurança (proibição, advertência, obrigação, emergência) conforme NR-26 em toda a planta", norma: "NR-26 §26.1" },
  { id: "epc-05", categoria: "EPCs", descricao: "Proteções fixas e móveis em máquinas e equipamentos com partes móveis acessíveis instaladas", norma: "NR-12 §12.38" },
  { id: "epc-06", categoria: "EPCs", descricao: "Barreiras e guardas de proteção coletiva em buracos, valas, plataformas e passagens elevadas", norma: "NR-18 §18.6 / NR-12" },

  // ===== Instalações Elétricas — NR-10 =====
  { id: "ele-01", categoria: "Instalações Elétricas", descricao: "Quadros de distribuição elétrica sinalizados, identificados, com proteções adequadas e fechados à chave", norma: "NR-10 §10.2.8" },
  { id: "ele-02", categoria: "Instalações Elétricas", descricao: "Sistema de aterramento elétrico implantado, com medição de resistência conforme ABNT NBR 5410", norma: "NR-10 §10.2.9 / ABNT NBR 5410" },
  { id: "ele-03", categoria: "Instalações Elétricas", descricao: "Procedimento de Bloqueio/Etiquetagem (Lock-out/Tag-out) implementado e utilizado na manutenção", norma: "NR-10 §10.6.2" },
  { id: "ele-04", categoria: "Instalações Elétricas", descricao: "Distâncias seguras de aproximação a partes energizadas respeitadas e demarcadas", norma: "NR-10 Anexo II" },
  { id: "ele-05", categoria: "Instalações Elétricas", descricao: "Trabalhadores que atuam em instalações elétricas com habilitação NR-10 (básico ou SEP) vigente", norma: "NR-10 §10.8" },
  { id: "ele-06", categoria: "Instalações Elétricas", descricao: "Diagrama unifilar e documentação técnica das instalações elétricas atualizados", norma: "NR-10 §10.2.2" },

  // ===== Incêndio — NR-23 =====
  { id: "inc-01", categoria: "Incêndio", descricao: "Saídas de emergência desobstruídas, sinalizadas com iluminação de emergência funcional", norma: "NR-23 §23.4" },
  { id: "inc-02", categoria: "Incêndio", descricao: "Plano de Prevenção e Proteção Contra Incêndio (PPCI) aprovado pelo Corpo de Bombeiros e vigente", norma: "NR-23 §23.2 / IT CBPMESP" },
  { id: "inc-03", categoria: "Incêndio", descricao: "Brigada de Incêndio constituída, treinada e dimensionada conforme ABNT NBR 14276", norma: "NR-23 §23.8 / ABNT NBR 14276" },
  { id: "inc-04", categoria: "Incêndio", descricao: "Extintores sem vencimento, com carga verificada e posicionados corretamente (máx. 5 m²/extintor em risco alto)", norma: "NR-23 §23.9 / ABNT NBR 12693" },
  { id: "inc-05", categoria: "Incêndio", descricao: "Simulacro de evacuação realizado ao menos uma vez ao ano com registro documentado", norma: "NR-23 §23.8 / ABNT NBR 14276" },
  { id: "inc-06", categoria: "Incêndio", descricao: "Mapa de rotas de fuga afixado nos setores com pontos de encontro definidos e sinalizados", norma: "NR-23 §23.4" },

  // ===== Ergonomia — NR-17 =====
  { id: "erg-01", categoria: "Ergonomia", descricao: "Análise Ergonômica do Trabalho (AET) realizada ou atualizada para os GHEs identificados", norma: "NR-17 §17.3.2" },
  { id: "erg-02", categoria: "Ergonomia", descricao: "Mobiliário (cadeiras, mesas, bancadas) ajustável ao porte do trabalhador conforme NR-17 Tabela 1", norma: "NR-17 §17.5.1" },
  { id: "erg-03", categoria: "Ergonomia", descricao: "Iluminamento nos postos de trabalho dentro dos valores mínimos (≥ 500 lux para leitura/montagem)", norma: "NR-17 §17.5.3.1 / ABNT NBR ISO 8995-1" },
  { id: "erg-04", categoria: "Ergonomia", descricao: "Nível de ruído ocupacional avaliado; áreas com NEN > 85 dB(A) com EPI e EPC implementados", norma: "NR-17 §17.5.2 / NR-15 Anexo 1" },
  { id: "erg-05", categoria: "Ergonomia", descricao: "Temperatura e umidade dentro dos limites (18–28 °C; umidade ≥ 40%) nos ambientes de trabalho fechado", norma: "NR-17 §17.5.2.2" },
  { id: "erg-06", categoria: "Ergonomia", descricao: "Pausas para recuperação psicofisiológica implementadas nas atividades com trabalho repetitivo", norma: "NR-17 §17.4.3.2" },
  { id: "erg-07", categoria: "Ergonomia", descricao: "Atividades de transporte manual de cargas acima de 20 kg avaliadas e com controles implementados", norma: "NR-17 §17.4.2" },

  // ===== Máquinas e Equipamentos — NR-12 =====
  { id: "maq-01", categoria: "Máquinas e Equipamentos", descricao: "Inventário de máquinas e equipamentos com avaliação de risco por máquina (NR-12 Anexo II)", norma: "NR-12 §12.4" },
  { id: "maq-02", categoria: "Máquinas e Equipamentos", descricao: "Proteções e dispositivos de segurança (fixos, reguláveis, sensores) em todas as zonas de risco", norma: "NR-12 §12.38" },
  { id: "maq-03", categoria: "Máquinas e Equipamentos", descricao: "Dispositivos de parada de emergência (cogumelos) em posição acessível e testados periodicamente", norma: "NR-12 §12.57" },
  { id: "maq-04", categoria: "Máquinas e Equipamentos", descricao: "Programa de manutenção preventiva documentado e executado com ordens de serviço registradas", norma: "NR-12 §12.106" },
  { id: "maq-05", categoria: "Máquinas e Equipamentos", descricao: "Operadores com treinamento específico NR-12 documentado e atualizado conforme periodicidade", norma: "NR-12 §12.126" },
  { id: "maq-06", categoria: "Máquinas e Equipamentos", descricao: "Manual de operação e segurança (em português) disponível no posto de trabalho das máquinas", norma: "NR-12 §12.127" },

  // ===== Produtos Químicos — NR-20 / NR-26 =====
  { id: "quim-01", categoria: "Produtos Químicos", descricao: "FISPQ (Fichas de Informação de Segurança) disponíveis e acessíveis para todos os produtos químicos usados", norma: "NR-26 §26.2 / ABNT NBR 14725" },
  { id: "quim-02", categoria: "Produtos Químicos", descricao: "Armazenamento de produtos inflamáveis em áreas ventiladas, com piso impermeável e contenção secundária", norma: "NR-20 §20.7 / NR-26 §26.5" },
  { id: "quim-03", categoria: "Produtos Químicos", descricao: "Rotulagem dos recipientes de produtos químicos perigosos conforme padrão GHS/SGH", norma: "NR-26 §26.2 / GHS" },
  { id: "quim-04", categoria: "Produtos Químicos", descricao: "EPIs específicos para manuseio de produtos químicos (luvas, avental, óculos splash) fornecidos e em uso", norma: "NR-6 / NR-20 §20.8" },
  { id: "quim-05", categoria: "Produtos Químicos", descricao: "Treinamento sobre riscos químicos e uso de FISPQ realizado para todos os trabalhadores expostos", norma: "NR-26 §26.7 / NR-20 §20.6" },

  // ===== Saúde Ocupacional — NR-7 =====
  { id: "sau-01", categoria: "Saúde Ocupacional", descricao: "PCMSO (Programa de Controle Médico de Saúde Ocupacional) elaborado por médico coordenador e vigente", norma: "NR-7 §7.2.1" },
  { id: "sau-02", categoria: "Saúde Ocupacional", descricao: "ASOs (Atestados de Saúde Ocupacional) emitidos para todos: admissional, periódico e demissional", norma: "NR-7 §7.4.4" },
  { id: "sau-03", categoria: "Saúde Ocupacional", descricao: "Exames complementares (audiometria, espirometria, hemograma etc.) realizados conforme PCMSO e prazos", norma: "NR-7 §7.4.1" },
  { id: "sau-04", categoria: "Saúde Ocupacional", descricao: "Campanhas de vacinação (Hepatite B, Tétano, Febre Amarela conforme exposição) oferecidas e documentadas", norma: "NR-7 §7.2.5" },
  { id: "sau-05", categoria: "Saúde Ocupacional", descricao: "Registros de saúde (prontuários individuais) mantidos pelo médico coordenador por mínimo 20 anos", norma: "NR-7 §7.4.5" },

  // ===== Documentação — NR-1 =====
  { id: "doc-01", categoria: "Documentação", descricao: "PGR (Programa de Gerenciamento de Riscos) elaborado, aprovado e divulgado aos trabalhadores", norma: "NR-1 §1.5.1" },
  { id: "doc-02", categoria: "Documentação", descricao: "Inventário de Riscos e Plano de Ação do PGR atualizados (revisão mínima bienal ou após mudanças)", norma: "NR-1 §1.5.2" },
  { id: "doc-03", categoria: "Documentação", descricao: "Laudo de Conformidade NR-10 (instalações elétricas) emitido por profissional habilitado e vigente", norma: "NR-10 §10.2.2" },
  { id: "doc-04", categoria: "Documentação", descricao: "Laudo de Conformidade NR-12 (máquinas e equipamentos) emitido e disponível para fiscalização", norma: "NR-12 §12.174" },
  { id: "doc-05", categoria: "Documentação", descricao: "CIPA constituída (ou designado) conforme dimensionamento NR-5 Quadro I e ata de posse arquivada", norma: "NR-5 §5.6" },
  { id: "doc-06", categoria: "Documentação", descricao: "SESMT (Serviço Especializado em Engenharia de Segurança e Medicina do Trabalho) dimensionado conforme NR-4", norma: "NR-4 Quadro II" },
  { id: "doc-07", categoria: "Documentação", descricao: "CAT (Comunicações de Acidente de Trabalho) emitidas tempestivamente para todos os acidentes/doenças", norma: "CLT §169 / NR-1" },
];
