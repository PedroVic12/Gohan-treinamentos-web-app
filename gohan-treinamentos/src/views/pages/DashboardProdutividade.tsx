import { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";

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

// Componente Timer
function Timer({ tasks, onTimeAdd }: { tasks: Task[]; onTimeAdd: (taskName: string, minutes: number) => void }) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [selectedTask, setSelectedTask] = useState("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
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
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
            >
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
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

// Funções para manipulação de dados (simuladas)
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

// Componente principal
export default function DashboardProdutividadePage() {
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 Dashboard de Produtividade</h1>
          <p className="text-gray-600 mt-2">
            Monitoramento de tarefas, tempo investido e metas de produtividade
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Pomodoro */}
          <div className="lg:col-span-1">
            <Timer tasks={tasks} onTimeAdd={handleTimeAdd} />
          </div>
          
          {/* Metas Semanais */}
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-lg shadow h-full">
              <h2 className="text-xl font-bold mb-4">🎯 Metas Semanais</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Estudos: {(weeklyStats.estudos.atual/60).toFixed(1)}h / 10h</span>
                    <span>{Math.round((weeklyStats.estudos.atual / weeklyStats.estudos.meta) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${Math.min(100, (weeklyStats.estudos.atual / weeklyStats.estudos.meta) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Projetos: {(weeklyStats.projetos.atual/60).toFixed(1)}h / 30h</span>
                    <span>{Math.round((weeklyStats.projetos.atual / weeklyStats.projetos.meta) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-500 ease-in-out" 
                      style={{ width: `${Math.min(100, (weeklyStats.projetos.atual / weeklyStats.projetos.meta) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gráfico de Pareto */}
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">📊 Análise de Pareto</h2>
              <ParetoChart tasks={tasks} />
            </div>
          </div>
          
          {/* Lista de Tarefas */}
          <div className="lg:col-span-1">
            <div className="p-4 bg-white rounded-lg shadow h-full">
              <h2 className="text-xl font-bold mb-4">📝 Lista de Tarefas</h2>
              <TaskList tasks={tasks} />
            </div>
          </div>
          
          {/* Links para Documentos */}
          <div className="lg:col-span-3">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">📚 Documentos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Roteiro de Estudos</h3>
                      <p className="text-sm text-gray-600 mt-1">Planejamento semanal de estudos</p>
                    </div>
                  </div>
                </a>
                
                <a href="#" className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Plano de Projetos</h3>
                      <p className="text-sm text-gray-600 mt-1">Cronograma de projetos em andamento</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}