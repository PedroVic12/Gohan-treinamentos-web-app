'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Table, FileText, Kanban, Menu, X, Plus, Edit3, Save, Eye, EyeOff, Trash2, GripVertical, Upload, Download, FolderSync as Sync, BarChart3, TrendingUp, Users, Clock, Search, Filter, MoreVertical, FileImage, FileSpreadsheet, File as FilePdf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as XLSX from 'xlsx';

interface ProjectItem {
  id: string;
  title: string;
  status: string;
  content?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  files?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'excel';
  url: string;
  size: number;
}

interface Column {
  id: string;
  title: string;
  emoji: string;
  items: ProjectItem[];
}

const CATEGORIES = {
  'ons': { emoji: '📂', label: 'Relatórios Técnicos ONS', color: 'bg-blue-100 text-blue-800' },
  'uff': { emoji: '🧪', label: 'Estudos UFF', color: 'bg-purple-100 text-purple-800' },
  'python': { emoji: '⚙️', label: 'Projetos Python', color: 'bg-green-100 text-green-800' },
  'web': { emoji: '🚀', label: 'MVP de Aplicações Web', color: 'bg-orange-100 text-orange-800' },
  'spiritual': { emoji: '🧘‍♂️', label: 'Alinhamento Espiritual', color: 'bg-pink-100 text-pink-800' }
};

const STATUS_COLUMNS = {
  'to do': { id: 'todo', title: 'Em Rascunho', emoji: '✏️' },
  'in progress': { id: 'progress', title: 'Em Análise', emoji: '🔍' },
  'projetos parados': { id: 'paused', title: 'Projetos Parados', emoji: '⏸️' },
  'agentes (c3po, jarvis)': { id: 'agents', title: 'Agentes IA', emoji: '🤖' },
  'uff - 2025': { id: 'uff2025', title: 'UFF 2025', emoji: '🎓' }
};

