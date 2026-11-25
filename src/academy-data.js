/* OVERKILL Academy — mapa de conteúdos.
   Fonte: plano "OVERKILL Academy" (16 áreas + laboratório de geometria futuro).
   Cada linha é uma ficha: [id, área, subcategoria, nome, pré-requisitos, objetivos].
   Os pré-requisitos formam uma REDE (não uma lista). Nível e ordem da trilha são
   calculados a partir dessa rede, então ao editar uma ficha não é preciso renumerar nada.
   [PRECISA CONFIRMAR] Este mapa é um rascunho inicial: revisar dependências antes de escrever as aulas. */

var ACADEMY_STATUS=["planejado","em produção","revisado","publicado"];

var ACADEMY_ETAPAS={
  0:"Futuro",
  1:"Fundamentos",
  2:"Matemática intermediária",
  3:"Matemática avançada",
  4:"Especializada e computacional"
};

var ACADEMY_AREAS=[
  {id:"fundamentos",n:1,etapa:1,name:"Fundamentos matemáticos",desc:"Números, quantidades, símbolos, operações básicas e linguagem matemática.",nivel:"Iniciante"},
  {id:"aritmetica",n:2,etapa:1,name:"Aritmética",desc:"Operações, propriedades, divisibilidade, frações, decimais e porcentagem.",nivel:"Iniciante"},
  {id:"potencias-logaritmos",n:3,etapa:1,name:"Potenciação, radiciação e logaritmos",desc:"Potências, raízes, expoentes, propriedades e logaritmos.",nivel:"Básico"},
  {id:"matematica-aplicada",n:4,etapa:1,name:"Matemática aplicada",desc:"Proporções, escalas, unidades, conversões, juros e problemas cotidianos.",nivel:"Básico"},
  {id:"algebra",n:5,etapa:2,name:"Álgebra",desc:"Variáveis, expressões, equações, inequações, sistemas e polinômios.",nivel:"Intermediário"},
  {id:"funcoes",n:6,etapa:2,name:"Funções",desc:"Conceitos, domínio, imagem, composição, funções inversas e famílias de funções.",nivel:"Intermediário"},
  {id:"trigonometria",n:7,etapa:2,name:"Trigonometria",desc:"Ângulos, seno, cosseno, tangente, círculo trigonométrico e identidades.",nivel:"Intermediário"},
  {id:"geometria",n:8,etapa:2,name:"Geometria",desc:"Geometria plana, espacial, analítica e construções geométricas.",nivel:"Intermediário"},
  {id:"estatistica",n:9,etapa:3,name:"Estatística",desc:"Medidas, distribuição de dados, análise e interpretação.",nivel:"Avançado"},
  {id:"probabilidade",n:10,etapa:3,name:"Probabilidade e combinatória",desc:"Eventos, chances, contagem, combinações e permutações.",nivel:"Avançado"},
  {id:"matrizes",n:11,etapa:3,name:"Matrizes e vetores",desc:"Operações matriciais, determinantes, sistemas lineares e vetores.",nivel:"Avançado"},
  {id:"calculo",n:12,etapa:3,name:"Cálculo",desc:"Limites, continuidade, derivadas e integrais.",nivel:"Avançado"},
  {id:"discreta",n:13,etapa:3,name:"Matemática discreta",desc:"Lógica, conjuntos, relações, sequências e estruturas discretas.",nivel:"Intermediário"},
  {id:"computacional",n:14,etapa:4,name:"Matemática computacional",desc:"Bases numéricas, representação binária, ponto flutuante e precisão.",nivel:"Intermediário"},
  {id:"financeira",n:15,etapa:4,name:"Matemática financeira e modelagem",desc:"Juros, crescimento, decaimento, modelos e aplicações quantitativas.",nivel:"Intermediário"},
  {id:"especializados",n:16,etapa:4,name:"Tópicos especializados",desc:"Números complexos, álgebra linear avançada, equações diferenciais, métodos numéricos e outros assuntos que venham a integrar a plataforma.",nivel:"Avançado"},
  {id:"laboratorio-geometria",n:17,etapa:0,name:"Laboratório de geometria (futuro)",desc:"Construções, figuras manipuláveis, relações geométricas e demonstrações visuais. Área própria, ligada às aulas de geometria.",nivel:"Variado",futura:true}
];

