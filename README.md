# OVERKILL

> Made by **777** · Discord: `777.imt`

[Português](#overkill-português)

## What it is

OVERKILL is a calculator that is growing into a complete math environment: scientific calculator, equation solver, matrices and graphing in a single place. It runs in the browser, offline, with no account and no server.

How to use it: see [MANUAL.md](MANUAL.md), which is also inside the app (the `?` button).

## Features so far

- Scientific calculator with a safe expression parser (no `eval`): `+ - * / ^ ! %`, parentheses, implicit multiplication (`2pi`, `3(4)`), constants `pi e phi tau`, `ans`, trigonometric, hyperbolic, logarithmic, root and rounding functions
- DEG/RAD modes, configurable precision, persistent history, physical keyboard and on-screen keypad, copy result
- Clear errors with the type and the position in the expression
- Variables and named formulas: `x=5`, `f(x,y)=x^2+y`
- Numeric solver: `solve(f, guess)` (Newton) and `solve(f, a, b)` (bisection), showing method, iterations, residual and tolerance
- Matrices: determinant, inverse, transpose, rank, product and linear systems `Ax = b`
- Graph Studio: `y = f(x)`, polar and parametric curves, up to 4 at once, zoom, pan, point tracer, roots in the visible window, PNG export
- Unit converter (length, mass, time, area, volume, speed, energy, pressure, data, temperature) that only converts inside the same category
- Developer tools: base conversion from 2 to 36, bitwise operations with 8/16/32/64-bit width, IEEE 754 viewer (double and float) and color converter (HEX, RGB, HSL)
- Statistics: mean, median, mode, quartiles, variance and standard deviation (population and sample), outliers, and linear regression with r, R² and prediction
- Installable app (PWA): works without internet after the first visit
- Number sets: real (ℝ), complex (ℂ, with rectangular and polar results), exact fractions (ℚ, no rounding errors: `0.1+0.2 = 3/10`) and high-precision decimals (Dec, 30 to 500 digits, correctly rounded: `sqrt(2)`, `pi`, `exp`, `ln`, trigonometry), switched with one button
- Symbolic derivatives (1st to 3rd order) with simplification and a numeric cross-check
- Symbolic algebra: exact polynomial expansion, factoring over the rationals, and integrals (indefinite and definite) with automatic verification of every result
- Notebook: sheets of calculation and note cells that recompute top to bottom, with their own variables, several saved notebooks, JSON import/export and Markdown reports
- Built-in manual (`?` button), the same file as `MANUAL.md`
- Four themes (Graphite, the default; Ember; Porcelain; Midnight) and two densities (Confortável shows full words, Compacta shows abbreviations); both apply live
- Usage profiles (Aprender, Trabalhar, Desenvolver, Explorar, Uso cotidiano) that reorder tabs and the home dashboard without blocking any feature
- The font "Metal Mania" is hosted with the app (SIL Open Font License, see `fonts/OFL-MetalMania.txt`); no request goes to third parties

## Coming in future versions

- Symbolic algebra: more general integrals and factoring beyond rational roots
- Graphs: implicit curves, 3D surfaces, intersections and extrema, SVG export
- Geometry
- Plugins
- Oracle (shown as "Em breve", not available yet): optional AI assistant (bring your own key) that turns problems into structured commands, runs them on the calculator's own engine and never reports a result the engine did not confirm

## Credits

Made by **777**, Discord `777.imt`.

## Documentation

- [MANUAL.md](MANUAL.md): user manual (also shown in the app with the `?` button)
- [docs/PRIVACIDADE.md](docs/PRIVACIDADE.md), [docs/TERMOS-DE-USO.md](docs/TERMOS-DE-USO.md), [docs/COOKIES.md](docs/COOKIES.md): privacy, terms and storage inventory. Items marked `[PRECISA CONFIRMAR]` are open and must be completed before publication.
- [docs/SEGURANCA.md](docs/SEGURANCA.md), [docs/PLANO-DE-TESTES.md](docs/PLANO-DE-TESTES.md), [docs/PLANO-DE-LANCAMENTO.md](docs/PLANO-DE-LANCAMENTO.md): security checklist, test plan and launch checklist
- [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md)

Local storage keys: `overkill:v1` (calculator state and notebooks) and `overkill:prefs:v1` (profile, theme, density, favorites).

Run the tests with `npm test`. After changing any file listed in `sw.js`, run `npm run stamp`.

---

# OVERKILL (Português)

> Feito por **777** · Discord: `777.imt`

[English](#overkill)

## O que é

O OVERKILL é uma calculadora que está virando um ambiente matemático completo: calculadora científica, resolução de equações, matrizes e gráficos num só lugar. Roda no navegador, offline, sem conta e sem servidor.

Como usar: veja o [MANUAL.md](MANUAL.md), que também está dentro do app (botão `?`).

## Funcionalidades até agora

- Calculadora científica com parser seguro (sem `eval`): `+ - * / ^ ! %`, parênteses, multiplicação implícita (`2pi`, `3(4)`), constantes `pi e phi tau`, `ans`, funções trigonométricas, hiperbólicas, logarítmicas, raízes e arredondamento
- Modos DEG/RAD, precisão configurável, histórico salvo, teclado físico e teclado na tela, copiar resultado
- Erros claros, com o tipo e a posição na expressão
- Variáveis e fórmulas nomeadas: `x=5`, `f(x,y)=x^2+y`
- Solver numérico: `solve(f, chute)` (Newton) e `solve(f, a, b)` (bisseção), mostrando método, iterações, resíduo e tolerância
- Matrizes: determinante, inversa, transposta, posto, produto e sistemas lineares `Ax = b`
- Graph Studio: curvas `y = f(x)`, polares e paramétricas, até 4 ao mesmo tempo, zoom, arrastar, rastreador de ponto, raízes na janela visível, exportar PNG
- Conversor de unidades (comprimento, massa, tempo, área, volume, velocidade, energia, pressão, dados, temperatura) que só converte dentro da mesma categoria
- Ferramentas para programadores: conversão de bases de 2 a 36, operações bit a bit com largura de 8/16/32/64 bits, visualizador IEEE 754 (double e float) e conversor de cores (HEX, RGB, HSL)
- Estatística: média, mediana, moda, quartis, variância e desvio padrão (populacional e amostral), outliers, e regressão linear com r, R² e previsão
- App instalável (PWA): funciona sem internet depois da primeira visita
- Conjuntos numéricos: reais (ℝ), complexos (ℂ, com resultado retangular e polar), frações exatas (ℚ, sem erro de arredondamento: `0.1+0.2 = 3/10`) e decimais de alta precisão (Dec, de 30 a 500 dígitos, arredondados corretamente: `sqrt(2)`, `pi`, `exp`, `ln`, trigonometria), alternados por um botão
- Derivadas simbólicas (1ª a 3ª ordem) com simplificação e conferência numérica
- Álgebra simbólica: expansão exata de polinômios, fatoração sobre os racionais e integrais (indefinidas e definidas) com verificação automática de cada resultado
- Notebook: folhas com células de cálculo e de nota que recalculam de cima para baixo, com variáveis próprias, vários notebooks salvos, importar/exportar JSON e relatórios em Markdown
- Manual dentro do app (botão `?`), o mesmo arquivo do `MANUAL.md`
- Quatro temas (Graphite, o padrão; Ember; Porcelain; Midnight) e duas densidades (Confortável mostra palavras inteiras, Compacta mostra abreviações); ambas valem na hora
- Perfis de uso (Aprender, Trabalhar, Desenvolver, Explorar, Uso cotidiano) que reorganizam as abas e o início sem bloquear nenhum recurso
- A fonte "Metal Mania" é hospedada junto com o app (licença SIL Open Font License, veja `fonts/OFL-MetalMania.txt`); nenhuma requisição vai para terceiros

## O que vem nas próximas versões

- Álgebra simbólica: integrais mais gerais e fatoração além das raízes racionais
- Gráficos: curvas implícitas, superfícies 3D, interseções e extremos, exportar SVG
- Geometria
- Plugins
- Oracle (marcado como "Em breve", ainda não disponível): assistente de IA opcional (com a sua própria chave) que transforma problemas em comandos estruturados, executa tudo no motor da calculadora e nunca mostra um resultado que o motor não confirmou

## Créditos

Feito por **777**, Discord `777.imt`.

## Documentação

- [MANUAL.md](MANUAL.md): manual do usuário (também aparece no app com o botão `?`)
- [docs/PRIVACIDADE.md](docs/PRIVACIDADE.md), [docs/TERMOS-DE-USO.md](docs/TERMOS-DE-USO.md), [docs/COOKIES.md](docs/COOKIES.md): privacidade, termos e inventário de armazenamento. Itens marcados com `[PRECISA CONFIRMAR]` estão em aberto e precisam ser fechados antes da publicação.
- [docs/SEGURANCA.md](docs/SEGURANCA.md), [docs/PLANO-DE-TESTES.md](docs/PLANO-DE-TESTES.md), [docs/PLANO-DE-LANCAMENTO.md](docs/PLANO-DE-LANCAMENTO.md): checklist de segurança, plano de testes e checklist de lançamento
- [CONTRIBUTING.md](CONTRIBUTING.md) e [SECURITY.md](SECURITY.md)

Chaves do armazenamento local: `overkill:v1` (estado da calculadora e notebooks) e `overkill:prefs:v1` (perfil, tema, densidade, favoritos).

Rode os testes com `npm test`. Depois de mudar qualquer arquivo listado em `sw.js`, rode `npm run stamp`.
