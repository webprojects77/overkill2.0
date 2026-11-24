# Como contribuir com a OVERKILL

1. Leia `README.md` e `MANUAL.md`.
2. Confira as funcionalidades atuais antes de propor mudanças.
3. Abra uma issue antes de mudanças grandes.
4. Nunca inclua chaves, tokens, senhas ou dados pessoais em commits.

## Bugs
Informe navegador/versão, dispositivo/sistema, passos para reproduzir, resultado esperado/observado e expressão mínima de teste sem dados pessoais.

## Funcionalidades
Explique o problema, comportamento esperado, exemplos matemáticos e limitações.

## Código
- Preserve o parser seguro: não use `eval` ou `new Function`.
- Trate expressões e arquivos importados como entradas não confiáveis.
- Prefira APIs DOM seguras; evite `innerHTML` com texto do usuário.
- Mantenha mensagens de erro claras.
- Atualize o manual quando o comportamento mudar.
- Atualize a lista do Service Worker ao adicionar arquivos essenciais.
- Teste casos inválidos e limites numéricos.

## Pull requests
Descreva o que mudou, por que, como testar, arquivos afetados e limitações conhecidas.