var ACADEMY_TOPIC_ROWS=[
  // 1. Fundamentos matemáticos
  ["numeros","fundamentos","Números","Números e quantidades",[],["Entender o número como contagem de quantidades e saber representá-lo."]],
  ["simbolos","fundamentos","Símbolos","Símbolos matemáticos",["numeros"],["Reconhecer +, −, ×, ÷, =, <, >, √ e π e o que cada um significa."]],
  ["adicao","fundamentos","Operações básicas","Adição (+)",["numeros"],["Juntar quantidades e entender o resultado como soma."]],
  ["subtracao","fundamentos","Operações básicas","Subtração (−)",["adicao"],["Retirar, comparar e encontrar diferenças entre quantidades."]],
  ["multiplicacao","fundamentos","Operações básicas","Multiplicação (×)",["adicao"],["Entender a multiplicação como soma repetida e os fatores."]],
  ["divisao","fundamentos","Operações básicas","Divisão (÷)",["multiplicacao","subtracao"],["Repartir quantidades e identificar dividendo, divisor e quociente."]],
  ["positivos-negativos","fundamentos","Números com sinal","Números positivos e negativos",["numeros","subtracao"],["Ler a reta numérica e operar com sinais."]],
  ["constante-pi","fundamentos","Constantes","Constante π",["divisao"],["Saber que π é a razão entre o comprimento de uma circunferência e seu diâmetro."]],

  // 2. Aritmética
  ["parenteses-expressoes","aritmetica","Expressões","Parênteses e expressões",["adicao","subtracao","multiplicacao","divisao"],["Ler expressões com parênteses e agrupar operações corretamente."]],
  ["ordem-operacoes","aritmetica","Expressões","Ordem das operações",["parenteses-expressoes"],["Saber em que ordem resolver uma expressão com várias operações."]],
  ["divisibilidade","aritmetica","Números inteiros","Divisibilidade",["multiplicacao","divisao"],["Reconhecer quando um número é divisível por outro."]],
  ["fracoes","aritmetica","Frações","Frações",["divisao","multiplicacao"],["Entender numerador, denominador e operar com frações."]],
  ["numeros-decimais","aritmetica","Decimais","Números decimais",["fracoes"],["Relacionar decimais e frações e operar com vírgulas."]],
  ["porcentagem","aritmetica","Proporção","Porcentagem (%)",["fracoes","numeros-decimais"],["Calcular partes de um total em porcentagem."]],
  ["valor-absoluto","aritmetica","Números com sinal","Valor absoluto",["positivos-negativos","subtracao"],["Entender a distância de um número até zero."]],
  ["modulo-resto","aritmetica","Números inteiros","Módulo (resto da divisão)",["divisao","divisibilidade"],["Calcular o resto de uma divisão inteira. [PRECISA CONFIRMAR] se o OVERKILL usa 'mod' com esse sentido."]],

  // 3. Potenciação, radiciação e logaritmos
  ["potenciacao","potencias-logaritmos","Potências","Potenciação",["ordem-operacoes","multiplicacao"],["Entender base, expoente e calcular potências de números inteiros."]],
  ["propriedades-das-potencias","potencias-logaritmos","Potências","Propriedades das potências",["potenciacao","positivos-negativos","divisao"],["Aplicar as regras de multiplicação, divisão e potência de potência; entender expoente zero e negativo."]],
  ["radiciacao","potencias-logaritmos","Raízes","Radiciação (√)",["propriedades-das-potencias"],["Entender raiz como potência de expoente fracionário e calcular raízes simples."]],
  ["exponenciais","potencias-logaritmos","Exponenciais","Exponenciais",["propriedades-das-potencias","numeros-decimais"],["Entender funções em que a variável está no expoente."]],
  ["notacao-cientifica","potencias-logaritmos","Notação","Notação científica",["potenciacao","numeros-decimais"],["Escrever números muito grandes ou muito pequenos como potências de 10."]],
  ["logaritmos","potencias-logaritmos","Logaritmos","Logaritmos",["multiplicacao","divisao","potenciacao","propriedades-das-potencias"],["Compreender o conceito de logaritmo, identificar base e logaritmando e relacioná-lo às potências."]],
  ["constante-euler","potencias-logaritmos","Constantes","Constante de Euler (e)",["exponenciais"],["Entender o número e como base natural de crescimento contínuo."]],
  ["logaritmos-naturais","potencias-logaritmos","Logaritmos","Logaritmos naturais (ln)",["logaritmos","constante-euler"],["Usar o logaritmo de base e (ln) e relacioná-lo ao log comum."]],

  // 4. Matemática aplicada
  ["proporcoes","matematica-aplicada","Proporção","Proporções",["fracoes","porcentagem"],["Reconhecer grandezas diretamente e inversamente proporcionais."]],
  ["escalas","matematica-aplicada","Proporção","Escalas",["proporcoes"],["Ler mapas, maquetes e gráficos com escala."]],
  ["unidades-conversoes","matematica-aplicada","Unidades","Unidades e conversões",["proporcoes","notacao-cientifica"],["Converter unidades de comprimento, massa, tempo e outras grandezas."]],
  ["arredondamento","matematica-aplicada","Precisão","Arredondamento",["numeros-decimais"],["Arredondar números e entender quando o arredondamento altera o resultado."]],
  ["precisao-numerica","matematica-aplicada","Precisão","Precisão numérica",["arredondamento","notacao-cientifica"],["Entender quantas casas decimais um resultado realmente tem."]],
  ["algarismos-significativos","matematica-aplicada","Precisão","Algarismos significativos",["precisao-numerica"],["Identificar os algarismos que carregam informação real em uma medida."]],

  // 5. Álgebra
  ["variaveis","algebra","Linguagem algébrica","Variáveis e incógnitas",["simbolos","adicao","multiplicacao"],["Entender letras como números desconhecidos ou genéricos."]],
  ["expressoes-algebraicas","algebra","Linguagem algébrica","Expressões algébricas",["variaveis","ordem-operacoes"],["Montar e simplificar expressões com variáveis."]],
  ["monomios-polinomios","algebra","Polinômios","Monômios e polinômios",["expressoes-algebraicas","propriedades-das-potencias"],["Identificar termos, coeficientes e graus de monômios e polinômios."]],
  ["produtos-notaveis","algebra","Polinômios","Produtos notáveis",["monomios-polinomios"],["Desenvolver quadrado da soma, quadrado da diferença e produto da soma pela diferença."]],
  ["expansao-expressoes","algebra","Polinômios","Expansão de expressões",["produtos-notaveis"],["Expandir expressões com parênteses usando a propriedade distributiva."]],
  ["fatoracao","algebra","Polinômios","Fatoração",["produtos-notaveis","divisao"],["Reescrever uma expressão como produto de fatores."]],
  ["equacoes-1-grau","algebra","Equações","Equações de primeiro grau",["expressoes-algebraicas","subtracao","divisao"],["Isolar a incógnita em equações lineares."]],
  ["inequacoes","algebra","Equações","Inequações",["equacoes-1-grau"],["Resolver desigualdades e representar o conjunto solução."]],
  ["equacoes-2-grau","algebra","Equações","Equações de segundo grau",["equacoes-1-grau","radiciacao","fatoracao"],["Resolver equações quadráticas por fatoração e pela fórmula de Bhaskara."]],
  ["sistemas-equacoes","algebra","Sistemas","Sistemas de equações",["equacoes-1-grau"],["Resolver duas ou mais equações lineares ao mesmo tempo."]],

  // 6. Funções
  ["conceito-funcao","funcoes","Fundamentos","Conceito de função",["variaveis","expressoes-algebraicas"],["Entender função como regra que associa cada entrada a uma única saída."]],
  ["dominio-imagem","funcoes","Fundamentos","Domínio e imagem",["conceito-funcao","inequacoes"],["Identificar os valores possíveis de entrada e de saída."]],
  ["funcao-composta","funcoes","Operações","Composição de funções",["conceito-funcao"],["Aplicar uma função sobre o resultado de outra."]],
  ["funcao-inversa","funcoes","Operações","Funções inversas",["funcao-composta","equacoes-1-grau"],["Desfazer a ação de uma função."]],
  ["funcoes-lineares","funcoes","Famílias","Funções lineares",["conceito-funcao","equacoes-1-grau","plano-cartesiano"],["Reconhecer f(x) = ax + b, coeficiente angular e linear."]],
  ["funcoes-quadraticas","funcoes","Famílias","Funções quadráticas",["funcoes-lineares","equacoes-2-grau"],["Entender a parábola, vértice, raízes e concavidade."]],
  ["funcoes-exponenciais","funcoes","Famílias","Funções exponenciais",["conceito-funcao","exponenciais"],["Reconhecer crescimento e decaimento exponencial."]],
  ["funcoes-logaritmicas","funcoes","Famílias","Funções logarítmicas",["funcao-inversa","logaritmos","funcoes-exponenciais"],["Entender o logaritmo como função inversa da exponencial."]],

  // 7. Trigonometria
  ["graus-radianos","trigonometria","Ângulos","Conversão entre graus e radianos",["constante-pi","fracoes"],["Converter medidas de ângulo entre graus e radianos."]],
  ["triangulos-retangulos","trigonometria","Triângulos","Triângulos retângulos",["triangulos","radiciacao"],["Identificar catetos e hipotenusa e aplicar o Teorema de Pitágoras."]],
  ["seno","trigonometria","Razões","Seno (sin)",["triangulos-retangulos","graus-radianos"],["Relacionar um ângulo com a razão entre cateto oposto e hipotenusa."]],
  ["cosseno","trigonometria","Razões","Cosseno (cos)",["seno"],["Relacionar um ângulo com a razão entre cateto adjacente e hipotenusa."]],
  ["tangente","trigonometria","Razões","Tangente (tan)",["seno","cosseno"],["Entender a tangente como razão entre seno e cosseno."]],
  ["circulo-trigonometrico","trigonometria","Círculo","Círculo trigonométrico",["seno","cosseno","graus-radianos","plano-cartesiano"],["Ver seno e cosseno como coordenadas de um ponto sobre a circunferência."]],
  ["arco-seno","trigonometria","Inversas","Arco seno (asin)",["seno","funcao-inversa"],["Encontrar o ângulo a partir do seno."]],
  ["arco-cosseno","trigonometria","Inversas","Arco cosseno (acos)",["cosseno","funcao-inversa"],["Encontrar o ângulo a partir do cosseno."]],
  ["arco-tangente","trigonometria","Inversas","Arco tangente (atan)",["tangente","funcao-inversa"],["Encontrar o ângulo a partir da tangente."]],
  ["graficos-trigonometricos","trigonometria","Gráficos","Gráficos trigonométricos",["circulo-trigonometrico","funcoes-lineares"],["Interpretar as ondas de seno e cosseno e seus parâmetros."]],
  ["identidades-trigonometricas","trigonometria","Identidades","Identidades trigonométricas",["seno","cosseno","tangente","expansao-expressoes","fatoracao"],["Usar e demonstrar relações como sen² + cos² = 1."]],
  ["lei-dos-senos","trigonometria","Triângulos","Lei dos senos",["seno","triangulos"],["Resolver triângulos quaisquer usando a razão entre lados e senos."]],
  ["lei-dos-cossenos","trigonometria","Triângulos","Lei dos cossenos",["cosseno","triangulos","expressoes-algebraicas"],["Calcular lados e ângulos de triângulos quaisquer."]],

  // 8. Geometria
  ["pontos-retas-planos","geometria","Fundamentos","Pontos, retas e planos",["simbolos"],["Entender os entes básicos da geometria plana."]],
  ["angulos","geometria","Fundamentos","Ângulos",["pontos-retas-planos","fracoes"],["Medir, classificar e somar ângulos."]],
  ["triangulos","geometria","Figuras planas","Triângulos",["angulos","pontos-retas-planos"],["Classificar triângulos por lados e ângulos."]],
  ["quadrilateros","geometria","Figuras planas","Quadriláteros",["triangulos"],["Reconhecer retângulos, losangos, trapézios e paralelogramos."]],
  ["poligonos","geometria","Figuras planas","Polígonos",["triangulos","quadrilateros"],["Entender polígonos regulares e a soma de seus ângulos."]],
  ["circunferencias","geometria","Figuras planas","Circunferências e círculos",["constante-pi","pontos-retas-planos"],["Entender raio, diâmetro, corda e arco."]],
  ["perimetro","geometria","Medidas","Perímetro",["adicao","poligonos","circunferencias"],["Calcular o contorno de figuras planas."]],
  ["area","geometria","Medidas","Área",["perimetro","multiplicacao","quadrilateros","circunferencias"],["Calcular a superfície de figuras planas."]],
  ["volume","geometria","Medidas","Volume",["area","notacao-cientifica"],["Calcular a capacidade de sólidos."]],
  ["solidos-geometricos","geometria","Espacial","Sólidos geométricos",["area","volume"],["Reconhecer prismas, pirâmides, cilindros, cones e esferas."]],
  ["plano-cartesiano","geometria","Analítica","Plano cartesiano",["numeros","pontos-retas-planos"],["Localizar pontos pelos eixos X e Y."]],
  ["geometria-analitica","geometria","Analítica","Geometria analítica",["plano-cartesiano","equacoes-1-grau","triangulos"],["Representar retas e figuras com coordenadas e equações."]],
  ["distancia-entre-pontos","geometria","Analítica","Distância entre pontos",["geometria-analitica","radiciacao","triangulos-retangulos"],["Calcular a distância entre dois pontos no plano."]],

  // 9. Estatística
  ["media-aritmetica","estatistica","Medidas centrais","Média aritmética",["adicao","divisao","numeros-decimais"],["Calcular a média de um conjunto de valores."]],
  ["media-ponderada","estatistica","Medidas centrais","Média ponderada",["media-aritmetica","fracoes"],["Calcular médias em que cada valor tem um peso."]],
  ["mediana","estatistica","Medidas centrais","Mediana",["numeros-decimais","positivos-negativos"],["Encontrar o valor central de um conjunto ordenado."]],
  ["moda","estatistica","Medidas centrais","Moda",["numeros"],["Identificar o valor que mais se repete."]],
  ["amplitude","estatistica","Dispersão","Amplitude",["subtracao","positivos-negativos"],["Medir a diferença entre o maior e o menor valor."]],
  ["variancia","estatistica","Dispersão","Variância",["media-aritmetica","potenciacao"],["Medir o quanto os dados se afastam da média."]],
  ["desvio-padrao","estatistica","Dispersão","Desvio padrão",["variancia","radiciacao"],["Interpretar a dispersão na mesma unidade dos dados."]],
  ["quartis","estatistica","Posição","Quartis",["mediana"],["Dividir um conjunto ordenado em quatro partes."]],
  ["percentis","estatistica","Posição","Percentis",["quartis","porcentagem"],["Entender a posição de um valor em relação aos demais."]],
  ["distribuicoes","estatistica","Análise","Distribuições",["desvio-padrao","percentis","plano-cartesiano"],["Ler histogramas e distribuições de frequência."]],
  ["analise-dados","estatistica","Análise","Análise de dados",["distribuicoes","media-ponderada"],["Tirar conclusões de um conjunto de dados com cuidado."]],

  // 10. Probabilidade e combinatória
  ["probabilidade","probabilidade","Probabilidade","Probabilidade",["fracoes","porcentagem"],["Calcular a chance de um evento ocorrer."]],
  ["eventos","probabilidade","Probabilidade","Eventos",["probabilidade","conjuntos"],["Distinguir evento simples, composto, certo e impossível."]],
  ["fatorial","probabilidade","Contagem","Fatorial (!)",["multiplicacao"],["Calcular o produto de todos os inteiros até um número."]],
  ["permutacoes","probabilidade","Contagem","Permutações",["fatorial"],["Contar as maneiras de ordenar elementos distintos."]],
  ["combinacoes","probabilidade","Contagem","Combinações",["fatorial","divisao"],["Contar escolhas em que a ordem não importa."]],

  // 11. Matrizes e vetores
  ["matrizes-o-que","matrizes","Fundamentos","O que são matrizes",["numeros","variaveis"],["Entender matriz como tabela organizada de números."]],
  ["linhas-colunas","matrizes","Fundamentos","Linhas e colunas",["matrizes-o-que"],["Localizar elementos pela linha e pela coluna."]],
  ["ordem-matriz","matrizes","Fundamentos","Ordem de uma matriz",["linhas-colunas"],["Identificar o tamanho de uma matriz m × n."]],
  ["matriz-identidade","matrizes","Tipos","Matriz identidade",["ordem-matriz"],["Reconhecer a matriz que não altera outra na multiplicação."]],
  ["matriz-transposta","matrizes","Tipos","Matriz transposta",["ordem-matriz"],["Trocar linhas por colunas."]],
  ["adicao-subtracao-matrizes","matrizes","Operações","Adição e subtração de matrizes",["ordem-matriz","adicao","subtracao"],["Somar e subtrair matrizes de mesma ordem."]],
  ["multiplicacao-matrizes","matrizes","Operações","Multiplicação de matrizes",["adicao-subtracao-matrizes","multiplicacao","linhas-colunas"],["Multiplicar matrizes linha por coluna."]],
  ["determinantes","matrizes","Operações","Determinantes",["multiplicacao-matrizes","subtracao","matriz-identidade"],["Calcular o determinante de matrizes 2 × 2 e 3 × 3."]],
  ["matriz-inversa","matrizes","Operações","Matrizes inversas",["determinantes","matriz-identidade"],["Encontrar a matriz que desfaz outra."]],
  ["vetores","matrizes","Vetores","Vetores",["matrizes-o-que","plano-cartesiano"],["Entender vetor como grandeza com módulo, direção e sentido."]],
  ["operacoes-vetoriais","matrizes","Vetores","Operações vetoriais",["vetores","adicao-subtracao-matrizes"],["Somar vetores e multiplicá-los por escalares."]],
  ["sistemas-lineares","matrizes","Sistemas","Sistemas lineares",["matriz-inversa","sistemas-equacoes"],["Resolver sistemas lineares com matrizes."]],

  // 12. Cálculo
  ["limites","calculo","Limites","Limites",["funcoes-lineares","funcoes-quadraticas","fracoes","dominio-imagem"],["Entender o valor para o qual uma função se aproxima."]],
  ["continuidade","calculo","Limites","Continuidade",["limites"],["Saber quando uma função não tem interrupções."]],
  ["derivadas","calculo","Derivadas","Derivadas",["limites","produtos-notaveis"],["Entender a derivada como taxa de variação instantânea."]],
  ["regras-derivacao","calculo","Derivadas","Regras de derivação",["derivadas","propriedades-das-potencias","expansao-expressoes"],["Derivar potências, somas, produtos e quocientes."]],
  ["aplicacoes-derivadas","calculo","Derivadas","Aplicações de derivadas",["regras-derivacao","inequacoes"],["Encontrar máximos, mínimos e crescimento de funções."]],
  ["integrais","calculo","Integrais","Integrais",["regras-derivacao"],["Entender a integral como operação inversa da derivada."]],
  ["integrais-indefinidas","calculo","Integrais","Integrais indefinidas",["integrais"],["Calcular primitivas e a constante de integração."]],
  ["integrais-definidas","calculo","Integrais","Integrais definidas",["integrais","limites"],["Calcular a integral entre dois limites."]],
  ["area-sob-curvas","calculo","Aplicações","Área sob curvas",["integrais-definidas","area"],["Interpretar a integral como área."]],
  ["teorema-fundamental-calculo","calculo","Aplicações","Teorema fundamental do cálculo",["integrais-definidas","derivadas"],["Relacionar derivada e integral."]],

  // 13. Matemática discreta
  ["conjuntos","discreta","Conjuntos","Conjuntos",["numeros","simbolos"],["Entender elementos, pertinência, união e interseção."]],
  ["logica","discreta","Lógica","Lógica",["simbolos","conjuntos"],["Entender proposições, conectivos e tabelas-verdade."]],
  ["relacoes","discreta","Relações","Relações",["conjuntos","plano-cartesiano"],["Relacionar elementos de dois conjuntos."]],
  ["sequencias","discreta","Sequências","Sequências",["conceito-funcao","numeros"],["Entender sequências como funções sobre os naturais."]],
  ["progressao-aritmetica","discreta","Sequências","Progressão aritmética",["sequencias","adicao","multiplicacao"],["Calcular termos e somas de PA."]],
  ["progressao-geometrica","discreta","Sequências","Progressão geométrica",["sequencias","potenciacao","multiplicacao"],["Calcular termos e somas de PG."]],
  ["estruturas-discretas","discreta","Integração","Estruturas discretas",["relacoes","sequencias","logica"],["Juntar conjuntos, relações e sequências em problemas discretos."]],

  // 14. Matemática computacional
  ["sistema-decimal","computacional","Bases numéricas","Sistema decimal",["numeros","potenciacao"],["Entender o valor posicional na base 10."]],
  ["sistema-binario","computacional","Bases numéricas","Sistema binário",["sistema-decimal"],["Representar números usando apenas 0 e 1."]],
  ["sistema-octal","computacional","Bases numéricas","Sistema octal",["sistema-binario"],["Representar números na base 8."]],
  ["sistema-hexadecimal","computacional","Bases numéricas","Sistema hexadecimal",["sistema-binario"],["Representar números na base 16."]],
  ["conversao-bases","computacional","Bases numéricas","Conversão entre bases",["sistema-octal","sistema-hexadecimal","divisao"],["Converter números entre bases diferentes."]],
  ["operacoes-bitwise","computacional","Bits","Operações bitwise",["sistema-binario","logica"],["Aplicar AND, OR, XOR e deslocamentos de bits."]],
  ["ponto-flutuante","computacional","Precisão","Representação de ponto flutuante",["notacao-cientifica","sistema-binario"],["Entender como o computador guarda números não inteiros."]],
  ["ieee-754","computacional","Precisão","Notação IEEE 754",["ponto-flutuante"],["Ler o padrão de sinal, expoente e mantissa."]],
  ["precisao-computacional","computacional","Precisão","Precisão computacional",["ponto-flutuante","precisao-numerica"],["Entender os limites de precisão de um cálculo no computador."]],
  ["erros-arredondamento","computacional","Precisão","Erros de arredondamento",["precisao-computacional","arredondamento"],["Reconhecer e evitar erros acumulados em cálculos."]],

  // 15. Matemática financeira e modelagem
  ["juros-simples","financeira","Juros","Juros simples",["porcentagem","multiplicacao"],["Calcular juros que incidem só sobre o capital inicial."]],
  ["juros-compostos","financeira","Juros","Juros compostos",["juros-simples","potenciacao","logaritmos"],["Calcular juros sobre juros e o tempo necessário para um montante."]],
  ["crescimento-decaimento","financeira","Modelos","Crescimento e decaimento",["juros-compostos","funcoes-exponenciais"],["Modelar crescimento e decaimento com funções exponenciais."]],
  ["modelagem-quantitativa","financeira","Modelos","Modelagem quantitativa",["crescimento-decaimento","analise-dados"],["Escolher e avaliar um modelo matemático para um problema real."]],

  // 16. Tópicos especializados (planejados)
  ["numeros-complexos","especializados","Álgebra avançada","Números complexos",["equacoes-2-grau","radiciacao","vetores"],["Operar com a unidade imaginária i e com números complexos."]],
  ["algebra-linear-avancada","especializados","Álgebra avançada","Álgebra linear avançada",["sistemas-lineares","determinantes","operacoes-vetoriais"],["Estudar espaços vetoriais, autovalores e autovetores."]],
  ["equacoes-diferenciais","especializados","Análise avançada","Equações diferenciais",["derivadas","integrais"],["Resolver equações que relacionam uma função e suas derivadas."]],
  ["metodos-numericos","especializados","Análise avançada","Métodos numéricos",["derivadas","precisao-computacional","ieee-754"],["Aproximar soluções de problemas que não têm fórmula fechada."]],

  // 17. Laboratório de geometria (futuro)
  ["construcoes-geometricas","laboratorio-geometria","Construções","Construções geométricas",["circunferencias","triangulos"],["Construir figuras com régua e compasso."]],
  ["paralelismo-perpendicularidade","laboratorio-geometria","Relações","Paralelismo e perpendicularidade",["angulos","pontos-retas-planos"],["Reconhecer retas paralelas e perpendiculares."]],
  ["circunferencias-tangencias","laboratorio-geometria","Relações","Circunferências e tangências",["circunferencias","paralelismo-perpendicularidade"],["Entender retas tangentes a circunferências."]],
  ["transformacoes-geometricas","laboratorio-geometria","Transformações","Transformações geométricas",["plano-cartesiano","triangulos"],["Mover, girar, ampliar e reduzir figuras."]],
  ["simetrias","laboratorio-geometria","Transformações","Simetrias",["transformacoes-geometricas"],["Identificar eixos e centros de simetria."]],
  ["geometria-espacial","laboratorio-geometria","Espacial","Geometria espacial",["solidos-geometricos","volume"],["Visualizar e medir sólidos no espaço."]],
  ["demonstracoes-teoremas","laboratorio-geometria","Demonstrações","Demonstrações e teoremas",["logica","triangulos"],["Entender o que é uma demonstração e acompanhar uma."]]
];

