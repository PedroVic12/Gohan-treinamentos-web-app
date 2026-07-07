export const digitalQuestions = [
  {
    id: 1,
    question: "Um Flip-Flop D ativo na borda de subida tem D conectado a Q_bar. Se a frequência do clock de entrada for de 120 MHz, qual será a frequência da saída Q?",
    difficulty: "Médio",
    source: "Prova P2",
    options: {
      a: "120 MHz",
      b: "60 MHz",
      c: "240 MHz",
      d: "30 MHz"
    },
    correctAnswer: "b"
  },
  {
    id: 2,
    question: "Em um contador assíncrono (ripple counter) de 7 bits conectado a um clock de 1 MHz, qual é a frequência do sinal na saída do último Flip-Flop (Q6)?",
    difficulty: "Difícil",
    source: "Prova P2",
    options: {
      a: "7,81 kHz (1 MHz / 128)",
      b: "14,28 kHz (1 MHz / 70)",
      c: "15,62 kHz (1 MHz / 64)",
      d: "500 kHz (1 MHz / 2)"
    },
    correctAnswer: "a"
  },
  {
    id: 3,
    question: "Considere um contador assíncrono de 4 bits onde cada FF tem atraso t_pd = 12 ns. Para reciclar de '1111' para '0000', quanto tempo leva até estabilizar o último bit?",
    difficulty: "Médio",
    source: "Lista de Exercícios",
    options: {
      a: "12 ns",
      b: "24 ns",
      c: "36 ns",
      d: "48 ns"
    },
    correctAnswer: "d"
  },
  {
    id: 4,
    question: "Para projetar um divisor de frequência industrial que reduza o sinal da rede elétrica de 60 Hz para 10 Hz, qual deve ser o módulo do contador?",
    difficulty: "Fácil",
    source: "Fonte Própria",
    options: {
      a: "Módulo 5",
      b: "Módulo 6",
      c: "Módulo 10",
      d: "Módulo 60"
    },
    correctAnswer: "b"
  },
  {
    id: 5,
    question: "Em um contador assíncrono de 4 bits (Q3 Q2 Q1 Q0) com reset conectado a uma porta NAND com entradas Q3 e Q1, qual é o estado temporário (glitch state) que ativa o Clear?",
    difficulty: "Difícil",
    source: "Prova P2",
    options: {
      a: "1010 (decimal 10)",
      b: "1100 (decimal 12)",
      c: "1001 (decimal 9)",
      d: "0110 (decimal 6)"
    },
    correctAnswer: "a"
  },
  {
    id: 6,
    question: "Qual é a principal diferença na conexão física do clock entre contadores síncronos e assíncronos?",
    difficulty: "Fácil",
    source: "Fonte Própria",
    options: {
      a: "No síncrono, o clock é conectado apenas ao primeiro Flip-Flop.",
      b: "No assíncrono, o clock é conectado simultaneamente a todos os Flip-Flops.",
      c: "No síncrono, o clock é conectado simultaneamente a todos os Flip-Flops.",
      d: "Não há diferença física, apenas lógica."
    },
    correctAnswer: "c"
  },
  {
    id: 7,
    question: "Qual é a definição correta do parâmetro de tempo de Setup (t_s) de um Flip-Flop?",
    difficulty: "Médio",
    source: "Lista de Exercícios",
    options: {
      a: "O tempo que a saída leva para se estabilizar após a borda do clock.",
      b: "O intervalo de tempo mínimo que a entrada de dados deve estar estável antes da borda ativa do clock.",
      c: "O intervalo de tempo mínimo que a entrada de dados deve permanecer estável após a borda ativa do clock.",
      d: "A largura mínima exigida para o pulso de clock."
    },
    correctAnswer: "b"
  },
  {
    id: 8,
    question: "Qual é a definição correta do parâmetro de tempo de Hold (t_h) de um Flip-Flop?",
    difficulty: "Médio",
    source: "Lista de Exercícios",
    options: {
      a: "O intervalo de tempo mínimo que a entrada de dados deve permanecer estável após a borda ativa do clock.",
      b: "O tempo máximo que o clock pode ficar em nível alto.",
      c: "O tempo mínimo que a entrada deve estar estável antes da borda do clock.",
      d: "O atraso entre a entrada D e a saída Q."
    },
    correctAnswer: "a"
  },
  {
    id: 9,
    question: "O que ocorre em circuitos síncronos de alta velocidade se os tempos de Setup ou Hold forem violados?",
    difficulty: "Difícil",
    source: "Prova P2",
    options: {
      a: "O circuito queima por sobretensão.",
      b: "A saída entra em estado de invalidade permanente.",
      c: "Ocorre o fenômeno da Metastabilidade (saída assume estado oscilatório ou indefinido temporariamente).",
      d: "A frequência do clock cai automaticamente pela metade."
    },
    correctAnswer: "c"
  },
  {
    id: 10,
    question: "Em um circuito de transferência assíncrona entre FF1 e FF2 controlados por portas NAND e uma linha 'Habilitar transferência' em nível lógico 0 (LOW), o que ocorre com o FF2?",
    difficulty: "Difícil",
    source: "Prova P2",
    options: {
      a: "O FF2 é resetado para 0.",
      b: "O FF2 entra em modo de alternância (Toggle).",
      c: "As saídas do FF2 mantêm seus estados anteriores (inativos/memória).",
      d: "O FF2 entra em estado inválido com saídas complementares iguais."
    },
    correctAnswer: "c"
  },


];
