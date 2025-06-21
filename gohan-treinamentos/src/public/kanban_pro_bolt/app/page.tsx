'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Table, FileText, Kanban, Menu, X, Plus, Edit3, Save, Eye, EyeOff, Trash2, GripVertical, Upload, Download, FolderSync as Sync, BarChart3, TrendingUp, Users, Clock, Search, Filter, MoreVertical, FileImage, FileSpreadsheet, File as FilePdf, Play, Pause, RotateCcw, Timer, Maximize2, Minimize2, Image, FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as XLSX from 'xlsx';
import { DataRepository, ProjectItem, FileAttachment, PomodoroSession, CATEGORIES, STATUS_COLUMNS } from '@/lib/repository';

// Functional Components
const Sidebar = ({ currentScreen, setCurrentScreen, sidebarOpen, setSidebarOpen, onExport, onImport, onSync }: {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onExport: () => void;
  onImport: () => void;
  onSync: () => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Kanban Pro</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'kanban', icon: Kanban, label: 'Kanban' },
              { id: 'table', icon: Table, label: 'Tabelas' },
              { id: 'files', icon: FileText, label: 'Arquivos' },
              { id: 'pomodoro', icon: Timer, label: 'Pomodoro' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {setCurrentScreen(id); setSidebarOpen(false);}}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  currentScreen === id 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={onExport}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Download size={20} className="mr-3" />
                Backup Excel
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Upload size={20} className="mr-3" />
                Importar Excel
              </button>
              
              <button
                onClick={onSync}
                className="w-full flex items-center px-4 py-3 text-left rounded-lg text-green-700 hover:bg-green-50 transition-colors"
              >
                <Sync size={20} className="mr-3" />
                Sincronizar
              </button>
            </div>
          </div>
        </nav>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={onImport}
          className="hidden"
        />
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

const FileViewer = ({ file, onDelete, expanded, onToggleExpand }: {
  file: FileAttachment;
  onDelete: (id: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    switch (file.type) {
      case 'pdf': return <FilePdf className="h-8 w-8 text-red-600" />;
      case 'image': return <FileImage className="h-8 w-8 text-blue-600" />;
      case 'excel': return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      default: return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getFileIcon()}
            <div>
              <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadFile();
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <FileDown size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
              }}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md"
            >
              <Trash2 size={16} />
            </button>
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p><strong>Tipo:</strong> {file.type.toUpperCase()}</p>
            <p><strong>Tamanho:</strong> {formatFileSize(file.size)}</p>
            <p><strong>Upload:</strong> {file.uploadedAt.toLocaleString('pt-BR')}</p>
          </div>
          
          {file.type === 'image' && (
            <div className="mt-4">
              <img 
                src={file.url} 
                alt={file.name}
                className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                style={{ maxHeight: '300px' }}
              />
            </div>
          )}
          
          {file.type === 'pdf' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 text-red-700">
                <FilePdf size={20} />
                <span className="font-medium">Documento PDF</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Clique no botão de download para visualizar o arquivo PDF
              </p>
            </div>
          )}
          
          {file.type === 'excel' && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-700">
                <FileSpreadsheet size={20} />
                <span className="font-medium">Planilha Excel</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Clique no botão de download para abrir a planilha
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ChecklistProgress = ({ content }: { content: string }) => {
  const checklistItems = content.match(/- \[[x ]\]/g) || [];
  const completedItems = content.match(/- \[x\]/g) || [];
  
  if (checklistItems.length === 0) return null;
  
  const progress = (completedItems.length / checklistItems.length) * 100;
  
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
        <span>Progresso</span>
        <span>{completedItems.length}/{checklistItems.length}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const PomodoroTimer = ({ 
  isActive, 
  timeLeft, 
  currentSession, 
  onStart, 
  onPause, 
  onReset, 
  onComplete,
  selectedProject,
  onProjectSelect,
  projects
}: {
  isActive: boolean;
  timeLeft: number;
  currentSession: 'work' | 'short-break' | 'long-break';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onComplete: () => void;
  selectedProject: ProjectItem | null;
  onProjectSelect: (project: ProjectItem) => void;
  projects: ProjectItem[];
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = () => {
    switch (currentSession) {
      case 'work': return 25 * 60;
      case 'short-break': return 5 * 60;
      case 'long-break': return 15 * 60;
    }
  };

  const progress = ((getSessionDuration() - timeLeft) / getSessionDuration()) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                currentSession === 'work' ? 'text-blue-600' : 'text-green-600'
              }`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {currentSession.replace('-', ' ')}
              </div>
            </div>
          </div>
        </div>

        {currentSession === 'work' && (
          <div className="mb-4">
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const project = projects.find(p => p.id === e.target.value);
                if (project) onProjectSelect(project);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um projeto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={onStart}
              disabled={currentSession === 'work' && !selectedProject}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Play size={20} className="mr-2" />
              Iniciar
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Pause size={20} className="mr-2" />
              Pausar
            </button>
          )}
          
          <button
            onClick={onReset}
            className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [repository] = useState(() => DataRepository.getInstance());
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  
  // Editor states
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<keyof typeof CATEGORIES>('ons');
  const [showPreview, setShowPreview] = useState(true);
  
  // Drag and drop
  const [draggedItem, setDraggedItem] = useState<ProjectItem | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // File management
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  
  // Pomodoro states
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60);
  const [pomodoroSession, setPomodoroSession] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const pomodoroIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load data on mount
  useEffect(() => {
    setProjects(repository.getProjects());
    setFiles(repository.getFiles());
    setPomodoroSessions(repository.getPomodoroSessions());
  }, [repository]);

  // Pomodoro timer effect
  useEffect(() => {
    if (pomodoroActive && pomodoroTimeLeft > 0) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroTimeLeft(prev => {
          if (prev <= 1) {
            setPomodoroActive(false);
            handlePomodoroComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    }

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    };
  }, [pomodoroActive, pomodoroTimeLeft]);

  const handlePomodoroComplete = () => {
    if (pomodoroSession === 'work' && selectedProject) {
      const session: PomodoroSession = {
        id: Date.now().toString(),
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        category: selectedProject.category || 'ons',
        type: pomodoroSession,
        duration: 25,
        completedAt: new Date(),
        date: new Date().toISOString().split('T')[0]
      };
      
      repository.addPomodoroSession(session);
      setPomodoroSessions(repository.getPomodoroSessions());
    }
    
    // Auto switch to break
    if (pomodoroSession === 'work') {
      setPomodoroSession('short-break');
      setPomodoroTimeLeft(5 * 60);
    } else {
      setPomodoroSession('work');
      setPomodoroTimeLeft(25 * 60);
    }
    
    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Concluído!', {
        body: pomodoroSession === 'work' ? 'Hora do intervalo!' : 'Hora de trabalhar!',
        icon: '/favicon.ico'
      });
    }
  };

  const startPomodoro = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setPomodoroActive(true);
  };

  const pausePomodoro = () => {
    setPomodoroActive(false);
  };

  const resetPomodoro = () => {
    setPomodoroActive(false);
    const duration = pomodoroSession === 'work' ? 25 * 60 : pomodoroSession === 'short-break' ? 5 * 60 : 15 * 60;
    setPomodoroTimeLeft(duration);
  };

  const startPomodoroForProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setPomodoroSession('work');
    setPomodoroTimeLeft(25 * 60);
    setCurrentScreen('pomodoro');
  };

  // CRUD operations
  const handleDragStart = (e: React.DragEvent, item: ProjectItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    repository.updateProject(draggedItem.id, { status: newStatus });
    setProjects(repository.getProjects());
    setDraggedItem(null);
  };

  const openItemEditor = (item: ProjectItem) => {
    setEditingItem(item);
    setEditContent(item.content || '');
    setEditTitle(item.title);
    setEditCategory((item.category as keyof typeof CATEGORIES) || 'ons');
    setIsEditing(true);
  };

  const saveItem = () => {
    if (!editingItem) return;

    repository.updateProject(editingItem.id, {
      title: editTitle,
      content: editContent,
      category: editCategory
    });

    setProjects(repository.getProjects());
    setIsEditing(false);
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    repository.deleteProject(itemId);
    setProjects(repository.getProjects());
    setFiles(repository.getFiles());
    setIsEditing(false);
    setEditingItem(null);
  };

  const createNewItem = (status: string) => {
    const newItem: ProjectItem = {
      id: Date.now().toString(),
      title: 'Novo Item',
      status,
      category: 'ons',
      content: '# Novo Item\n\n## Tarefas\n- [ ] Tarefa 1\n- [ ] Tarefa 2\n- [ ] Tarefa 3\n\nDescreva aqui o conteúdo...',
      createdAt: new Date(),
      updatedAt: new Date(),
      files: []
    };

    repository.addProject(newItem);
    setProjects(repository.getProjects());
    openItemEditor(newItem);
  };

  // File operations
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image' | 'excel', projectId?: string) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: FileAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type,
          url: e.target?.result as string,
          size: file.size,
          projectId,
          uploadedAt: new Date()
        };
        
        repository.addFile(newFile);
        setFiles(repository.getFiles());
        
        if (projectId) {
          alert(`Arquivo ${file.name} adicionado ao projeto!`);
        }
      };
      
      if (type === 'image') {
        reader.readAsDataURL(file);
      } else {
        reader.readAsDataURL(file); // For demo purposes, we'll use data URL for all types
      }
    });
  };

  const deleteFile = (fileId: string) => {
    repository.deleteFile(fileId);
    setFiles(repository.getFiles());
  };

  const toggleFileExpansion = (fileId: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(fileId)) {
      newExpanded.delete(fileId);
    } else {
      newExpanded.add(fileId);
    }
    setExpandedFiles(newExpanded);
  };

  // Excel operations
  const exportToExcel = () => {
    const { projectsData, pomodoroData, filesData } = repository.exportToExcel();
    
    const wb = XLSX.utils.book_new();
    
    const wsProjects = XLSX.utils.json_to_sheet(projectsData);
    const wsPomodoro = XLSX.utils.json_to_sheet(pomodoroData);
    const wsFiles = XLSX.utils.json_to_sheet(filesData);
    
    XLSX.utils.book_append_sheet(wb, wsProjects, 'Projetos');
    XLSX.utils.book_append_sheet(wb, wsPomodoro, 'Pomodoro');
    XLSX.utils.book_append_sheet(wb, wsFiles, 'Arquivos');
    
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `kanban-backup-${date}.xlsx`);
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.includes('Projetos')) {
          const worksheet = workbook.Sheets['Projetos'];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          repository.importFromExcel(jsonData);
          setProjects(repository.getProjects());
        }
        
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar arquivo Excel');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const syncData = () => {
    repository.saveToStorage();
    alert('Dados sincronizados com sucesso!');
  };

  // Filter functions
  const getFilteredProjects = () => {
    let filtered = projects;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    return filtered;
  };

  // Screen Components
  const DashboardScreen = () => {
    const statusStats = repository.getStatusStats();
    const categoryStats = repository.getCategoryStats();
    const pomodoroStats = repository.getPomodoroStats();
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'concluido').length;
    const progressRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral dos seus projetos e atividades</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Projetos</p>
                <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Progresso</p>
                <p className="text-2xl font-bold text-gray-900">{statusStats['in progress'] || 0}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pomodoros Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{pomodoroStats.today}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Timer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Projetos</h3>
            <div className="space-y-3">
              {Object.entries(STATUS_COLUMNS).map(([status, info]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{info.emoji}</span>
                    <span className="text-sm text-gray-600">{info.title}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${totalProjects > 0 ? (statusStats[status] / totalProjects) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{statusStats[status] || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
            <div className="space-y-3">
              {Object.entries(CATEGORIES).map(([category, info]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{info.emoji}</span>
                    <span className="text-sm text-gray-600">{info.label}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${totalProjects > 0 ? (categoryStats[category] / totalProjects) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{categoryStats[category] || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Projetos Recentes</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => {
              const categoryInfo = CATEGORIES[project.category as keyof typeof CATEGORIES] || CATEGORIES.ons;
              const projectFiles = repository.getFilesByProject(project.id);
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{categoryInfo.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Atualizado em {project.updatedAt.toLocaleDateString('pt-BR')}</span>
                        {projectFiles.length > 0 && (
                          <span className="flex items-center">
                            <FileText size={12} className="mr-1" />
                            {projectFiles.length} arquivo{projectFiles.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                      {project.status}
                    </div>
                    <button
                      onClick={() => startPomodoroForProject(project)}
                      className="p-1 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      title="Iniciar Pomodoro"
                    >
                      <Timer size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const KanbanScreen = () => {
    const columns = Object.entries(STATUS_COLUMNS).map(([status, info]) => ({
      ...info,
      status,
      items: repository.getProjectsByStatus(status)
    }));

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
          <p className="text-gray-600">Organize seus projetos visualmente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column.status}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-80 md:min-w-0"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{column.emoji}</span>
                  <h2 className="font-semibold text-gray-900 text-sm">{column.title}</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {column.items.length}
                  </span>
                </div>
                <button
                  onClick={() => createNewItem(column.status)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {column.items.map((item) => {
                  const categoryInfo = CATEGORIES[item.category as keyof typeof CATEGORIES] || CATEGORIES.ons;
                  const projectFiles = repository.getFilesByProject(item.id);
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => openItemEditor(item)}
                      className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:shadow-md border border-gray-100 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                          <span>{categoryInfo.emoji}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startPomodoroForProject(item);
                            }}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Iniciar Pomodoro"
                          >
                            <Timer size={12} />
                          </button>
                          <GripVertical 
                            size={14} 
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" 
                          />
                        </div>
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {(item.content || '').replace(/[#*`\[\]]/g, '').substring(0, 80)}...
                      </p>
                      
                      {item.content && <ChecklistProgress content={item.content} />}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <div className="flex items-center space-x-2">
                          <span>{item.updatedAt.toLocaleDateString('pt-BR')}</span>
                          {projectFiles.length > 0 && (
                            <span className="flex items-center">
                              <FileText size={10} className="mr-1" />
                              {projectFiles.length}
                            </span>
                          )}
                        </div>
                        <Edit3 size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TableScreen = () => {
    const filteredProjects = getFilteredProjects();

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Tabela de Projetos</h1>
          <p className="text-gray-600">Visualize todos os seus projetos em formato de tabela</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as categorias</option>
                {Object.entries(CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.emoji} {value.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progresso</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arquivos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const categoryInfo = CATEGORIES[project.category as keyof typeof CATEGORIES] || CATEGORIES.ons;
                  const statusInfo = STATUS_COLUMNS[project.status as keyof typeof STATUS_COLUMNS];
                  const projectFiles = repository.getFilesByProject(project.id);
                  
                  // Calculate checklist progress
                  const checklistItems = (project.content || '').match(/- \[[x ]\]/g) || [];
                  const completedItems = (project.content || '').match(/- \[x\]/g) || [];
                  const progress = checklistItems.length > 0 ? (completedItems.length / checklistItems.length) * 100 : 0;
                  
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500">ID: {project.id}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{statusInfo?.emoji}</span>
                          <span className="text-sm text-gray-900">{statusInfo?.title || project.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                          <span className="mr-1">{categoryInfo.emoji}</span>
                          {categoryInfo.label}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {checklistItems.length > 0 ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {completedItems.length}/{checklistItems.length}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Sem tarefas</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-1">
                          <FileText size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{projectFiles.length}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {project.updatedAt.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startPomodoroForProject(project)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                            title="Iniciar Pomodoro"
                          >
                            <Timer size={16} />
                          </button>
                          <button
                            onClick={() => openItemEditor(project)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(project.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const FilesScreen = () => {
    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gerenciador de Arquivos</h1>
          <p className="text-gray-600">Upload e gerenciamento de PDFs, imagens e planilhas Excel</p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { type: 'pdf' as const, icon: FilePdf, color: 'red', label: 'PDF' },
            { type: 'image' as const, icon: FileImage, color: 'blue', label: 'Imagem' },
            { type: 'excel' as const, icon: FileSpreadsheet, color: 'green', label: 'Excel' }
          ].map(({ type, icon: Icon, color, label }) => (
            <div key={type} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
              <div className={`p-4 bg-${color}-100 rounded-lg inline-block mb-4`}>
                <Icon className={`h-8 w-8 text-${color}-600`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload {label}</h3>
              <p className="text-sm text-gray-600 mb-4">Faça upload de {label.toLowerCase()}s</p>
              <input
                type="file"
                accept={type === 'pdf' ? '.pdf' : type === 'image' ? 'image/*' : '.xlsx,.xls'}
                onChange={(e) => handleFileUpload(e, type)}
                className="hidden"
                id={`${type}-upload`}
                multiple
              />
              <label
                htmlFor={`${type}-upload`}
                className={`inline-flex items-center px-4 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 cursor-pointer transition-colors`}
              >
                <Upload size={16} className="mr-2" />
                Selecionar {label}
              </label>
            </div>
          ))}
        </div>

        {/* Files List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Arquivos Carregados</h3>
          
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Nenhum arquivo carregado ainda</p>
              <p className="text-sm">Use os botões acima para fazer upload de arquivos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <FileViewer
                  key={file.id}
                  file={file}
                  onDelete={deleteFile}
                  expanded={expandedFiles.has(file.id)}
                  onToggleExpand={() => toggleFileExpansion(file.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Markdown Editor for Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Editor de Links e Referências</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Editor Markdown
              </label>
              <textarea
                placeholder="Cole aqui seus links e referências em formato Markdown..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                defaultValue={`# Links e Referências

## Documentos PDF
- [Relatório Técnico ONS](link-para-pdf)
- [Manual de Procedimentos](link-para-pdf)

## Imagens
![Diagrama do Sistema](link-para-imagem)

## Planilhas Excel
- [Dados de Análise](link-para-excel)
- [Cronograma do Projeto](link-para-excel)

## Checklists
- [ ] Tarefa pendente
- [x] Tarefa concluída
- [ ] Outra tarefa

## Links Externos
- [Documentação Oficial](https://exemplo.com)
- [Tutorial Completo](https://exemplo.com/tutorial)`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="h-64 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {`# Links e Referências

## Documentos PDF
- [Relatório Técnico ONS](link-para-pdf)
- [Manual de Procedimentos](link-para-pdf)

## Imagens
![Diagrama do Sistema](link-para-imagem)

## Planilhas Excel
- [Dados de Análise](link-para-excel)
- [Cronograma do Projeto](link-para-excel)

## Checklists
- [ ] Tarefa pendente
- [x] Tarefa concluída
- [ ] Outra tarefa

## Links Externos
- [Documentação Oficial](https://exemplo.com)
- [Tutorial Completo](https://exemplo.com/tutorial)`}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PomodoroScreen = () => {
    const pomodoroStats = repository.getPomodoroStats();
    const todaySessions = repository.getPomodoroSessionsByDate(new Date().toISOString().split('T')[0]);

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Pomodoro Timer</h1>
          <p className="text-gray-600">Gerencie seu tempo e produtividade</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer */}
          <div className="lg:col-span-2">
            <PomodoroTimer
              isActive={pomodoroActive}
              timeLeft={pomodoroTimeLeft}
              currentSession={pomodoroSession}
              onStart={startPomodoro}
              onPause={pausePomodoro}
              onReset={resetPomodoro}
              onComplete={handlePomodoroComplete}
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
              projects={projects}
            />
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hoje</span>
                  <span className="text-lg font-bold text-blue-600">{pomodoroStats.today}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Esta semana</span>
                  <span className="text-lg font-bold text-green-600">{pomodoroStats.week}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-lg font-bold text-purple-600">{pomodoroStats.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessões de Hoje</h3>
              {todaySessions.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma sessão hoje</p>
              ) : (
                <div className="space-y-2">
                  {todaySessions.slice(-5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.projectTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.completedAt.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      <div className="text-xs text-gray-600">
                        {session.duration}min
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'kanban':
        return <KanbanScreen />;
      case 'table':
        return <TableScreen />;
      case 'files':
        return <FilesScreen />;
      case 'pomodoro':
        return <PomodoroScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onExport={exportToExcel}
        onImport={importFromExcel}
        onSync={syncData}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Kanban Pro</h1>
            {pomodoroActive && (
              <div className="flex items-center text-sm text-purple-600">
                <Timer size={16} className="mr-1" />
                {Math.floor(pomodoroTimeLeft / 60)}:{(pomodoroTimeLeft % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </div>

        {/* Screen Content */}
        <main className="flex-1 overflow-auto">
          {renderCurrentScreen()}
        </main>
      </div>

      {/* Item Editor Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Editar Item</h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".pdf,image/*,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(e, 'image', editingItem.id)}
                  className="hidden"
                  id="project-file-upload"
                  multiple
                />
                <label
                  htmlFor="project-file-upload"
                  className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Anexar</span>
                </label>
                <button
                  onClick={() => deleteItem(editingItem.id)}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                  <span className="hidden sm:inline">Excluir</span>
                </button>
                <button
                  onClick={saveItem}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">Salvar</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden">
              {/* Title and Category */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                  placeholder="Título do item..."
                />
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as keyof typeof CATEGORIES)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(CATEGORIES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.emoji} {value.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Files */}
              {editingItem && repository.getFilesByProject(editingItem.id).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Arquivos do Projeto</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {repository.getFilesByProject(editingItem.id).map((file) => (
                      <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                        <div className="mr-2">
                          {file.type === 'pdf' && <FilePdf size={16} className="text-red-600" />}
                          {file.type === 'image' && <FileImage size={16} className="text-blue-600" />}
                          {file.type === 'excel' && <FileSpreadsheet size={16} className="text-green-600" />}
                        </div>
                        <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="ml-2 text-red-400 hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editor and Preview */}
              <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-4 h-full`}>
                {/* Editor */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Editor</h3>
                    <span className="text-xs text-gray-500">Markdown suportado</span>
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                    placeholder="Escreva seu conteúdo em Markdown...

Exemplo de checklist:
- [ ] Tarefa pendente
- [ ] Outra tarefa
- [x] Tarefa concluída
"
                  />
                </div>

                {/* Preview */}
                {showPreview && (
                  <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                    </div>
                    <div className="flex-1 p-4 border border-gray-200 rounded-md bg-gray-50 overflow-y-auto">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {editContent || 'Nada para mostrar...'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