// Ferramentas do OVERKILL ligadas a um assunto (usado para o link "Ferramentas relacionadas").
var ACADEMY_TOOLS={
  potenciacao:["Calculadora: tecla x^y"],
  radiciacao:["Calculadora: tecla √"],
  logaritmos:["Calculadora: tecla log (base 10)"],
  "logaritmos-naturais":["Calculadora: tecla ln"],
  "constante-pi":["Calculadora: tecla π"],
  "constante-euler":["Calculadora: tecla e"],
  seno:["Calculadora: tecla sin"],
  cosseno:["Calculadora: tecla cos"],
  tangente:["Calculadora: tecla tan"],
  "arco-seno":["Calculadora: asin"],
  "arco-cosseno":["Calculadora: acos"],
  "arco-tangente":["Calculadora: atan"],
  "notacao-cientifica":["Calculadora: notação científica (Dec)"],
  "matriz-inversa":["Matrizes: inversa"],
  determinantes:["Matrizes: determinante"],
  "sistemas-equacoes":["Ferramentas: álgebra"],
  "sistema-binario":["Ferramentas: bits"],
  "ieee-754":["Ferramentas: IEEE 754"],
  "conversao-bases":["Ferramentas: bases numéricas"],
  "unidades-conversoes":["Ferramentas: unidades"],
  "juros-compostos":["Ferramentas: finanças"],
  "desvio-padrao":["Ferramentas: estatística"],
  "media-aritmetica":["Ferramentas: estatística"],
  "funcoes-lineares":["Gráfico"],
  "funcoes-quadraticas":["Gráfico"],
  "graficos-trigonometricos":["Gráfico"]
};

