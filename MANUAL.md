# OVERKILL --- Manual do Usuário

**Uma plataforma matemática que se recusa a ser apenas uma
calculadora.**

Este manual explica como usar os recursos disponíveis no OVERKILL. Ele
foi dividido em duas partes: um guia rápido para quem está começando e
uma referência para quem deseja conhecer os recursos com mais
profundidade.

> **Importante:** este documento descreve os recursos documentados na
> versão atual do projeto. Recursos planejados para versões futuras não
> são apresentados como se já estivessem disponíveis.

------------------------------------------------------------------------

## Sumário

1.  [Começando](#1-começando)
2.  [Conhecendo a interface](#2-conhecendo-a-interface)
3.  [Calculadora](#3-calculadora)
4.  [Variáveis e fórmulas](#4-variáveis-e-fórmulas)
5.  [Resolução de equações](#5-resolução-de-equações)
6.  [Números reais, complexos e
    racionais](#6-números-reais-complexos-e-racionais)
7.  [Matrizes](#7-matrizes)
8.  [Gráficos](#8-gráficos)
9.  [Ferramentas](#9-ferramentas)
10. [Notebook matemático](#10-notebook-matemático)
11. [Precisão, erros e limitações](#11-precisão-erros-e-limitações)
12. [Exemplos para praticar](#12-exemplos-para-praticar)
13. [Solução de problemas comuns](#13-solução-de-problemas-comuns)
14. [Glossário](#14-glossário)

------------------------------------------------------------------------

# Parte I --- Guia rápido

## 1. Começando

### 1.1 Abrir o OVERKILL

Abra o endereço publicado do OVERKILL em um navegador compatível. Também
é possível instalar o projeto como aplicativo:

-   **Android:** abra o site no Chrome, toque no menu de três pontos e
    escolha **Instalar app**, se a opção estiver disponível.
-   **iPhone/iPad:** abra o site no Safari, toque em **Compartilhar** e
    escolha **Adicionar à Tela de Início**, se disponível.

Depois da primeira visita, os recursos locais podem funcionar sem
conexão com a internet. Uma conexão ainda pode ser necessária para
carregar uma versão atualizada do aplicativo.

### 1.2 Primeira conta

1.  Abra a aba **Calculadora**.
2.  Digite `2+2` no campo de expressão.
3.  Observe o resultado.
4.  Pressione **Enter** ou toque em `=`.
5.  O cálculo confirmado será adicionado ao histórico.

O resultado pode ser tocado para copiá-lo. Uma expressão do histórico
pode ser selecionada para reutilizá-la.

### 1.3 As opções no topo

Na calculadora, há três configurações principais:

  Opção         Para que serve
  ------------- -------------------------------------------------------
  `ℝ / ℂ / ℚ`   Escolhe o conjunto numérico usado nos cálculos
  `DEG / RAD`   Define como os ângulos são interpretados
  Precisão      Escolhe a quantidade de dígitos exibidos: 8, 12 ou 15

Não sabe qual escolher? Comece com `ℝ` e `DEG`. Para cálculos com
frações exatas, experimente `ℚ`. Para operações com números que envolvem
`i`, use `ℂ`.

### 1.4 Início, perfis, temas e densidade

Na primeira abertura, a tela de boas-vindas pergunta como você pretende
usar o OVERKILL: **Aprender**, **Trabalhar**, **Desenvolver**, **Explorar**
ou **Uso cotidiano**. Você também pode escolher **Continuar sem
personalizar**, que equivale a Explorar.

-   O perfil só muda a ordem das abas, a ferramenta que abre primeiro e a
    ordem dos cartões na aba **Início**. Nenhum recurso fica bloqueado.
-   Na aba **Início**, a estrela fixa um módulo nos favoritos.
-   **Configurações** (ícone de engrenagem no topo) permite trocar o perfil,
    o tema (Graphite, Ember, Porcelain ou Midnight) e a densidade
    (Confortável ou Compacta). Também é possível rever a tela de boas-vindas.
-   **Oracle** aparece como "Em breve". Ele ainda não está disponível.

## 2. Conhecendo a interface

As áreas principais são:

-   **Início:** atalhos para os módulos, favoritos e cálculos recentes.
-   **Calculadora:** expressões, resultados, histórico, variáveis e
    fórmulas.
-   **Matrizes:** operações com matrizes e resolução de sistemas
    lineares.
-   **Gráfico:** visualização de funções cartesianas, polares e
    paramétricas.
-   **Ferramentas:** conversão de unidades, bases numéricas, operações
    com bits, IEEE 754, cores, álgebra, estatística e derivadas.
-   **Notebook:** folhas de trabalho com células de cálculo e anotações.

O botão `?`, quando presente na interface, abre o manual.

------------------------------------------------------------------------

# Parte II --- Usando a calculadora

## 3. Calculadora

### 3.1 Operações básicas

Digite expressões usando os operadores abaixo:

  Operador   Operação        Exemplo
  ---------- --------------- -----------
  `+`        Adição          `8+2`
  `-`        Subtração       `8-2`
  `*`        Multiplicação   `8*2`
  `/`        Divisão         `8/2`
  `^`        Potência        `2^3`
  `!`        Fatorial        `5!`
  `%`        Porcentagem     `10%`
  `( )`      Agrupamento     `(2+3)*4`

O OVERKILL respeita a precedência matemática. O operador `^` é
associativo à direita. Por isso, `2^3^2` é interpretado como `2^(3^2)`.
A expressão `-2^2` resulta em `-4`, pois a potência é calculada antes do
sinal negativo.

### 3.2 Multiplicação implícita

Em alguns casos, não é necessário digitar `*`:

-   `2pi` equivale a `2*pi`.
-   `3(4)` equivale a `3*(4)`.
-   `2sin(30)` equivale a `2*sin(30)`.

Se uma expressão ficar ambígua, prefira escrever o sinal `*`
explicitamente.

### 3.3 Resultado anterior

O nome `ans` representa o último resultado confirmado.

Também é possível começar uma nova expressão com `*`, `/` ou `^` para
continuar a partir do resultado anterior. Por exemplo, se o resultado
anterior for `10`, digitar `*2` equivale a `ans*2`.

### 3.4 Separadores

-   Use ponto para separar casas decimais: `1.5`.
-   Em funções com vários argumentos, use vírgula ou ponto e vírgula
    para separar os argumentos, conforme aceito pelo campo. Exemplo:
    `max(1,5,3)`.

Atenção: o ponto é o separador decimal. Não use vírgula como separador
decimal.

## 4. Constantes e funções

### 4.1 Constantes disponíveis

  Constante   Significado
  ----------- -----------------------------
  `pi`        Número π
  `e`         Número de Euler
  `phi`       Proporção áurea
  `tau`       Constante τ
  `ans`       Último resultado confirmado

### 4.2 Funções trigonométricas

`sin`, `cos`, `tan`, `asin`, `acos`, `atan`

### 4.3 Funções hiperbólicas

`sinh`, `cosh`, `tanh`

### 4.4 Raízes, logaritmos e exponenciais

  Função                Significado
  --------------------- ----------------------
  `sqrt(x)` ou `√(x)`   Raiz quadrada
  `cbrt(x)`             Raiz cúbica
  `ln(x)`               Logaritmo natural
  `log(x)`              Logaritmo na base 10
  `log2(x)`             Logaritmo na base 2
  `exp(x)`              Exponencial de x

### 4.5 Arredondamento e outras funções

`abs`, `floor`, `ceil`, `round`, `trunc`, `fact`, `mod`, `pow`, `min`,
`max`

Exemplos:

-   `sqrt(81)` → `9`
-   `log(100)` → `2`
-   `abs(-12)` → `12`
-   `max(3,8,5)` → `8`
-   `round(3.7)` → `4`

### 4.6 Graus e radianos

O modo angular altera a interpretação das funções trigonométricas:

-   Em `DEG`, os ângulos são interpretados em graus. Exemplo: `sin(30)`
    → `0.5`.
-   Em `RAD`, os ângulos são interpretados em radianos.

Escolha o modo adequado antes de calcular. Os gráficos usam radianos
independentemente dessa configuração.

## 5. Variáveis e fórmulas

Variáveis permitem guardar valores para reutilizá-los.

### 5.1 Criar uma variável

Digite:

``` text
x=5
```

Depois, use:

``` text
x*2
```

O OVERKILL utilizará o valor armazenado para `x`.

### 5.2 Criar uma fórmula

Uma fórmula recebe parâmetros e calcula uma expressão:

``` text
f(x)=x^2-2
```

Para calcular a fórmula em um valor:

``` text
f(3)
```

Também é possível criar fórmulas com mais de um parâmetro:

``` text
h(a,b)=a*b
h(4,5)
```

### 5.3 Gerenciar variáveis e fórmulas

O painel **Variáveis e fórmulas**, abaixo do histórico, lista os itens
definidos. Use o botão `×` para remover um item.

Os nomes começam com uma letra e não diferenciam maiúsculas de
minúsculas. Não use nomes já reservados para funções ou constantes, como
`sin`, `pi` ou `ans`. Fórmulas não podem chamar a si mesmas.

## 6. Resolução de equações

O OVERKILL oferece métodos numéricos para encontrar raízes de funções.

> Uma raiz é um valor de entrada para o qual a função resulta em zero.

### 6.1 Método de Newton

Primeiro, defina uma fórmula com um parâmetro:

``` text
f(x)=x^2-2
```

Depois, forneça um chute inicial:

``` text
solve(f,1)
```

O método de Newton começa no valor informado e tenta aproximar uma raiz.

O resultado depende do chute inicial. Um chute inadequado pode fazer o
método não convergir.

### 6.2 Método da bisseção

Use dois extremos:

``` text
solve(f,0,2)
```

A função deve apresentar sinais opostos nos extremos: um valor positivo
e outro negativo, ou vice-versa. A bisseção reduz o intervalo
progressivamente para aproximar a raiz.

### 6.3 Informações do resultado

Quando disponíveis, os detalhes incluem:

-   **Método:** procedimento numérico utilizado.
-   **Iterações:** quantidade de etapas executadas.
-   **Resíduo:** quanto a função ainda se afasta de zero no resultado
    encontrado.
-   **Tolerância:** limite usado para decidir se a aproximação é
    suficientemente boa.

A fórmula precisa ter exatamente um parâmetro. A resolução de equações
usa o modo real `ℝ`.

## 7. Números reais, complexos e racionais

O seletor `ℝ / ℂ / ℚ` altera o conjunto numérico usado pela calculadora.

### 7.1 Reais --- ℝ

É o modo padrão para números reais e cálculos cotidianos. Nesse modo, os
números usam ponto flutuante, com precisão aproximada de 15 dígitos.

### 7.2 Complexos --- ℂ

Use `i` para representar a unidade imaginária.

Exemplos:

``` text
(1+2i)*(3-i)
sqrt(-4)
exp(i*pi)
```

Funções disponíveis nesse modo:

`√`, `sqrt`, `exp`, `ln`, `abs`, `arg`, `conj`, `re`, `im`, `sin`,
`cos`, `tan`

O OVERKILL também apresenta o módulo e o ângulo do número complexo.

### 7.3 Racionais --- ℚ

Esse modo trabalha com frações exatas sempre que possível.

Exemplo:

``` text
0.1+0.2
```

O resultado exato é `3/10`, evitando o erro de representação binária que
pode aparecer em ponto flutuante.

Funções disponíveis:

`gcd`, `lcm`, `floor`, `ceil`, `round`, `num`, `den`, `abs`, `sqrt` e
fatorial.

A raiz quadrada só é calculada nesse modo quando o resultado é exato.
Expoentes inteiros são aceitos até 1000.

### 7.4 Restrições dos modos

Nos modos `ℂ` e `ℚ`, variáveis e fórmulas nomeadas não estão
disponíveis. A resolução de equações e os gráficos funcionam apenas no
modo `ℝ`.

------------------------------------------------------------------------

# Parte III --- Módulos e ferramentas

## 8. Matrizes

A aba **Matrizes** permite trabalhar com matrizes e sistemas lineares.

### 8.1 Como escrever uma matriz

Separe as linhas por ponto e vírgula ou quebra de linha. Separe as
colunas por espaço ou vírgula.

Exemplo:

``` text
2 1; 1 3
```

Isso representa:

\[
```{=tex}
\begin{bmatrix}
2 & 1 \\
1 & 3
\end{bmatrix}
```
\]

As células aceitam expressões sem espaços, como `2pi` ou `1+1`.

### 8.2 Operações disponíveis

-   Resolver sistemas `Ax=b`.
-   Determinante.
-   Matriz inversa.
-   Transposta.
-   Posto (rank).
-   Multiplicação de matrizes `A × B`.

Para resolver `Ax=b`, informe a matriz dos coeficientes em `A` e o vetor
coluna em `B`. Exemplo para o vetor:

``` text
3; 5
```

### 8.3 Limites e avisos

-   O limite documentado é de 12 × 12.
-   Os sistemas precisam ser quadrados.
-   A inversa apresenta o número de condicionamento e pode avisar quando
    a matriz está mal condicionada.
-   A resolução de sistemas apresenta o resíduo.

Uma matriz mal condicionada pode amplificar pequenas diferenças nos
dados de entrada. Por isso, um resultado numérico deve ser interpretado
com cuidado.

## 9. Gráficos

A aba **Gráfico** permite visualizar funções em diferentes formatos.

### 9.1 Tipos de gráfico

1.  **Cartesiano:** `y=f(x)`.
2.  **Polar:** `r=f(t)`.
3.  **Paramétrico:** `x(t); y(t)`.

É possível escrever até quatro curvas, uma por linha.

### 9.2 Exemplos

Gráfico cartesiano:

``` text
x^2
sin(x)
```

Gráfico polar:

``` text
2
```

Gráfico paramétrico:

``` text
cos(t);sin(t)
```

No modo cartesiano, use `x`. Nos modos polar e paramétrico, use `t`. No
modo paramétrico, separe as expressões de `x(t)` e `y(t)` com ponto e
vírgula.

Você também pode utilizar fórmulas definidas anteriormente, como `f(x)`.

### 9.3 Navegação

-   Arraste para mover a visualização.
-   Use a rolagem ou os botões `+` e `−` para controlar o zoom.
-   Toque ou deslize sobre o gráfico para consultar coordenadas.
-   A opção **Raízes** lista as raízes da primeira curva dentro da
    janela visível.
-   A opção **PNG** salva uma imagem do gráfico.

Os ângulos dos gráficos são sempre interpretados em radianos.

## 10. Ferramentas

A aba **Ferramentas** reúne recursos especializados.

### 10.1 Conversor de unidades

1.  Escolha uma categoria.
2.  Digite o valor.
3.  Selecione a unidade de origem.
4.  Selecione a unidade de destino.

A ferramenta também lista as unidades disponíveis na categoria.
Temperaturas abaixo do zero absoluto são rejeitadas.

### 10.2 Bases numéricas e operações com bits

É possível informar valores nas bases de 2 a 36. O valor `A` também pode
ser exibido nas bases 2, 8, 10, 16, 32 e 36.

As operações disponíveis incluem:

-   `AND`
-   `OR`
-   `XOR`
-   `NOT`
-   `<<` --- deslocamento à esquerda
-   `>>` --- deslocamento à direita

Escolha uma largura de 8, 16, 32 ou 64 bits. Os resultados são
apresentados em formatos decimal com e sem sinal, hexadecimal e binário.

### 10.3 Ponto flutuante IEEE 754

Informe um número ou expressão para visualizar como ele é representado
em ponto flutuante.

A ferramenta apresenta, para os formatos `double` e `float`:

-   Sinal.
-   Expoente.
-   Mantissa.
-   Valor efetivamente armazenado.
-   Erro de arredondamento.

Esse recurso ajuda a entender por que números como `0.1` não possuem
representação binária exata em ponto flutuante.

### 10.4 Conversor de cores

Aceita os formatos:

``` text
#rrggbb
#rgb
rgb(r, g, b)
hsl(h, s%, l%)
```

A ferramenta converte entre HEX, RGB e HSL.

### 10.5 Álgebra: expandir, fatorar e integrar

Essa ferramenta reúne operações simbólicas. O suporte depende do formato
da expressão e das regras implementadas.

**Expandir**

Multiplica polinômios de forma exata, inclusive com frações e mais de
uma variável.

Exemplo:

``` text
(a+b)^3
```

**Fatorar**

Trabalha com polinômios de uma variável e procura raízes racionais.

Exemplo:

``` text
x^3-6x^2+11x-6
```

Resultado esperado:

``` text
(x-1)(x-2)(x-3)
```

**Integrar**

O recurso cobre, entre outros casos documentados:

-   Polinômios e somas.
-   Constantes multiplicadas por funções.
-   `sin`, `cos`, `exp`, `sinh`, `cosh` e `tan` com argumento linear,
    como `cos(2x)`.
-   Potências e raízes de expressões lineares.
-   Expressões do tipo `1/(ax+b)`.
-   Produtos de polinômios por `sin`, `cos` ou `exp` que possam ser
    resolvidos por integração por partes, como `x*exp(2x)`.

Para uma integral definida, preencha os dois limites de integração.

**Verificação dos resultados:** os fatores são multiplicados novamente
para conferir a fatoração. Uma integral é derivada e comparada com a
expressão original. Se a verificação falhar, o resultado não é exibido.
Se nenhuma regra implementada for aplicável, a ferramenta informa isso;
essa mensagem não significa que a integral não exista.

### 10.6 Estatística

**Estatística descritiva**

Digite números separados por espaços, vírgulas ou linhas. O módulo
apresenta:

-   Média.
-   Mediana.
-   Moda.
-   Quartis.
-   Variância populacional e amostral.
-   Desvio padrão populacional e amostral.
-   Erro padrão.
-   Outliers (valores atípicos).

**Regressão linear**

Informe um ponto por linha, no formato:

``` text
x y
```

O módulo apresenta a reta ajustada, `r` e `R²`. Se você informar um
valor de `x`, também calcula uma previsão. Quando a previsão estiver
fora do intervalo dos dados fornecidos, o sistema avisa que se trata de
extrapolação.

### 10.7 Derivadas simbólicas

Informe a expressão, a variável e a ordem desejada, da primeira à
terceira derivada.

Exemplo:

``` text
x^2*sin(x)
```

O resultado é simplificado. Se você informar um ponto, o módulo calcula
o valor da derivada nesse ponto e faz uma comparação com uma derivada
numérica.

Funções documentadas:

`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`,
`exp`, `ln`, `log`, `log2`, `sqrt`, `cbrt` e `abs`, além de potências.

Os ângulos são interpretados em radianos. Letras diferentes da variável
de derivação são tratadas como constantes.

## 11. Notebook matemático

O Notebook permite organizar cálculos e anotações em uma folha de
trabalho.

### 11.1 Tipos de célula

-   **Célula de cálculo:** executa uma ou mais linhas de expressões.
-   **Célula de nota:** guarda texto livre.

Use `+ Cálculo` e `+ Nota` para adicionar células. Os botões `↑`, `↓` e
`×` permitem mover ou remover uma célula.

### 11.2 Ordem de execução e variáveis

As células são executadas de cima para baixo e recalculadas enquanto
você digita.

Uma variável ou fórmula definida em uma célula pode ser utilizada nas
células abaixo.

Exemplo:

Primeira célula:

``` text
taxa=0.05
```

Célula seguinte:

``` text
1000*(1+taxa)^10
```

Cada Notebook possui suas próprias variáveis, separadas das variáveis da
calculadora. Ele também guarda seu próprio conjunto numérico (`ℝ`, `ℂ`
ou `ℚ`) e modo angular (`DEG` ou `RAD`).

Linhas iniciadas por `#` são comentários.

### 11.3 Erros nas células

Se uma linha apresentar erro, o Notebook mostra o motivo e a posição do
problema. As demais linhas continuam sendo executadas.

### 11.4 Salvar, importar e exportar

É possível criar, renomear e excluir vários Notebooks. Eles são salvos
no navegador.

-   **Exportar `.json`:** cria um arquivo de backup ou compartilhamento.
-   **Importar:** abre um arquivo de Notebook exportado.
-   **Exportar `.md`:** cria um relatório em Markdown com cálculos e
    resultados.

Guarde uma cópia exportada se precisar transferir seus Notebooks para
outro navegador ou aparelho.

------------------------------------------------------------------------

# Parte IV --- Referência e solução de problemas

## 12. Precisão, erros e limitações

### 12.1 Ponto flutuante e frações exatas

No modo `ℝ`, os cálculos utilizam ponto flutuante, com aproximadamente
15 dígitos de precisão. Isso é adequado para muitos cálculos cotidianos,
mas pode introduzir pequenos erros de arredondamento.

Quando precisar de aritmética exata com frações, use `ℚ`, respeitando as
operações suportadas nesse modo.

### 12.2 Tipos de erro

O OVERKILL informa erros em vez de apresentar um número inventado. Entre
os casos documentados estão:

-   **Erro de sintaxe:** a expressão foi escrita em um formato inválido.
-   **Erro de domínio:** a operação não é válida no conjunto numérico ou
    domínio selecionado.
-   **Erro numérico:** o método não conseguiu produzir um resultado
    válido.

Exemplos de expressões que geram erro no modo real:

``` text
1/0
sqrt(-1)
ln(0)
```

Quando disponível, a mensagem informa a posição do problema na
expressão.

### 12.3 Limites importantes

-   Fatorial: inteiros de 0 a 170.
-   Matrizes: limite documentado de 12 × 12.
-   Sistemas lineares: precisam ser quadrados.
-   Gráficos: até quatro curvas por visualização.
-   Precisão exibida: 8, 12 ou 15 dígitos.
-   `solve`: fórmula com exatamente um parâmetro e cálculo no modo `ℝ`.
-   Modos `ℂ` e `ℚ`: sem variáveis e fórmulas nomeadas.
-   Gráficos: ângulos sempre em radianos.
-   Integração simbólica: limitada às regras implementadas; uma
    expressão não reconhecida pode ter integral, mesmo que o módulo não
    consiga encontrá-la.

## 13. Exemplos para praticar

Use estes exemplos para conhecer diferentes partes do OVERKILL.

### Exemplo 1 --- Porcentagem

``` text
250*15%
```

Calcula 15% de 250.

### Exemplo 2 --- Trigonometria

Com o modo `DEG` selecionado:

``` text
sin(30)
```

Resultado esperado: `0.5`.

### Exemplo 3 --- Variável

``` text
preco=80
preco*1.1
```

Define um valor e calcula esse valor acrescido de 10%.

### Exemplo 4 --- Fórmula

``` text
f(x)=x^2-2
f(3)
```

Define uma função e avalia a função em `x=3`.

### Exemplo 5 --- Raiz de uma função

``` text
f(x)=x^2-2
solve(f,1)
```

Tenta encontrar uma raiz usando o método de Newton a partir do chute
`1`.

### Exemplo 6 --- Fração exata

Selecione `ℚ`:

``` text
0.1+0.2
```

O resultado exato é `3/10`.

### Exemplo 7 --- Número complexo

Selecione `ℂ`:

``` text
(1+2i)*(3-i)
```

### Exemplo 8 --- Matriz

Na aba Matrizes, informe:

``` text
2 1; 1 3
```

Experimente calcular o determinante ou a inversa.

### Exemplo 9 --- Gráfico paramétrico

Na aba Gráfico, selecione o modo paramétrico e informe:

``` text
cos(t);sin(t)
```

Isso representa uma circunferência unitária.

### Exemplo 10 --- Derivada

Na ferramenta Derivadas, informe:

``` text
x^2*sin(x)
```

Escolha `x` como variável e `1` como ordem.

### Exemplo 11 --- Estatística

Na ferramenta de estatística descritiva, informe:

``` text
4, 5, 5, 7, 9
```

Observe média, mediana, moda e medidas de dispersão.

### Exemplo 12 --- Notebook

Em uma célula, defina:

``` text
taxa=0.05
```

Na célula seguinte, informe:

``` text
1000*(1+taxa)^10
```

Observe como a segunda célula utiliza a variável da primeira.

## 14. Solução de problemas comuns

### O resultado não aparece

-   Confira se todos os parênteses foram fechados.
-   Verifique se a expressão usa `.` como separador decimal.
-   Confira se os argumentos das funções estão separados corretamente.
-   Leia a mensagem de erro e a posição indicada.

### A função trigonométrica retorna um valor inesperado

Confira se o modo está em `DEG` ou `RAD`. Lembre-se de que os gráficos
usam radianos.

### `solve` não encontra uma raiz

-   No método de Newton, tente um chute inicial diferente.
-   Na bisseção, confira se os extremos apresentam sinais opostos.
-   Verifique se a fórmula possui exatamente um parâmetro.
-   A não convergência não significa necessariamente que a equação não
    tenha raiz.

### A integral não é calculada

O integrador simbólico reconhece um conjunto definido de padrões. Uma
mensagem de regra não encontrada significa que o módulo não conseguiu
resolver aquela forma; não prova que a integral não exista.

### Uma matriz apresenta aviso de condicionamento

O aviso indica que pequenas alterações nos dados podem causar grandes
alterações na solução. Confira os valores de entrada e interprete o
resultado com cuidado.

### A versão atualizada não aparece

Feche o aplicativo e abra-o novamente com conexão à internet para
permitir a atualização do conteúdo armazenado.

### Meus dados ficam salvos?

Histórico, variáveis e Notebooks são armazenados localmente no
navegador. Limpar os dados do navegador ou trocar de aparelho pode
apagar ou deixar esses dados inacessíveis. Exporte seus Notebooks em
`.json` para manter uma cópia.

------------------------------------------------------------------------

# Glossário

  -----------------------------------------------------------------------
  Termo                               Explicação
  ----------------------------------- -----------------------------------
  **Expressão**                       Combinação de números, operadores,
                                      constantes e funções que pode ser
                                      calculada.

  **Variável**                        Nome associado a um valor, como
                                      `x=5`.

  **Fórmula**                         Expressão que recebe parâmetros,
                                      como `f(x)=x^2`.

  **Raiz**                            Valor de entrada para o qual uma
                                      função resulta em zero.

  **Resíduo**                         Diferença entre o valor calculado e
                                      a condição que deveria ser
                                      satisfeita; em `solve`, indica o
                                      quanto a função está distante de
                                      zero na raiz aproximada.

  **Tolerância**                      Margem usada para decidir se uma
                                      aproximação é suficientemente
                                      precisa.

  **Matriz**                          Organização retangular de valores
                                      em linhas e colunas.

  **Posto (rank)**                    Quantidade de linhas ou colunas
                                      linearmente independentes de uma
                                      matriz.

  **Matriz mal condicionada**         Matriz cuja solução pode ser muito
                                      sensível a pequenas alterações nos
                                      dados.

  **Ponto flutuante**                 Forma de representar números reais
                                      com precisão finita no computador.

  **IEEE 754**                        Padrão utilizado para representar
                                      números em ponto flutuante.

  **Extrapolação**                    Estimativa feita fora do intervalo
                                      dos dados observados.

  **Derivada**                        Mede como uma função varia em
                                      relação à sua variável.

  **Integral**                        Operação que, entre outras
                                      interpretações, pode representar
                                      acumulação ou área orientada.

  **PWA**                             Aplicativo web que pode ser
                                      instalado e oferecer recursos
                                      offline.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Sobre privacidade e funcionamento

Os cálculos descritos neste manual são executados no aparelho. O
histórico e as variáveis ficam armazenados no navegador. O manual atual
informa que o conteúdo digitado não é enviado a um servidor para
executar esses cálculos. A fonte usada no título é carregada do Google
Fonts.

Se o projeto receber futuramente recursos que dependam de serviços
externos, como uma integração de IA, o comportamento de privacidade
deverá ser explicado separadamente antes de o usuário ativá-los.

------------------------------------------------------------------------

**OVERKILL --- Manual do Usuário**

*Documento de referência. Os nomes de botões e a disponibilidade de
recursos podem mudar conforme a versão do aplicativo.*
