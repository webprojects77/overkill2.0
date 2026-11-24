# Segurança — checklist técnico da OVERKILL

Este documento é um plano de verificação, não uma declaração de que todos os controles já existem.

## Observações do código consultado
- README declara parser matemático próprio, sem `eval`.
- Aplicação descrita como local-first, sem conta e sem servidor para cálculos.
- Service Worker guarda arquivos estáticos para uso offline.
- A fonte “Metal Mania” é servida localmente (`fonts/`), sem Google Fonts.
Essas observações não substituem auditoria completa do código e da hospedagem.

## Antes do lançamento
- [ ] Confirmar que nenhuma entrada é executada como JavaScript.
- [ ] Revisar parser, álgebra simbólica, importação JSON e renderização de notas contra XSS.
- [ ] Validar tamanho e formato de campos e arquivos importados.
- [ ] Revisar dependências e licenças.
- [ ] Remover chaves, tokens, senhas e dados pessoais de commits.
- [ ] Configurar HTTPS e redirecionamento.
- [ ] Configurar CSP e cabeçalhos HTTP de segurança.
- [ ] Revisar escopo e atualização do Service Worker.
- [ ] Testar entradas inválidas, grandes e inesperadas.
- [ ] Definir canal privado de reporte de vulnerabilidades.

## Parser e importações
- Não usar `eval`, `new Function` ou equivalentes.
- Tratar expressões como linguagem própria, com parser e avaliador limitados.
- Preferir `textContent` e APIs DOM seguras; evitar `innerHTML` com conteúdo do usuário.
- Validar JSON importado com esquema, limites de tamanho, tipos e profundidade.
- Tratar arquivos importados como dados não confiáveis.
- Limitar cálculos que possam consumir tempo ou memória excessivos.

## Service Worker
- Versionar cache em atualizações relevantes.
- Não armazenar respostas privadas ou dados de terceiros.
- Testar instalação, atualização, offline e recuperação após falha.
- Confirmar comportamento de rotas inexistentes.

## Oracle/IA futuro
Antes de ativar, explicar dados enviados e provedor; não embutir chave secreta compartilhada no código público; deixar claro custo potencial; permitir desativar; validar comandos estruturados; nunca executar código arbitrário retornado por modelo; atualizar privacidade e termos.

## Registro
| Data | Versão/commit | Verificação | Resultado | Responsável |
|---|---|---|---|---|
| [PREENCHER] | [PREENCHER] | [PREENCHER] | [PREENCHER] | [PREENCHER] |