// Seções obrigatórias de toda aula, na ordem da ficha pedagógica do plano.
var ACADEMY_SECTIONS=[
  ["oque","O que é?"],
  ["paraque","Para que serve?"],
  ["porque","Por que existe?"],
  ["comofunciona","Como funciona?"],
  ["comocalcular","Como calcular?"],
  ["formulas","Fórmulas"],
  ["exemplos","Exemplos"],
  ["pratica","Na prática"],
  ["erros","Erros comuns"],
  ["relacoes","Relações"],
  ["exercicios","Exercícios"],
  ["glossario","Glossário"]
];

// Monta o grafo: valida fichas, calcula dependentes, ordem da trilha e nível.
// Nível é derivado da profundidade na rede (aulas sem pré-requisito são iniciantes).
function academyGraph(rows){
  var errors=[],byId={},topics=[];
  var areas={};ACADEMY_AREAS.forEach(function(a){areas[a.id]=a});
  rows.forEach(function(r){
    var t={id:r[0],area:r[1],sub:r[2],name:r[3],prereqs:r[4],objectives:r[5],tools:ACADEMY_TOOLS[r[0]]||[],dependents:[],depth:0,level:"",order:0};
    if(byId[t.id])errors.push("id duplicado: "+t.id);
    if(!areas[t.area])errors.push("área desconhecida em "+t.id+": "+t.area);
    if(!t.name)errors.push("sem nome: "+t.id);
    if(!t.objectives||!t.objectives.length)errors.push("sem objetivos: "+t.id);
    if(!Array.isArray(t.prereqs))errors.push("pré-requisitos inválidos em "+t.id);
    byId[t.id]=t;topics.push(t);
  });
  topics.forEach(function(t){
    (t.prereqs||[]).forEach(function(p){
      if(p===t.id)errors.push("pré-requisito de si mesmo: "+t.id);
      else if(!byId[p])errors.push(t.id+" depende de "+p+", que não existe");
      else byId[p].dependents.push(t.id);
    });
  });
  var areaOrder=function(t){return (areas[t.area]?areas[t.area].n:99)*1000};
  var indeg={};topics.forEach(function(t){indeg[t.id]=(t.prereqs||[]).filter(function(p){return byId[p]}).length});
  var ready=topics.filter(function(t){return indeg[t.id]===0}).sort(function(a,b){return areaOrder(a)-areaOrder(b)||a.id.localeCompare(b.id)});
  var seen=[];
  while(ready.length){
    var t=ready.shift();seen.push(t);
    t.order=seen.length;
    var d=[];
    t.dependents.forEach(function(id){indeg[id]--;if(indeg[id]===0)d.push(byId[id])});
    ready=ready.concat(d).sort(function(a,b){return areaOrder(a)-areaOrder(b)||a.id.localeCompare(b.id)});
    // profundidade: maior cadeia de pré-requisitos até esta aula
  }
  seen.forEach(function(t){
    t.depth=(t.prereqs||[]).reduce(function(m,p){return byId[p]?Math.max(m,byId[p].depth+1):m},0);
    t.level=t.depth<=1?"Iniciante":t.depth<=4?"Básico":t.depth<=7?"Intermediário":"Avançado";
  });
  if(seen.length<topics.length){
    var stuck=topics.filter(function(t){return !t.order}).map(function(t){return t.id});
    errors.push("ciclo de pré-requisitos envolvendo: "+stuck.join(", "));
    stuck.forEach(function(id){byId[id].level="Revisar (ciclo)"});
  }
  return {topics:seen.concat(topics.filter(function(t){return !t.order})),byId:byId,areas:areas,errors:errors};
}

