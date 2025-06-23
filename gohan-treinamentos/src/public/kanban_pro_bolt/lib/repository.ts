export interface ProjectItem {
  id: string;
  title: string;
  status: string;
  content?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  files?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'excel';
  url: string;
  size: number;
  projectId?: string;
  uploadedAt: Date;
}

export interface PomodoroSession {
  id: string;
  projectId: string;
  projectTitle: string;
  category: string;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completedAt: Date;
  date: string;
}

export const CATEGORIES = {
  'uff': { emoji: '🧪', label: 'Estudos UFF', color: 'bg-purple-100 text-purple-800' },
  'python': { emoji: '⚙️', label: 'Projetos Python - Automação, Web, Dados, IA, Eng Eletrica', color: 'bg-green-100 text-green-800' },
  'web': { emoji: '🚀', label: 'MVP de Aplicações Web (NextJS, Flutter, Flask/FastAPI templates)', color: 'bg-orange-100 text-orange-800' },
  'spiritual': { emoji: '🧘‍♂️', label: 'Alinhamento Espiritual e Diário', color: 'bg-pink-100 text-pink-800' },
  'ons-estagio': { emoji: '🏢', label: 'ONS - Estágio 2025', color: 'bg-indigo-100 text-indigo-800' }
};

export const STATUS_COLUMNS = {

  'uff - 2025': { id: 'uff2025', title: 'UFF 2025', emoji: '🎓' },
  'ons - estagio': { id: 'ons-internship', title: 'ONS - Estágio', emoji: '🏢' },
  'agentes (c3po, jarvis)': { id: 'agents', title: 'Agentes IA', emoji: '🤖' },

  'projetos parados': { id: 'paused', title: 'Projetos Parados', emoji: '⏸️' },
  'to do': { id: 'todo', title: 'TODO', emoji: '✏️' },
  'in progress': { id: 'progress', title: 'IN PROGRESS', emoji: '🔍' },




  'concluido': { id: 'completed', title: 'CONCLUIDO', emoji: '✅' },
};

export const INITIAL_DATA: ProjectItem[] = [
  {
    id: '868d3j5vf',
    title: 'Estudos Sinais e Sistemas, Eletromagnetismo 1 e 2, Circuitos Eletricos CC, Circuitos Digitais, Linguagem de programção, Sistemas de Potencia ONS',
    status: 'to do',
    category: 'uff',
    content: '# Minicurso Circuitos Elétricos CC\n\n## Objetivos\n- [ ] Fundamentos de circuitos CC\n- [ ] Análise nodal e de malhas\n- [x] Teoremas de circuitos\n\n## Cronograma\n- [ ] Preparar material teórico\n- [ ] Criar exercícios práticos\n- [ ] Desenvolver simulações',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    files: []
  },
  {
    id: '868d3j6h0',
    title: '3 Landing Pages Templates (Google Analytics, SEO, Maps, parallax, AstroJS, treejs, boltnew)',
    status: 'projetos parados',
    category: 'web',
    content: '# Landing Pages Templates\n\n## Tecnologias\n- [ ] AstroJS\n- [x] Three.js\n- [ ] Google Analytics\n- [x] SEO otimizado\n\n## Features\n- [x] Parallax scrolling\n- [ ] Mapas integrados\n- [ ] Animações 3D\n- [x] Performance otimizada',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    files: []
  },
  {
    id: '868d3j6p1',
    title: '3 Modelos de IA (ML) - Dashboard Template Streamlit',
    status: 'agentes (c3po, jarvis)',
    category: 'python',
    content: '# Dashboard IA com Streamlit\n\n## Modelos\n- [x] Previsão de vendas\n- [x] Análise de sentimentos\n- [ ] Classificação de imagens\n\n## Stack\n- [x] Python\n- [x] Streamlit\n- [x] Scikit-learn\n- [x] Pandas\n- [ ] Plotly',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    files: []
  },
  {
    id: '868d3j70h',
    title: 'Backend Developer - Python (FastAPI + DJANGO + NODEJS API RESTFULL)',
    status: 'projetos parados',
    category: 'python',
    content: '# Backend Development Stack\n\n## APIs\n- [ ] Flask/FastAPI setup\n- [ ] Django REST framework \n- [ ] Dart Vaden framework - Fullstack Flutter\n- [ ] Node.js Express NextJS\n\n## Features\n- [ ] Authentication\n- [ ] Database integration\n- [ ] API documentation',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
    files: []
  },
  {
    id: '868d3j76y',
    title: 'FrontEnd Developer - React + javascript + Flutter',
    status: 'in progress',
    category: 'web',
    content: '# Frontend Development\n\n## Technologies\n- [x] React.js\n- [ ] Nextjs \n- [ ] Flutter\n\n## Projects\n- [x] Mobile app template\n- [x] Dashboard interface\n- [x] Kyogre PDV app \n- [x] Todo List 3 CURD APPs \n- [ ] Controle de Estoque APPsss',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
    files: []
  }
];

export class DataRepository {
  private static instance: DataRepository;
  private projects: ProjectItem[] = [];
  private files: FileAttachment[] = [];
  private pomodoroSessions: PomodoroSession[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): DataRepository {
    if (!DataRepository.instance) {
      DataRepository.instance = new DataRepository();
    }
    return DataRepository.instance;
  }

  // Projects CRUD
  getProjects(): ProjectItem[] {
    return this.projects;
  }

  getProjectById(id: string): ProjectItem | undefined {
    return this.projects.find(p => p.id === id);
  }

