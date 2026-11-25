/* OVERKILL Academy — aulas escritas.
   Cada aula tem as 12 seções obrigatórias (ver ACADEMY_SECTIONS em academy-data.js).
   Cada seção é uma lista de blocos:
     "texto"                      parágrafo
     {ul:["...","..."]}           lista com marcadores
     {ol:["...","..."]}           lista numerada
     {math:"..."}                 fórmula em destaque
     {quiz:[{q,opcoes[],certa,explica}]}   certa = índice (base 0) da opção correta
     {glos:[["termo","definição"]]}        glossário
   Aulas sem texto aparecem como "planejado" na interface.
   [PRECISA CONFIRMAR] Textos em revisão: validar com o responsável pelo conteúdo antes de publicar. */

var ACADEMY_LESSONS={

  "potenciacao":{
    status:"em produção",
    sections:{
      oque:[
        "Potenciação é uma forma curta de escrever uma multiplicação em que o mesmo número se repete várias vezes.",
        "Em a^n, o número a é a base e o número n é o expoente. Lê-se “a elevado a n”.",
        {math:"a^n = a · a · a · … · a   (n fatores iguais a a)"}
      ],
      paraque:[
        "Serve para escrever e calcular multiplicações repetidas sem precisar escrever todos os fatores.",
        "Aparece em área (m²), volume (cm³), crescimento de populações, juros compostos e na contagem de bits em computação.",
        "Notação científica, como 3 · 10^8 m/s (velocidade da luz), depende dela."
      ],
      porque:[
        "Multiplicar o mesmo fator muitas vezes é comum, e escrever 2 · 2 · 2 · … com 40 fatores seria impraticável.",
        "A notação com expoente resume a operação e permite reconhecer padrões, como o fato de que dobrar algo n vezes dá 2^n."
      ],
      comofunciona:[
        "O expoente diz quantas vezes a base entra como fator. O expoente 1 não repete nada: a^1 = a.",
        "Quando o expoente é 0, a potência vale 1 (para base diferente de zero). Quando o expoente é negativo, a potência é o inverso da potência com expoente positivo.",
        "Ao elevar um número negativo, o sinal depende do expoente: par dá positivo, ímpar dá negativo."
      ],
      comocalcular:[
        {ol:[
          "Identifique a base (o número que se repete) e o expoente (quantas vezes ele aparece).",
          "Escreva a multiplicação com a base repetida pelo número de vezes do expoente.",
          "Multiplique, ou use as regras de sinal se a base for negativa."
        ]},
        "Para expoente negativo, troque o sinal do expoente e calcule o inverso: a^(−n) = 1 / a^n."
      ],
      formulas:[
        {math:"a^n = a · a · … · a   (n vezes)"},
        {math:"a^0 = 1   (a ≠ 0)"},
        {math:"a^1 = a"},
        {math:"a^(−n) = 1 / a^n   (a ≠ 0)"}
      ],
      exemplos:[
        {ul:[
          "2^5 = 2 · 2 · 2 · 2 · 2 = 32",
          "3^3 = 3 · 3 · 3 = 27",
          "10^3 = 10 · 10 · 10 = 1000",
          "5^0 = 1",
          "2^(−3) = 1 / 2^3 = 1/8 = 0,125",
          "(−2)^4 = (−2) · (−2) · (−2) · (−2) = 16",
          "−2^4 = −(2^4) = −16"
        ]}
      ],
      pratica:[
        "Em informática, 1 KB equivale a 2^10 = 1024 bytes. Cada bit adicional dobra a quantidade de valores que se consegue representar.",
        "Uma cultura de bactérias que dobra a cada hora tem 2^5 = 32 vezes a quantidade inicial depois de 5 horas. Esse é o raciocínio básico de crescimento exponencial."
      ],
      erros:[
        {ul:[
          "2^3 não é 2 · 3 = 6. O expoente indica repetição, não multiplicação pelo expoente. 2^3 = 8.",
          "−2^2 e (−2)^2 são diferentes: o primeiro vale −4, o segundo vale 4. Sem parênteses, o sinal de menos não entra na potência.",
          "a^0 = 1, não 0.",
          "2^3 + 2^4 não é 2^7. Potências somam-se como números separados: 8 + 16 = 24.",
          "Expoente negativo não deixa o resultado negativo: 2^(−1) = 1/2 é positivo."
        ]}
      ],
      relacoes:[
        "Pré-requisitos desta aula: ordem das operações, multiplicação.",
        "Próximos passos: propriedades das potências (regras para simplificar), radiciação (raízes como expoente fracionário) e logaritmos (a operação inversa).",
        "Ferramenta do OVERKILL: na Calculadora, a tecla x^y calcula potências."
      ],
      exercicios:[
        {quiz:[
          {q:"Quanto vale 2^4?",opcoes:["6","8","16","24"],certa:2,explica:"2 · 2 · 2 · 2 = 16."},
          {q:"Quanto vale (−2)^2?",opcoes:["−4","−2","2","4"],certa:3,explica:"(−2) · (−2) = 4. Dois fatores negativos dão resultado positivo."},
          {q:"Quanto vale 5^0?",opcoes:["0","1","5","10"],certa:1,explica:"Qualquer base diferente de zero elevada a zero vale 1."}
        ]}
      ],
      glossario:[
        {glos:[
          ["Base","Número que é multiplicado por si mesmo na potência."],
          ["Expoente","Número que indica quantas vezes a base aparece como fator."],
          ["Potência","Resultado de elevar uma base a um expoente."],
          ["Expoente zero","Qualquer base (diferente de zero) elevada a zero dá 1."],
          ["Expoente negativo","Indica o inverso da potência com expoente positivo."]
        ]}
      ]
    }
  },

  "propriedades-das-potencias":{
    status:"em produção",
    sections:{
      oque:[
        "As propriedades das potências são regras para simplificar expressões que têm potências, sem calcular cada potência separadamente.",
        "Elas valem para potências de mesma base (ou de produtos e quocientes, como será visto)."
      ],
      paraque:[
        "Permitem simplificar cálculos grandes, como 10^6 · 10^3, sem fazer a multiplicação inteira.",
        "São usadas em expressões algébricas (monômios e polinômios) e na derivação de funções."
      ],
      porque:[
        "As regras não são arbitrárias: saem da definição de potência como multiplicação repetida.",
        "Por exemplo, a^2 · a^3 = (a·a) · (a·a·a) = a^5. São cinco fatores de a, então o expoente soma 2 + 3."
      ],
      comofunciona:[
        "Existem seis regras principais. Três tratam de operações com a mesma base (multiplicação, divisão e potência de potência). Outras tratam de produtos e quocientes elevados a um expoente, e de expoentes zero e negativos.",
        "Regra de ouro: somar ou subtrair expoentes só funciona quando a base é a mesma."
      ],
      comocalcular:[
        {ol:[
          "Verifique se as bases são iguais. Se forem, a regra de expoentes se aplica.",
          "Escolha a regra certa: multiplicação soma, divisão subtrai, potência de potência multiplica.",
          "Simplifique o expoente resultante e, se possível, calcule a potência final."
        ]},
        "Se as bases forem diferentes, verifique se é possível reescrevê-las com a mesma base (por exemplo, 4 = 2^2) antes de aplicar as regras."
      ],
      formulas:[
        {math:"a^m · a^n = a^(m+n)"},
        {math:"a^m / a^n = a^(m−n)   (a ≠ 0)"},
        {math:"(a^m)^n = a^(m·n)"},
        {math:"(a · b)^n = a^n · b^n"},
        {math:"(a / b)^n = a^n / b^n   (b ≠ 0)"},
        {math:"a^0 = 1   (a ≠ 0)"},
        {math:"a^(−n) = 1 / a^n   (a ≠ 0)"}
      ],
      exemplos:[
        {ul:[
          "2^3 · 2^4 = 2^7 = 128",
          "5^6 / 5^2 = 5^4 = 625",
          "(3^2)^3 = 3^6 = 729",
          "(2x)^3 = 2^3 · x^3 = 8x^3",
          "(2/3)^2 = 2^2 / 3^2 = 4/9",
          "x^5 / x^5 = x^0 = 1   (x ≠ 0)",
          "x^(−2) = 1 / x^2   (x ≠ 0)"
        ]}
      ],
      pratica:[
        "10^6 · 10^3 = 10^9: um milhão vezes mil é um bilhão. Escrever em potências de 10 facilita a conta.",
        "Na notação científica, 300 000 000 = 3 · 10^8. Para multiplicar dois números assim, multiplicam-se as partes decimais e somam-se os expoentes de 10."
      ],
      erros:[
        {ul:[
          "Somar expoentes com bases diferentes: 2^3 · 3^3 é (2 · 3)^3 = 6^3 = 216, não 6^6.",
          "Somar expoentes na soma: 2^3 + 2^4 não é 2^7. A regra vale só para multiplicação.",
          "Na potência de potência, multiplicar os expoentes: (2^3)^2 = 2^6, não 2^5.",
          "Distribuir a potência sobre a soma: (2 + 3)^2 = 25, mas 2^2 + 3^2 = 13. A potência não se distribui sobre soma.",
          "Esquecer a condição a ≠ 0 em divisões e expoentes negativos."
        ]}
      ],
      relacoes:[
        "Pré-requisitos desta aula: potenciação, positivos e negativos, divisão.",
        "Próximos passos: radiciação (raiz como expoente fracionário), exponenciais, monômios e polinômios e regras de derivação.",
        "Relacionada a: logaritmos, que usam as mesmas propriedades ao contrário."
      ],
      exercicios:[
        {quiz:[
          {q:"Quanto é 3^4 · 3^2?",opcoes:["3^6","3^8","9^6","3^2"],certa:0,explica:"Bases iguais na multiplicação: somam-se os expoentes, 4 + 2 = 6."},
          {q:"Quanto é (2^3)^2?",opcoes:["2^5","2^6","2^9","4^5"],certa:1,explica:"Potência de potência: multiplicam-se os expoentes, 3 · 2 = 6."},
          {q:"Quanto é 10^5 / 10^2?",opcoes:["10^3","10^7","10^10","10^(5/2)"],certa:0,explica:"Bases iguais na divisão: subtraem-se os expoentes, 5 − 2 = 3."}
        ]}
      ],
      glossario:[
        {glos:[
          ["Propriedade","Regra que vale sempre e permite transformar uma expressão em outra equivalente."],
          ["Base comum","Mesma base nos dois fatores, condição para somar ou subtrair expoentes."],
          ["Potência de potência","Potência cuja base também é uma potência; os expoentes se multiplicam."],
          ["Expoente zero","Potência de expoente zero vale 1 (base diferente de zero)."],
          ["Expoente negativo","Equivale ao inverso da potência com expoente positivo."]
        ]}
      ]
    }
  },

  "logaritmos":{
    status:"em produção",
    sections:{
      oque:[
        "Logaritmo é a pergunta inversa da potência: “a que expoente devo elevar a base para obter este número?”.",
        {math:"log_b(a) = x   significa   b^x = a"},
        "b é a base (b > 0 e b ≠ 1). a é o logaritmando (a > 0). x é o resultado: o expoente."
      ],
      paraque:[
        "Serve para descobrir expoentes desconhecidos, como o tempo que um investimento leva para dobrar.",
        "Usado em escalas que cobrem valores muito grandes, como pH (acidez), decibéis (som) e escala Richter (terremotos).",
        "Também é base de muitas funções de crescimento e de modelos da matemática financeira."
      ],
      porque:[
        "Quando os números crescem rápido, é difícil comparar grandezas em escala linear. O logaritmo as comprime para uma escala que se lê com facilidade.",
        "Antes das calculadoras, tábuas de logaritmos transformavam multiplicações em somas, o que tornava muitos cálculos viáveis."
      ],
      comofunciona:[
        "Um logaritmo tem três partes: a base, o número (logaritmando) e o resultado (expoente).",
        "Quando o logaritmando é uma potência exata da base, o resultado é um número inteiro. Por exemplo, log₂(8) = 3, porque 2³ = 8.",
        "Quando não é exato, o resultado é decimal e normalmente se obtém com calculadora, usando a mudança de base."
      ],
      comocalcular:[
        {ol:[
          "Identifique a base b e o número a.",
          "Escreva a equação correspondente: b^x = a.",
          "Encontre x. Se a for potência exata de b, é inteiro; caso contrário, use a mudança de base."
        ]},
        "Exemplo sem potência exata: log₂(20) = log(20) / log(2) ≈ 1,30103 / 0,30103 ≈ 4,32."
      ],
      formulas:[
        {math:"log_b(a) = x  ⟺  b^x = a"},
        {math:"log_b(1) = 0   e   log_b(b) = 1"},
        {math:"log_b(a · c) = log_b(a) + log_b(c)"},
        {math:"log_b(a / c) = log_b(a) − log_b(c)"},
        {math:"log_b(a^n) = n · log_b(a)"},
        {math:"log_b(a) = log_c(a) / log_c(b)   (mudança de base)"}
      ],
      exemplos:[
        {ul:[
          "log₂(16) = 4, porque 2^4 = 16.",
          "log₃(81) = 4, porque 3^4 = 81.",
          "log₅(125) = 3, porque 5^3 = 125.",
          "log(1000) = 3 (base 10 implícita), porque 10^3 = 1000.",
          "log(2 · 5) = log(2) + log(5) = log(10) = 1.",
          "log₂(20) ≈ 4,32 pela mudança de base."
        ]}
      ],
      pratica:[
        "pH: é definido como pH = −log₁₀[H⁺]. Uma solução com concentração de H⁺ igual a 10^(−3) tem pH = 3. Cada unidade de pH corresponde a uma variação de 10 vezes na concentração.",
        "Juros: para saber em quantos anos um valor dobra a uma taxa fixa, usa-se logaritmo. A relação com juros compostos aparece em juros-compostos."
      ],
      erros:[
        {ul:[
          "log(a + c) não é log(a) + log(c). A regra de soma vale para o produto dentro do logaritmo, não para a soma.",
          "log(a) · log(c) não é log(a · c), e log(a) / log(c) não é log(a / c).",
          "Logaritmo de número negativo ou zero não existe nos números reais: o logaritmando precisa ser maior que zero.",
          "log_b(a) não é a / b. É o expoente, não uma divisão.",
          "Sem indicação, log costuma significar base 10 no OVERKILL. [PRECISA CONFIRMAR] convenção a ser mantida na documentação."
        ]}
      ],
      relacoes:[
        "Pré-requisitos desta aula: multiplicação, divisão, potenciação e propriedades das potências. Os textos de multiplicação e divisão ainda não estão escritos.",
        "Próximos passos: logaritmos naturais (base e), funções logarítmicas e juros compostos.",
        "Ferramenta do OVERKILL: na Calculadora, a tecla log calcula logaritmo de base 10."
      ],
      exercicios:[
        {quiz:[
          {q:"Quanto vale log₂(32)?",opcoes:["4","5","6","16"],certa:1,explica:"2^5 = 32, então o expoente é 5."},
          {q:"Quanto vale log(100) na base 10?",opcoes:["1","2","10","50"],certa:1,explica:"10^2 = 100, então log(100) = 2."},
          {q:"Qual é a regra correta para log_b(a · c)?",opcoes:["log_b(a) · log_b(c)","log_b(a) + log_b(c)","log_b(a + c)","a · c"],certa:1,explica:"O logaritmo de um produto é a soma dos logaritmos dos fatores."}
        ]}
      ],
      glossario:[
        {glos:[
          ["Logaritmo","Expoente ao qual uma base deve ser elevada para produzir um número."],
          ["Base","Número elevado ao expoente. Em log_b(a), é o b."],
          ["Logaritmando","Número do qual se calcula o logaritmo. Precisa ser maior que zero."],
          ["Log comum","Logaritmo de base 10, escrito apenas como log."],
          ["Mudança de base","Fórmula que converte um logaritmo em outro, de base diferente, para facilitar o cálculo."]
        ]}
      ]
    }
  }
};
