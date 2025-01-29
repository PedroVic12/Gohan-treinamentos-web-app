interface TaskMessage {
  id: string;
  messages: string[];
}

export const taskMessages: TaskMessage[] = [
  {
    id: '1',
    messages: [
      "Continue se esforçando! Seu crescimento profissional é imparável! 💼",
      "Fazendo movimentos financeiros! Você está construindo seu futuro! 💰",
      "Excelência profissional alcançada hoje! 🌟"
    ]
  },
  {
    id: '2',
    messages: [
      "Seu corpo vai agradecer! Continue se movendo! Não desista, use sua força de Sayajin! 💪",
      "Saúde é riqueza! Ótimo treino! Sempre mais forte!!! 🏃‍♂️",
      "Mais forte a cada dia! 1% melhor a cada dia! 🎯"
    ]
  },
  {
    id: '3',
    messages: [
      "Conhecimento é poder! Continue aprendendo! 📚",
      "Seu cérebro está ficando mais forte! A neuroplasticidade é real!! 🧠",
      "Sucesso nos estudos! Você está ficando mais inteligente! 🎓"
    ]
  },
  {
    id: '4',
    messages: [
      "Inovação em ação! Grande resolução de problemas! 💡",
      "Seus projetos estão fazendo a diferença! 🚀",
      "Soluções criativas alcançadas! Continue construindo! 🛠️"
    ]
  },
  {
    id: '5',
    messages: [
      "Expandindo seus horizontes! Cultura desbloqueada! 🎨",
      "Arte e criatividade alimentam a alma! 🎭",
      "Seu espírito criativo está nas alturas! 📖"
    ]
  }
];

export const getTaskMessage = (taskId: string): string => {
  const task = taskMessages.find(t => t.id === taskId);
  if (!task) return "Great job! Keep going! 🎉";
  
  const randomIndex = Math.floor(Math.random() * task.messages.length);
  return task.messages[randomIndex];
};