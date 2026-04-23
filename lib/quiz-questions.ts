export type QuizOption = {
  text: string
  correct?: boolean
}

export type QuizQuestion = {
  id: number
  emoji: string
  theme: string
  character: string // image path
  characterName: string
  question: string
  options: QuizOption[]
  explanation: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    emoji: '🥣',
    theme: 'Alimentação',
    character: '/characters/tosh.png',
    characterName: 'Tosh',
    question: 'Qual destes alimentos o cachorrinho NÃO pode comer?',
    options: [
      { text: 'Ração própria para cães' },
      { text: 'Chocolate', correct: true },
      { text: 'Água fresca' },
      { text: 'Pedaços de maçã sem semente' },
    ],
    explanation: 'Chocolate é muito perigoso para cães! Sempre ofereça só comida própria para pets.',
  },
  {
    id: 2,
    emoji: '🛁',
    theme: 'Higiene',
    character: '/characters/brenda.png',
    characterName: 'Brenda',
    question: 'De quanto em quanto tempo é legal escovar o pelinho do seu pet?',
    options: [
      { text: 'Uma vez por ano' },
      { text: 'Só quando ficar sujo' },
      { text: 'Toda semana, com carinho', correct: true },
      { text: 'Nunca, eles se limpam sozinhos' },
    ],
    explanation: 'Escovar toda semana deixa o pelo lindo, tira nós e é um momento gostoso de carinho!',
  },
  {
    id: 3,
    emoji: '💕',
    theme: 'Carinho',
    character: '/characters/greg.png',
    characterName: 'Greg',
    question: 'Qual é a melhor forma de mostrar amor ao seu bichinho?',
    options: [
      { text: 'Gritar com ele quando erra' },
      { text: 'Dar carinho, brincar e passear', correct: true },
      { text: 'Deixar ele sozinho o dia inteiro' },
      { text: 'Puxar o rabo ou as orelhas' },
    ],
    explanation: 'Pets amam brincar, passear e receber carinho! Nunca puxe o rabo ou orelhas – machuca.',
  },
  {
    id: 4,
    emoji: '💚',
    theme: 'Responsabilidade',
    character: '/characters/dona-nanda.png',
    characterName: 'Dona Nanda',
    question: 'Ao encontrar um animalzinho abandonado na rua, o que fazer?',
    options: [
      { text: 'Fingir que não vi' },
      { text: 'Jogar pedras para ele sair' },
      { text: 'Contar a um adulto de confiança para ajudar', correct: true },
      { text: 'Levar para casa escondido' },
    ],
    explanation: 'O melhor é sempre chamar um adulto ou uma ONG como a Toca do Tosh para cuidar com segurança!',
  },
  {
    id: 5,
    emoji: '💼',
    theme: 'Saúde',
    character: '/characters/zig.png',
    characterName: 'Zig',
    question: 'Quem cuida da saúde dos animais quando eles ficam doentes?',
    options: [
      { text: 'O padeiro' },
      { text: 'O veterinário', correct: true },
      { text: 'O motorista de ônibus' },
      { text: 'Ninguém precisa' },
    ],
    explanation: 'O veterinário é o médico dos bichinhos! Visitas regulares mantêm eles saudáveis.',
  },
  {
    id: 6,
    emoji: '🏠',
    theme: 'Adoção',
    character: '/characters/tosh.png',
    characterName: 'Tosh',
    question: 'Adotar um pet significa:',
    options: [
      { text: 'Ter um brinquedo por alguns dias' },
      { text: 'Cuidar dele por toda a vida com amor', correct: true },
      { text: 'Devolver quando ficar grande' },
      { text: 'Deixar sozinho no quintal' },
    ],
    explanation: 'Adotar é um compromisso de amor pra vida toda! Um pet faz parte da família.',
  },
]
