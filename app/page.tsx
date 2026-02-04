import Link from "next/link"
import { Dumbbell, Brain, Clock, ListTodo, Gamepad2, LayoutDashboard } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      title: "Calistenia Training",
      description: "Generate personalized calisthenics workout routines",
      icon: Dumbbell,
      href: "/training",
    },
    {
      title: "AI Trainer (Goku)",
      description: "AI-powered training assistant using computer vision",
      icon: Brain,
      href: "/ai-trainer",
    },
    {
      title: "Task Manager",
      description: "Manage your daily tasks and training goals",
      icon: ListTodo,
      href: "/tasks",
    },
    {
      title: "Alarm Clock",
      description: "Smart alarm with training reminders",
      icon: Clock,
      href: "/clock",
    },
    {
      title: "Quiz Game",
      description: "Test your knowledge with interactive quizzes",
      icon: Gamepad2,
      href: "/quiz",
    },
    {
      title: "Dashboard",
      description: "View your training progress and statistics",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-500/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Gohan Treinamentos
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Your complete training companion with AI-powered workout generation, task management, and progress tracking.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/training"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
              >
                Start Training
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-accent"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-orange-500/50 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-orange-500/10 p-3">
                  <feature.icon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-card-foreground group-hover:text-orange-500">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Gohan Treinamentos - Your AI Training Companion</p>
        </div>
      </footer>
    </main>
  )
}
