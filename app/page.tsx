"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, RotateCcw, Dumbbell, Brain, Lightbulb, Sparkles, BookOpen, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
  if (count > 10) return "bg-purple-500/20 border-purple-500/50"
  if (count > 7) return "bg-yellow-500/20 border-yellow-500/50"
  if (count > 4) return "bg-green-500/20 border-green-500/50"
  return "bg-card border-border"
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [toast, setToast] = useState<string | null>(null)
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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-primary">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="mt-8 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-bold text-primary-foreground">Gohan Treinamentos 2025</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-primary-foreground"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-foreground px-4 py-2 text-background shadow-lg">
          {toast}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* Date */}
        <p className="mb-6 text-center text-lg capitalize text-muted-foreground">{formatDate()}</p>

        {/* Hobbies Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-primary">You Only Need 5 hobbies</h2>
          <p className="text-muted-foreground">(Corpo x Mente x Espirito)</p>
        </div>

        {/* Tasks List */}
        <div className="mb-8 flex flex-col gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`transition-all hover:-translate-y-0.5 hover:shadow-lg ${getBackgroundClass(task.count)}`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <task.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-card-foreground">{task.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <span className="text-sm font-medium">{task.count}/15</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleIncrement(task.id)}
                    disabled={task.count >= 15}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold text-destructive">
            Desempenho da semana: {totalCount}/{maxWeeklyCount}
          </h3>
          <Progress value={(totalCount / maxWeeklyCount) * 100} className="h-6" />
        </div>

        {/* Motivational Text */}
        <div className="rounded-lg bg-card p-4 text-card-foreground">
          <p className="mb-4">
            Importante cuidar das suas Habilidades (trabalho), Saude mental (estudos), saude
            emocional (relacionamentos) e saude fisica (treinos)!
          </p>
          <p className="font-medium text-primary">
            Hora de se tornar um Super Sayajin em 2025 e sua melhor versao: Lindo, Inteligente e
            Gostoso!
          </p>
        </div>
      </div>
    </main>
  )
}
