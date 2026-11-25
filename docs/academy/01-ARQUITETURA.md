# 01 — Arquitetura

Componentes previstos (Documento 00 §18):
site institucional, autenticação, contas, inscrições, avaliação diagnóstica, motor adaptativo, gerenciador curricular, aulas, exercícios, correção, progresso, perfil acadêmico, biblioteca multimídia, colaboradores, certificação, suporte, painel administrativo, notificações, integração OVERKILL.

Separação de responsabilidades (§18.2):
- Site institucional não carrega a lógica acadêmica.
- Autenticação não depende da interface.
- Motor de avaliação não depende dos componentes das aulas.
- Conteúdo pode ser atualizado sem alterar a plataforma inteira.

Local-first (§18.3): a calculadora funciona local. A Academy usa serviços online para autenticação, contas, avaliações, sincronização e colaboração. Cada funcionalidade deve declarar se depende de conexão.

Decisão de stack (proposta aprovada no plano): Academy nova é um app do template gerenciado (Bun, Hono, Drizzle + Turso, React). O repositório estático `overkill` permanece como calculadora.

Persistência (§18.1): contas, inscrições, cursos, aulas, questões, tentativas, resultados, competências, progresso, certificados, colaboradores, arquivos, registros administrativos. Backup, recuperação e migração são requisitos.
