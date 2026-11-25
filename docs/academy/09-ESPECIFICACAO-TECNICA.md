# 09 — Especificação técnica

Fontes: Documento 00 §5, §18, §19; Documento 12.

Stack proposta (aprovada no plano): app do template gerenciado com Bun, Hono, Drizzle e Turso (SQLite), React no frontend. Criado com `app_init`.

Autenticação (§5):
- E-mail e senha, Google, Microsoft. Telefone é item futuro.
- Confirmação de e-mail, recuperação de senha, proteção contra tentativas automatizadas, limitação de tentativas, sessões seguras, encerramento de sessões, log de eventos de segurança.
- Senhas em hash seguro, nunca em texto puro.
- Perfis: visitante, candidato, estudante, professor, colaborador, revisor, administrador. Criar conta não concede privilégio administrativo.

Segurança (§19): HTTPS; proteção de sessão; controle de permissões; validação de entrada; proteção de APIs; backups; logs de auditoria; monitoramento; política de retenção; exclusão de conta; consentimentos.

LGPD e dados de crianças e adolescentes: [PRECISA CONFIRMAR] se o público inclui menores. Isso define o fluxo de consentimento antes da fase 2.

Dados pessoais e acadêmicos não são públicos por padrão.

Operações administrativas relevantes geram log de auditoria.
