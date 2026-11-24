# OVERKILL — Development

- Run the tests with `npm test` (Node 18 or newer, no dependencies). Tests live in `tests/`.
- After changing any cached file, run `npm run stamp`: it updates the service worker version so users get the new files. The tests fail if you forget.
- `src/core.js` is the math engine (no page elements); every other file in `src/` is a module that depends on it. Scripts share one global scope, so load order in `index.html` matters.

# OVERKILL — Desenvolvimento

- Rode os testes com `npm test` (Node 18 ou mais novo, sem dependências). Os testes ficam em `tests/`.
- Depois de mudar qualquer arquivo em cache, rode `npm run stamp`: ele atualiza a versão do service worker para os usuários receberem os arquivos novos. Os testes falham se você esquecer.
- O `src/core.js` é o motor matemático (sem elementos da página); os outros arquivos de `src/` são módulos que dependem dele. Os scripts compartilham um escopo global, então a ordem no `index.html` importa.
