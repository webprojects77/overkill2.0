# Cookies e armazenamento local — OVERKILL

**Inventário inicial; revalidar na versão publicada.**

| Tecnologia | Evidência encontrada | Finalidade aparente |
|---|---|---|
| Cookies | Não foi encontrado `document.cookie` nos arquivos consultados | Nenhuma finalidade identificada no código analisado |
| `localStorage` | `src/app.js`, `src/notebook.js` | Histórico, preferências, variáveis, fórmulas e notebooks (chave `overkill:v1`) |
| `localStorage` | `src/experience.js` | Perfil de uso, tema, densidade, favoritos e se a tela de boas-vindas já foi vista (chave `overkill:prefs:v1`). Não contém dados pessoais. |
| Cache API / Service Worker | `sw.js` | Arquivos estáticos para uso offline |
| Google Fonts | `index.html` | Fonte “Metal Mania” |

`localStorage` e Cache API não são cookies, mas devem ser explicados quando armazenam informações no dispositivo.

## Banner de cookies
Com base apenas no código consultado, não há evidência suficiente para afirmar que a OVERKILL precise de banner de consentimento. Não adicione banner genérico sem identificar tecnologias que o justifiquem. Antes de decidir, inspecione a versão publicada, cookies próprios e de terceiros, analytics, publicidade, CDN, monitoramento e serviços de hospedagem.

Se forem usados cookies ou tecnologias não essenciais que exijam consentimento, ofereça escolhas claras (aceitar, rejeitar e personalizar), sem pré-selecionar opções não essenciais, e permita alterar/retirar a escolha.

## Inventário a completar
| Fornecedor | Tecnologia | Finalidade | Essencial? | Prazo | Ação |
|---|---|---|---|---|---|
| [PRECISA CONFIRMAR] | [PRECISA CONFIRMAR] | [PRECISA CONFIRMAR] | [PRECISA CONFIRMAR] | [PRECISA CONFIRMAR] | [PRECISA CONFIRMAR] |

## Revalidação
1. Abrir a produção em janela privada.
2. Inspecionar armazenamento do navegador.
3. Conferir cookies antes/depois de interagir.
4. Conferir requisições e domínios externos.
5. Repetir após instalar PWA e após atualizações.
6. Registrar data, navegador, versão e resultado.