var ACADEMY=academyGraph(ACADEMY_TOPIC_ROWS);

function academyTopic(id){return ACADEMY.byId[id]||null}
function academyArea(id){return ACADEMY.areas[id]||null}
function academyTopicsOf(areaId){return ACADEMY.topics.filter(function(t){return t.area===areaId}).sort(function(a,b){return a.order-b.order})}

// Estado de uma aula: "planejado" enquanto não há texto; depois, o status do próprio texto.
function academyStatus(id){
  var l=typeof ACADEMY_LESSONS!=="undefined"?ACADEMY_LESSONS[id]:null;
  if(!l)return "planejado";
  return l.status||"em produção";
}
function academyHasLesson(id){
  return typeof ACADEMY_LESSONS!=="undefined"&&!!ACADEMY_LESSONS[id];
}

// Todos os pré-requisitos, diretos e indiretos, em ordem de trilha.
function academyAncestors(id){
  var out=new Set(),stack=[id];
  while(stack.length){
    var t=academyTopic(stack.pop());
    if(!t)continue;
    t.prereqs.forEach(function(p){if(!out.has(p)){out.add(p);stack.push(p)}});
  }
  return [...out].map(academyTopic).filter(Boolean).sort(function(a,b){return a.order-b.order});
}

function academyNorm(s){
  return String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
}

// Busca por nome, área, subcategoria e objetivos. Todas as palavras precisam aparecer.
function academySearch(q){
  var words=academyNorm(q).split(/\s+/).filter(Boolean);
  if(!words.length)return [];
  return ACADEMY.topics.filter(function(t){
    var area=academyArea(t.area);
    var hay=academyNorm([t.name,t.sub,t.id,area?area.name:"",t.objectives.join(" ")].join(" "));
    return words.every(function(w){return hay.indexOf(w)!==-1});
  }).sort(function(a,b){
    // Acerto no nome do assunto vem antes de acerto só na área ou nos objetivos.
    var na=words.every(function(w){return academyNorm(a.name).indexOf(w)!==-1})?0:1;
    var nb=words.every(function(w){return academyNorm(b.name).indexOf(w)!==-1})?0:1;
    return na-nb||a.order-b.order;
  });
}
