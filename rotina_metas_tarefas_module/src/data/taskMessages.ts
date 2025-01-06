interface TaskMessage {
  id: string;
  messages: string[];
}

export const taskMessages: TaskMessage[] = [
  {
    id: '1',
    messages: [
      "Keep hustling! Your career growth is unstoppable! 💼",
      "Making money moves! You're building your future! 💰",
      "Professional excellence achieved today! 🌟"
    ]
  },
  {
    id: '2',
    messages: [
      "Your body will thank you! Keep moving! 💪",
      "Health is wealth! Great workout! 🏃‍♂️",
      "Stronger every day! You're crushing it! 🎯"
    ]
  },
  {
    id: '3',
    messages: [
      "Knowledge is power! Keep learning! 📚",
      "Your brain is getting stronger! 🧠",
      "Study success! You're getting smarter! 🎓"
    ]
  },
  {
    id: '4',
    messages: [
      "Innovation in action! Great problem-solving! 💡",
      "Your projects are making a difference! 🚀",
      "Creative solutions achieved! Keep building! 🛠️"
    ]
  },
  {
    id: '5',
    messages: [
      "Expanding your horizons! Culture unlocked! 🎨",
      "Art and creativity fuel the soul! 🎭",
      "Your creative spirit is soaring! 📖"
    ]
  }
];

export const getTaskMessage = (taskId: string): string => {
  const task = taskMessages.find(t => t.id === taskId);
  if (!task) return "Great job! Keep going! 🎉";
  
  const randomIndex = Math.floor(Math.random() * task.messages.length);
  return task.messages[randomIndex];
};