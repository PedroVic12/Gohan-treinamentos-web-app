"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, RotateCcw, Dumbbell, Brain, Lightbulb, Sparkles, BookOpen, Menu, X } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  count: number
  icon: React.ElementType
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "One to make your Money",
    description: "Trabalhar em alguma tarefa que gere renda. Projetos Tech: Chatbots, Sites, Aplicativos, automacao e modelos IA",
    count: 0,
    icon: Sparkles,
  },
  {
    id: "2",
    title: "One to keep you in shape",
    description: "Treino fisico Calistenia + Alongamentos + Calistenia App + Movimentos Calistenicos + Forca",
    count: 0,
    icon: Dumbbell,
  },
  {
    id: "3",
    title: "One to build Knowledge",
    description: "2 Disciplinas da UFF por Dia, 2 Aulas + 5 Exercicios",
    count: 0,
    icon: Brain,
  },
  {
    id: "4",
    title: "One to Grow your Mindset",
    description: "Fazer 1 Projeto que resolva problemas e colocar em pratica algo que voce aprendeu hoje",
    count: 0,
    icon: Lightbulb,
  },
  {
    id: "5",
    title: "One to Stay Creative",
    description: "Ler um livro, refletir ou estudar algo de valor interno. Assistir a documentarios, explorar o universo",
    count: 0,
    icon: BookOpen,
  },
]

const taskMessages: Record<string, string[]> = {
  "1": [
    "Continue se esforcando! Seu crescimento profissional e imparavel!",
    "Lembre-se de seus objetivos! Voce esta cada vez mais perto de ser o melhor!",
    "Fazendo projetos profissionais! Voce esta construindo seu futuro sempre inovando!",
  ],
  "2": [
    "Seu corpo vai agradecer! Continue se movendo! Nao desista, use sua forca de Sayajin!",
    "Saude e riqueza! Otimo treino! Sempre mais forte!!! Modo SUPER SAYAJIN",
    "Mais forte a cada dia! 1% melhor a cada dia!",
  ],
  "3": [
    "Conhecimento e poder! Continue aprendendo!",
    "Seu cerebro esta ficando mais forte! A neuroplasticidade e real!!",
    "Sucesso nos estudos! Voce esta ficando mais inteligente!",
  ],
  "4": [
    "Inovacao em acao! Grande resolucao de problemas!",
    "Seus projetos estao fazendo a diferenca!",
    "Solucoes criativas alcancadas! Continue construindo, inovando e criando!",
  ],
  "5": [
    "Expandindo seus horizontes! Cultura desbloqueada!",
    "Arte e criatividade alimentam a alma!",
    "Seu espirito criativo esta nas alturas!",
  ],
}

const formatDate = () => {
  const date = new Date()
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

const getTaskMessage = (taskId: string): string => {
  const messages = taskMessages[taskId]
  if (!messages) return "Great job! Keep going!"
  return messages[Math.floor(Math.random() * messages.length)]
}

const getBackgroundClass = (count: number): string => {
  if (count > 10) return "bg-purple-500/20 border-purple-500"
  if (count > 7) return "bg-yellow-500/20 border-yellow-500"
  if (count > 4) return "bg-green-500/20 border-green-500"
  return "bg-white border-gray-200"
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [toast, setToast] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const maxWeeklyCount = 40

  useEffect(() => {
    const savedTasks = localStorage.getItem("gohan-tasks")
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks)
      setTasks(
        initialTasks.map((task) => ({
          ...task,
          count: parsed.find((t: Task) => t.id === task.id)?.count || 0,
        }))
      )
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gohan-tasks", JSON.stringify(tasks))
  }, [tasks])

  const totalCount = tasks.reduce((sum, task) => sum + task.count, 0)
  const progressPercent = (totalCount / maxWeeklyCount) * 100

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const handleIncrement = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 15)
          if (newCount === 5) {
            showToast(getTaskMessage(taskId))
          }
          return { ...task, count: newCount }
        }
        return task
      })
    )

    if (totalCount === 24) {
      showToast(
        "Parabens meu jovem Padawan! Voce esta com a energia vibrando alto! Busque a paz e equilibrio!"
      )
    }
  }

  const handleRefresh = () => {
    setTasks(initialTasks)
    showToast("Rotinas resetadas! Tenha um otimo inicio de semana!")
  }

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/calistenia", label: "Calistenia" },
    { href: "/treinos", label: "Treinos" },
    { href: "/quizz", label: "Quizz" },
    { href: "/tasks", label: "Tarefas" },
    { href: "/alarme", label: "Alarme" },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-orange-500 shadow-md">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white active:bg-orange-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold text-white">Gohan Treinamentos 2025</h1>
          <button
            onClick={handleRefresh}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white active:bg-orange-600"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative z-10 h-full w-64 bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-orange-500">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-500 active:bg-orange-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-4 right-4 z-50 rounded-lg bg-gray-900 px-4 py-3 text-center text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6">
        {/* Date */}
        <p className="mb-6 text-center text-base capitalize text-gray-500">{formatDate()}</p>

        {/* Hobbies Section */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-orange-500">You Only Need 5 hobbies</h2>
          <p className="text-sm text-gray-500">(Corpo x Mente x Espirito)</p>
        </div>

        {/* Tasks List */}
        <div className="mb-6 flex flex-col gap-3">
          {tasks.map((task) => {
            const Icon = task.icon
            return (
              <div
                key={task.id}
                className={`rounded-xl border-2 p-4 shadow-sm transition-all ${getBackgroundClass(task.count)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Icon className="h-5 w-5 text-orange-500" />
                      <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">{task.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                    <span className="text-sm font-medium text-gray-700">{task.count}/15</span>
                    <button
                      onClick={() => handleIncrement(task.id)}
                      disabled={task.count >= 15}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white disabled:bg-gray-300"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <h3 className="mb-2 text-base font-semibold text-red-500">
            Desempenho da semana: {totalCount}/{maxWeeklyCount}
          </h3>
          <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Motivational Text */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm text-gray-700">
            Importante cuidar das suas Habilidades (trabalho), Saude mental (estudos), saude
            emocional (relacionamentos) e saude fisica (treinos)!
          </p>
          <p className="text-sm font-medium text-orange-500">
            Hora de se tornar um Super Sayajin em 2025 e sua melhor versao: Lindo, Inteligente e
            Gostoso!
          </p>
        </div>
      </div>
    </main>
  )
}