const INITIAL_DATA: ProjectItem[] = [
  {
    id: '868d3j5vf',
    title: 'Minicurso Circuitos Eletricos CC',
    status: 'to do',
    category: 'uff',
    content: '# Minicurso Circuitos Elétricos CC\n\n## Objetivos\n- Fundamentos de circuitos CC\n- Análise nodal e de malhas\n- Teoremas de circuitos\n\n## Cronograma\n- [ ] Preparar material teórico\n- [ ] Criar exercícios práticos\n- [ ] Desenvolver simulações',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    files: []
  },
  {
    id: '868d3j6h0',
    title: '3 Landing Pages Templates (Google Analytics, SEO, Maps, parallax, AstroJS, treejs, boltnew)',
    status: 'projetos parados',
    category: 'web',
    content: '# Landing Pages Templates\n\n## Tecnologias\n- AstroJS\n- Three.js\n- Google Analytics\n- SEO otimizado\n\n## Features\n- Parallax scrolling\n- Mapas integrados\n- Animações 3D\n- Performance otimizada',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    files: []
  },
  {
    id: '868d3j6p1',
    title: '3 Modelos de IA (ML) - Dashboard Template Streamlit',
    status: 'agentes (c3po, jarvis)',
    category: 'python',
    content: '# Dashboard IA com Streamlit\n\n## Modelos\n1. Previsão de vendas\n2. Análise de sentimentos\n3. Classificação de imagens\n\n## Stack\n- Python\n- Streamlit\n- Scikit-learn\n- Pandas\n- Plotly',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    files: []
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_DATA);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<keyof typeof CATEGORIES>('ons');
  const [showPreview, setShowPreview] = useState(true);
  const [draggedItem, setDraggedItem] = useState<ProjectItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('kanban-projects');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const processedProjects = parsed.map((item: ProjectItem) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
      setProjects(processedProjects);
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('kanban-projects', JSON.stringify(projects));
  }, [projects]);

  const exportToExcel = () => {
    const exportData = projects.map(item => ({
      'Título': item.title,
      'Status': item.status,
      'ID': item.id,
      'Categoria': item.category || '',
      'Criado em': item.createdAt.toLocaleDateString('pt-BR'),
      'Atualizado em': item.updatedAt.toLocaleDateString('pt-BR'),
      'Conteúdo': item.content || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Projetos');
    XLSX.writeFile(wb, 'kanban-backup.xlsx');
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedProjects: ProjectItem[] = jsonData.map((row: any) => ({
          id: row['ID'] || Date.now().toString(),
          title: row['Título'] || 'Sem título',
          status: row['Status'] || 'to do',
          category: row['Categoria'] || 'ons',
          content: row['Conteúdo'] || '',
          createdAt: new Date(row['Criado em'] || Date.now()),
          updatedAt: new Date(row['Atualizado em'] || Date.now()),
          files: []
        }));

        setProjects(importedProjects);
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar arquivo Excel');
      }
    };
    reader.readAsArrayBuffer(file);
  };

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

    setProjects(prev => prev.map(item => 
      item.id === draggedItem.id 
        ? { ...item, status: newStatus, updatedAt: new Date() }
        : item
    ));

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

    setProjects(prev => prev.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            title: editTitle,
            content: editContent,
            category: editCategory,
            updatedAt: new Date()
          }
        : item
    ));

    setIsEditing(false);
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    setProjects(prev => prev.filter(item => item.id !== itemId));
    setIsEditing(false);
    setEditingItem(null);
  };

  const createNewItem = (status: string) => {
    const newItem: ProjectItem = {
      id: Date.now().toString(),
      title: 'Novo Item',
      status,
      category: 'ons',
      content: '# Novo Item\n\nDescreva aqui o conteúdo...',
      createdAt: new Date(),
      updatedAt: new Date(),
      files: []
    };

    setProjects(prev => [...prev, newItem]);
    openItemEditor(newItem);
  };

  const getProjectsByStatus = (status: string) => {
    return projects.filter(item => item.status === status);
  };

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

  const getStatusStats = () => {
    const stats = Object.keys(STATUS_COLUMNS).reduce((acc, status) => {
      acc[status] = projects.filter(item => item.status === status).length;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  const getCategoryStats = () => {
    const stats = Object.keys(CATEGORIES).reduce((acc, category) => {
      acc[category] = projects.filter(item => item.category === category).length;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  const Sidebar = () => (
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
          <button
            onClick={() => {setCurrentScreen('dashboard'); setSidebarOpen(false);}}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              currentScreen === 'dashboard' 
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard size={20} className="mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => {setCurrentScreen('kanban'); setSidebarOpen(false);}}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              currentScreen === 'kanban' 
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Kanban size={20} className="mr-3" />
            Kanban
          </button>
          
          <button
            onClick={() => {setCurrentScreen('table'); setSidebarOpen(false);}}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              currentScreen === 'table' 
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Table size={20} className="mr-3" />
            Tabelas
          </button>
          
          <button
            onClick={() => {setCurrentScreen('files'); setSidebarOpen(false);}}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              currentScreen === 'files' 
                ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText size={20} className="mr-3" />
            Arquivos
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={exportToExcel}
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
              onClick={() => {
                localStorage.setItem('kanban-projects', JSON.stringify(projects));
                alert('Dados sincronizados!');
              }}
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
        onChange={importFromExcel}
        className="hidden"
      />
    </div>
  );


// teste de IDE nova



  const DashboardScreen = () => {
    const statusStats = getStatusStats();
    const categoryStats = getCategoryStats();
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'agentes (c3po, jarvis)').length;
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
                <p className="text-sm font-medium text-gray-600">Finalizados</p>
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
                <p className="text-sm font-medium text-gray-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-gray-900">{progressRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
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
              return (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{categoryInfo.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <p className="text-sm text-gray-500">Atualizado em {project.updatedAt.toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                    {project.status}
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
      items: getProjectsByStatus(status)
    }));

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
          <p className="text-gray-600">Organize seus projetos visualmente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
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
                        <GripVertical 
                          size={14} 
                          className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move" 
                        />
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {(item.content || '').replace(/[#*`]/g, '').substring(0, 80)}...
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.updatedAt.toLocaleDateString('pt-BR')}</span>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  const categoryInfo = CATEGORIES[project.category as keyof typeof CATEGORIES] || CATEGORIES.ons;
                  const statusInfo = STATUS_COLUMNS[project.status as keyof typeof STATUS_COLUMNS];
                  
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
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {project.updatedAt.toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
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
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image' | 'excel') => {
      const files = event.target.files;
      if (!files) return;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile: FileAttachment = {
            id: Date.now().toString(),
            name: file.name,
            type,
            url: e.target?.result as string,
            size: file.size
          };
          
          // For demo purposes, we'll just show an alert
          alert(`Arquivo ${file.name} carregado com sucesso!`);
        };
        
        if (type === 'image') {
          reader.readAsDataURL(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      });
    };

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Gerenciador de Arquivos</h1>
          <p className="text-gray-600">Upload e gerenciamento de PDFs, imagens e planilhas Excel</p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="p-4 bg-red-100 rounded-lg inline-block mb-4">
              <FilePdf className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload PDF</h3>
            <p className="text-sm text-gray-600 mb-4">Faça upload de documentos PDF</p>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'pdf')}
              className="hidden"
              id="pdf-upload"
            />
            <label
              htmlFor="pdf-upload"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
            >
              <Upload size={16} className="mr-2" />
              Selecionar PDF
            </label>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="p-4 bg-blue-100 rounded-lg inline-block mb-4">
              <FileImage className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Imagem</h3>
            <p className="text-sm text-gray-600 mb-4">Faça upload de imagens</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'image')}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Upload size={16} className="mr-2" />
              Selecionar Imagem
            </label>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="p-4 bg-green-100 rounded-lg inline-block mb-4">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Excel</h3>
            <p className="text-sm text-gray-600 mb-4">Faça upload de planilhas Excel</p>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileUpload(e, 'excel')}
              className="hidden"
              id="excel-upload"
            />
            <label
              htmlFor="excel-upload"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
            >
              <Upload size={16} className="mr-2" />
              Selecionar Excel
            </label>
          </div>
        </div>

        {/* Markdown Editor for Links */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
            <div className="w-10" /> {/* Spacer */}
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
                    placeholder="Escreva seu conteúdo em Markdown..."
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