  addProject(project: ProjectItem): void {
    this.projects.push(project);
    this.saveToStorage();
  }

  updateProject(id: string, updates: Partial<ProjectItem>): void {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates, updatedAt: new Date() };
      this.saveToStorage();
    }
  }

  deleteProject(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.files = this.files.filter(f => f.projectId !== id);
    this.pomodoroSessions = this.pomodoroSessions.filter(s => s.projectId !== id);
    this.saveToStorage();
  }

  getProjectsByStatus(status: string): ProjectItem[] {
    return this.projects.filter(p => p.status === status);
  }

  // Files CRUD
  getFiles(): FileAttachment[] {
    return this.files;
  }

  getFilesByProject(projectId: string): FileAttachment[] {
    return this.files.filter(f => f.projectId === projectId);
  }

  addFile(file: FileAttachment): void {
    this.files.push(file);
    this.saveToStorage();
  }

  deleteFile(id: string): void {
    this.files = this.files.filter(f => f.id !== id);
    this.saveToStorage();
  }

  // Pomodoro CRUD
  getPomodoroSessions(): PomodoroSession[] {
    return this.pomodoroSessions;
  }

  addPomodoroSession(session: PomodoroSession): void {
    this.pomodoroSessions.push(session);
    this.saveToStorage();
  }

  getPomodoroSessionsByDate(date: string): PomodoroSession[] {
    return this.pomodoroSessions.filter(s => s.date === date);
  }

  getPomodoroSessionsByCategory(category: string): PomodoroSession[] {
    return this.pomodoroSessions.filter(s => s.category === category);
  }

  // Storage methods
  private loadFromStorage(): void {

      if (typeof window === 'undefined') {
        // SSR: não faz nada, evita erro
        this.projects = INITIAL_DATA;
        return;
      }

    try {
      const projectsData = localStorage.getItem('kanban-projects');
      const filesData = localStorage.getItem('kanban-files');
      const pomodoroData = localStorage.getItem('kanban-pomodoro');

      if (projectsData) {
        const parsed = JSON.parse(projectsData);
        this.projects = parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }));
      } else {
        this.projects = INITIAL_DATA;
      }

      if (filesData) {
        const parsed = JSON.parse(filesData);
        this.files = parsed.map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        }));
      }

      if (pomodoroData) {
        const parsed = JSON.parse(pomodoroData);
        this.pomodoroSessions = parsed.map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt)
        }));
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.projects = INITIAL_DATA;
    }
  }

  saveToStorage(): void {
    try {
      localStorage.setItem('kanban-projects', JSON.stringify(this.projects));
      localStorage.setItem('kanban-files', JSON.stringify(this.files));
      localStorage.setItem('kanban-pomodoro', JSON.stringify(this.pomodoroSessions));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Excel export/import
  exportToExcel(): any {
    const projectsData = this.projects.map(item => ({
      'Título': item.title,
      'Status': item.status,
      'ID': item.id,
      'Categoria': item.category || '',
      'Criado em': item.createdAt.toLocaleDateString('pt-BR'),
      'Atualizado em': item.updatedAt.toLocaleDateString('pt-BR'),
      'Conteúdo': item.content || '',
      'Arquivos': this.getFilesByProject(item.id).length
    }));

    const pomodoroData = this.pomodoroSessions.map(session => ({
      'Projeto': session.projectTitle,
      'Categoria': session.category,
      'Tipo': session.type,
      'Duração (min)': session.duration,
      'Data': session.date,
      'Concluído em': session.completedAt.toLocaleString('pt-BR')
    }));

    const filesData = this.files.map(file => ({
      'Nome': file.name,
      'Tipo': file.type,
      'Tamanho (bytes)': file.size,
      'Projeto ID': file.projectId || '',
      'Upload em': file.uploadedAt.toLocaleString('pt-BR')
    }));

    return { projectsData, pomodoroData, filesData };
  }

  importFromExcel(data: any[]): void {
    try {
      const importedProjects: ProjectItem[] = data.map((row: any) => ({
        id: row['ID'] || Date.now().toString(),
        title: row['Título'] || 'Sem título',
        status: row['Status'] || 'to do',
        category: row['Categoria'] || 'ons',
        content: row['Conteúdo'] || '',
        createdAt: new Date(row['Criado em'] || Date.now()),
        updatedAt: new Date(row['Atualizado em'] || Date.now()),
        files: []
      }));

      this.projects = importedProjects;
      this.saveToStorage();
    } catch (error) {
      console.error('Error importing from Excel:', error);
      throw error;
    }
  }

  // Statistics
  getStatusStats(): Record<string, number> {
    return Object.keys(STATUS_COLUMNS).reduce((acc, status) => {
      acc[status] = this.projects.filter(item => item.status === status).length;
      return acc;
    }, {} as Record<string, number>);
  }

  getCategoryStats(): Record<string, number> {
    return Object.keys(CATEGORIES).reduce((acc, category) => {
      acc[category] = this.projects.filter(item => item.category === category).length;
      return acc;
    }, {} as Record<string, number>);
  }

  getPomodoroStats(): { today: number; week: number; total: number } {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return {
      today: this.pomodoroSessions.filter(s => s.date === today && s.type === 'work').length,
      week: this.pomodoroSessions.filter(s => s.date >= weekAgo && s.type === 'work').length,
      total: this.pomodoroSessions.filter(s => s.type === 'work').length
    };
  }
}
