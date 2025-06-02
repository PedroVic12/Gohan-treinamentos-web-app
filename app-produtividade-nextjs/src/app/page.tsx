"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";



//! npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-chartjs-2 chart.js


// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

// Tipos
type Task = {
  Atividade: string;
  Categoria: string;
  "Tempo (min)": number;
  Data: string;
  Completa: boolean;
  Meta?: string;
};

type WeeklyStats = {
  estudos: { atual: number; meta: number };
  projetos: { atual: number; meta: number };
};

// Dados de navegação
const navItems = [
  { name: "🏠 Início", href: "/" },
  { name: "📋 Tarefas", href: "/todo" },
  { name: "⏱️ Pomodoro", href: "/pomodoro" },
  { name: "📊 Dashboard", href: "/dashboard" },
  { name: "🧠 Estudo", href: "/study" },
  { name: "💪 Calistenia", href: "/calistenia" },
];

// Componente Timer
function Timer({ tasks, onTimeAdd }: { tasks: Task[]; onTimeAdd: (taskName: string, minutes: number) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [selectedTask, setSelectedTask] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            completeTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const startTimer = () => {
    if (!selectedTask) {
      alert("Selecione uma tarefa!");
      return;
    }
    setIsActive(true);
  };

  const completeTimer = () => {
    setIsActive(false);
    onTimeAdd(selectedTask, 25);
    setTimeLeft(25 * 60);
    alert("Tempo concluído!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">🍅 Pomodoro Timer</h2>
      <div className="text-center mb-4">
        <div className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</div>
      </div>
      
      <div className="space-y-3">
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          disabled={isActive}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Selecione uma tarefa</option>
          {tasks.map((task, index) => (
            <option key={index} value={task.Atividade}>
              {task.Atividade}
            </option>
          ))}
        </select>
        
        <div className="flex space-x-2">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Pausar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente ParetoChart
function ParetoChart({ tasks }: { tasks: Task[] }) {
  // Calcular tempo por tarefa
  const taskTimes = tasks.reduce((acc: Record<string, number>, task) => {
    acc[task.Atividade] = (acc[task.Atividade] || 0) + task["Tempo (min)"];
    return acc;
  }, {});
  
  // Ordenar por tempo (Pareto)
  const sortedTasks = Object.entries(taskTimes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const data = {
    labels: sortedTasks.map(([task]) => task),
    datasets: [
      {
        label: 'Minutos Investidos',
        data: sortedTasks.map(([_, time]) => time),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top 5 Tarefas (Princípio de Pareto)',
      },
    },
  };

  return <Bar data={data} options={options} />;
}

// Componente TaskList
function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Atividade</th>
            <th className="py-2 px-4 text-left">Categoria</th>
            <th className="py-2 px-4 text-left">Tempo (min)</th>
            <th className="py-2 px-4 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-4">{task.Atividade}</td>
              <td className="py-2 px-4">{task.Categoria}</td>
              <td className="py-2 px-4">{task["Tempo (min)"]}</td>
              <td className="py-2 px-4">{task.Data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Funções para manipulação do Excel (simuladas)
const readExcelFile = async (): Promise<Task[]> => {
  // Em produção, aqui você buscaria o arquivo Excel real
  // Simulando dados de exemplo
  return [
    { Atividade: "Estudar Transformada Z", Categoria: "Estudos", "Tempo (min)": 120, Data: "2023-10-01", Completa: true, Meta: "Semanal" },
    { Atividade: "Desenvolver Dashboard", Categoria: "Projetos", "Tempo (min)": 180, Data: "2023-10-02", Completa: false, Meta: "Semanal" },
    { Atividade: "Resolver Circuitos RLC", Categoria: "Estudos", "Tempo (min)": 90, Data: "2023-10-03", Completa: true, Meta: "Semanal" },
    { Atividade: "Implementar API", Categoria: "Projetos", "Tempo (min)": 240, Data: "2023-10-04", Completa: false, Meta: "Semanal" },
    { Atividade: "Treino Calistenia", Categoria: "Treinos", "Tempo (min)": 60, Data: "2023-10-05", Completa: true },
  ];
};

const addTimeToTask = async (tasks: Task[], taskName: string, minutes: number): Promise<Task[]> => {
  return tasks.map(task => {
    if (task.Atividade === taskName) {
      return {
        ...task,
        "Tempo (min)": (task["Tempo (min)"] || 0) + minutes,
        Data: new Date().toISOString().split('T')[0]
      };
    }
    return task;
  });
};

// Componente Dashboard
function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    estudos: { atual: 0, meta: 600 }, // 10h = 600 min
    projetos: { atual: 0, meta: 1800 } // 30h = 1800 min
  });

  // Carregar dados do Excel
  useEffect(() => {
    const loadData = async () => {
      const data = await readExcelFile();
      setTasks(data);
      
      // Calcular tempo semanal
      const estudos = data
        .filter(task => task.Categoria === "Estudos" && task.Meta === "Semanal")
        .reduce((sum, task) => sum + task["Tempo (min)"], 0);
      
      const projetos = data
        .filter(task => task.Categoria === "Projetos" && task.Meta === "Semanal")
        .reduce((sum, task) => sum + task["Tempo (min)"], 0);
      
      setWeeklyStats({
        estudos: { ...weeklyStats.estudos, atual: estudos },
        projetos: { ...weeklyStats.projetos, atual: projetos }
      });
    };
    
    loadData();
  }, []);

  const handleTimeAdd = async (taskName: string, minutes: number) => {
    const updatedTasks = await addTimeToTask(tasks, taskName, minutes);
    setTasks(updatedTasks);
    
    // Atualizar estatísticas
    const updatedEstudos = updatedTasks
      .filter(task => task.Categoria === "Estudos" && task.Meta === "Semanal")
      .reduce((sum, task) => sum + task["Tempo (min)"], 0);
    
    const updatedProjetos = updatedTasks
      .filter(task => task.Categoria === "Projetos" && task.Meta === "Semanal")
      .reduce((sum, task) => sum + task["Tempo (min)"], 0);
    
    setWeeklyStats({
      estudos: { ...weeklyStats.estudos, atual: updatedEstudos },
      projetos: { ...weeklyStats.projetos, atual: updatedProjetos }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard de Produtividade</h1>
      
      {/* Timer Pomodoro */}
      <Timer tasks={tasks} onTimeAdd={handleTimeAdd} />
      
      {/* Metas Semanais */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">🎯 Metas Semanais</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium">Estudos: {(weeklyStats.estudos.atual/60).toFixed(1)}h / 10h</span>
              <span>{Math.round((weeklyStats.estudos.atual / weeklyStats.estudos.meta) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (weeklyStats.estudos.atual / weeklyStats.estudos.meta) * 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium">Projetos: {(weeklyStats.projetos.atual/60).toFixed(1)}h / 30h</span>
              <span>{Math.round((weeklyStats.projetos.atual / weeklyStats.projetos.meta) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${Math.min(100, (weeklyStats.projetos.atual / weeklyStats.projetos.meta) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráfico de Pareto */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">📊 Análise de Pareto</h2>
        <ParetoChart tasks={tasks} />
      </div>
      
      {/* Lista de Tarefas */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">📝 Lista de Tarefas</h2>
        <TaskList tasks={tasks} />
      </div>
      
      {/* Links para Documentos */}
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">📚 Documentos</h2>
        <ul className="space-y-2">
          <li>
            <a href="/docs/roteiro-estudos.md" className="text-blue-600 hover:underline flex items-center">
              <span className="mr-2">📄</span> Roteiro de Estudos
            </a>
          </li>
          <li>
            <a href="/docs/plano-projetos.md" className="text-blue-600 hover:underline flex items-center">
              <span className="mr-2">📄</span> Plano de Projetos
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Controlador de estado
class StateController {
  setState: React.Dispatch<React.SetStateAction<any>> | null = null;
  
  setMenuOpen(open: boolean) {
    if (this.setState) {
      this.setState((prev: any) => ({ ...prev, menuOpen: open }));
    }
  }

  setCurrentPage(page: string) {
    if (this.setState) {
      this.setState((prev: any) => ({ ...prev, currentPage: page }));
    }
  }

  setTasks(tasks: Task[]) {
    if (this.setState) {
      this.setState((prev: any) => ({ ...prev, tasks }));
    }
  }
}

const stateController = new StateController();

// Página principal
export default function HomePage() {
  const [state, setState] = useState({
    menuOpen: false,
    currentPage: "dashboard",
    tasks: [] as Task[],
  });

  // Vincular o controlador de estado
  useEffect(() => {
    stateController.setState = setState;
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      const data = await readExcelFile();
      stateController.setTasks(data);
    };
    loadData();
  }, []);

  // Renderizar conteúdo com base na página atual
  const renderContent = () => {
    switch (state.currentPage) {
      case "todo":
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">📋 TaskForge - Tarefas</h2>
            <p className="mb-4">CRUD integrado com Flask (simulado)</p>
            <TaskList tasks={state.tasks} />
          </div>
        );
      case "pomodoro":
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">⏱️ TempoMind - Pomodoro</h2>
            <Timer 
              tasks={state.tasks} 
              onTimeAdd={async (taskName, minutes) => {
                const updatedTasks = await addTimeToTask(state.tasks, taskName, minutes);
                stateController.setTasks(updatedTasks);
              }} 
            />
          </div>
        );
      case "calistenia":
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">💪 CalisTrack - Treinos</h2>
            <p>Gerador e controle de treinos em Excel com IA</p>
          </div>
        );
      case "study":
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">🧠 NeoStudy - Estudo</h2>
            <p>PDF Reader, Flashcards e Simulados</p>
          </div>
        );
      case "dashboard":
        return <Dashboard />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {["todo", "pomodoro", "calistenia", "study", "dashboard"].map((page) => (
              <div
                key={page}
                className="p-6 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer border border-gray-200"
                onClick={() => stateController.setCurrentPage(page)}
              >
                <h3 className="text-lg font-semibold capitalize">
                  {navItems.find(item => item.href.slice(1) === page)?.name || page}
                </h3>
                <p className="text-sm text-gray-600">Clique para acessar o app {page}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => stateController.setMenuOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            OmniCore - Sistema de Produtividade
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={state.menuOpen}
        onClose={() => stateController.setMenuOpen(false)}
      >
        <List className="w-64">
          {navItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton
                onClick={() => {
                  stateController.setCurrentPage(item.href.slice(1) || "home");
                  stateController.setMenuOpen(false);
                }}
                className={state.currentPage === item.href.slice(1) ? "bg-blue-100" : ""}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main className="p-4 max-w-6xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}


export  function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Painel de Produtividade</h1>
      <div className="space-x-4">
        <Link href="/dashboard"><button className="btn">Dashboard</button></Link>
        <Link href="/anotacoes"><button className="btn">Anotações</button></Link>
        <Link href="/projetos"><button className="btn">Projetos</button></Link>
      </div>
    </div>
  );
}

// components/Estatisticas.jsx
type EstatisticasProps = {
  dados: {
    xp: Record<string, string | number>;
    ouro: Record<string, string | number>;
    tarefas: Record<string, string | number>;
    criado: Record<string, string | number>;
  };
};

export function Estatisticas({ dados }: EstatisticasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
      <Card titulo="XP" dados={dados.xp} />
      <Card titulo="Ouro" dados={dados.ouro} />
      <Card titulo="Tarefas" dados={dados.tarefas} />
      <Card titulo="Criado" dados={dados.criado} />
    </div>
  );
}

// components/Card.jsx
type CardProps = {
  titulo: string;
  dados: Record<string, string | number>;
};

export function Card({ titulo, dados }: CardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-2">{titulo}</h2>
      <ul className="text-sm space-y-1">
        {Object.entries(dados).map(([chave, valor], i) => (
          <li key={i}><strong>{chave}:</strong> {valor}</li>
        ))}
      </ul>
    </div>
  );
}


export  function DashboardXpPage() {
  const dados = {
    xp: {
      "Total (herdi)": "16,09",
      "Semana passada": "21,92",
      "Média por dia": "3,13",
      "Multiplicador de EXP": "1,01",
    },
    ouro: {
      "Total": "4",
      "Mês Passado": "40",
      "Média por tarefa": "4,44",
    },
    tarefas: {
      "Executado (total)": "zh",
      "Feitas (último mês)": "ZA",
      "Feitas (média por semana)": "ro",
    },
    criado: {
      "Total (habilidades)": "16,15",
      "Mês Passado": "16,09",
      "Média por tarefa": "2,44",
      "Semana passada": "40",
      "Feitas (última semana)": "7",
      "Feitas (média por dia)": "co",
      "Feitas (média por mês)": "co",
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Estatisticas dados={dados} />
    </div>
  );
}