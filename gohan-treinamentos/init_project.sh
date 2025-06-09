#!/bin/bash

# Solicita o nome do projeto
read -p "Digite o nome do projeto (sem espaços ou caracteres especiais): " PROJECT_NAME

if [[ -z "$PROJECT_NAME" ]]; then
  echo "Erro: Nome do projeto não pode ser vazio!"
  exit 1
fi

# Cria estrutura de pastas
mkdir -p ${PROJECT_NAME}/{frontend/src,backend,nginx}

# Cria docker-compose.yml
cat > ${PROJECT_NAME}/docker-compose.yml <<EOL
version: '3.8'

services:
  nginx:
    image: nginx:1.25
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - 8000:80
    depends_on:
      - backend
      - frontend

  frontend:
    image: node:22
    user: node
    working_dir: /home/node/app
    environment:
      - NODE_ENV=development
      - VITE_API_BASE_URL=/api
      - WDS_SOCKET_PORT=0
    volumes:
      - ./frontend:/home/node/app
    command: sh -c "npm install && npm run dev"

  backend:
    build: ./backend
    volumes:
      - ./backend:/usr/src/app
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=sqlite:////usr/src/app/${PROJECT_NAME}.db
    env_file:
      - .env
EOL

# Cria nginx.conf
cat > ${PROJECT_NAME}/nginx/nginx.conf <<EOL
server {
    listen 80;
    server_name ${PROJECT_NAME};

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Configurações para WebSockets (HMR do Vite)
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static {
        alias /usr/src/app/static;
    }
}
EOL

# Cria Dockerfile para backend
cat > ${PROJECT_NAME}/backend/Dockerfile <<EOL
FROM python:3.10-slim

WORKDIR /usr/src/app

RUN pip install --upgrade pip

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "app:app", "-w", "4", "-b", "0.0.0.0:5000"]
EOL

# Cria requirements.txt para backend
cat > ${PROJECT_NAME}/backend/requirements.txt <<EOL
Flask==2.3.2
Flask-SQLAlchemy==3.0.3
Flask-Cors==3.0.10
Flask-Migrate==4.0.4
python-dotenv==1.0.0
gunicorn==20.1.0
EOL

# Cria app Flask
cat > ${PROJECT_NAME}/backend/app.py <<EOL
from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///${PROJECT_NAME}.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'completed': task.completed
    } for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Dados inválidos'}), 400
    
    task = Task(title=data['title'], completed=data.get('completed', False))
    db.session.add(task)
    db.session.commit()
    return jsonify({'id': task.id, 'title': task.title, 'completed': task.completed}), 201

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({'error': 'Tarefa não encontrada'}), 404
    
    data = request.get_json()
    if 'title' in data:
        task.title = data['title']
    if 'completed' in data:
        task.completed = data['completed']
    
    db.session.commit()
    return jsonify({'id': task.id, 'title': task.title, 'completed': task.completed})

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({'error': 'Tarefa não encontrada'}), 404
    
    db.session.delete(task)
    db.session.commit()
    return jsonify({'result': 'Tarefa deletada'}), 200

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOL

# Cria migrations
mkdir -p ${PROJECT_NAME}/backend/migrations
cat > ${PROJECT_NAME}/backend/migrations/env.py <<EOL
from alembic import context
from flask import current_app
from logging.config import fileConfig

config = context.config
fileConfig(config.config_file_name)
target_metadata = current_app.extensions['migrate'].db.metadata

def run_migrations_online():
    connectable = current_app.extensions['migrate'].db.engine
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

run_migrations_online()
EOL

# Cria estrutura do frontend
cat > ${PROJECT_NAME}/frontend/index.html <<EOL
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$PROJECT_NAME - Sistema de Produtividade</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
EOL

# Cria arquivo Vite config
cat > ${PROJECT_NAME}/frontend/vite.config.ts <<EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
EOL

# Cria arquivos TypeScript
cat > ${PROJECT_NAME}/frontend/tsconfig.json <<EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

cat > ${PROJECT_NAME}/frontend/tsconfig.node.json <<EOL
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOL

# Cria package.json
cat > ${PROJECT_NAME}/frontend/package.json <<EOL
{
  "name": "$PROJECT_NAME-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}
EOL

# Cria estrutura de pastas do frontend
mkdir -p ${PROJECT_NAME}/frontend/src/{components,services,pages}

# Cria main.tsx
cat > ${PROJECT_NAME}/frontend/src/main.tsx <<EOL
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
EOL

# Cria index.css
cat > ${PROJECT_NAME}/frontend/src/index.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
}
EOL

# Cria App.tsx
cat > ${PROJECT_NAME}/frontend/src/App.tsx <<EOL
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const TasksPage = React.lazy(() => import('./pages/TasksPage'));

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tasks" element={<TasksPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
EOL

# Cria componentes
cat > ${PROJECT_NAME}/frontend/src/components/Sidebar.tsx <<EOL
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/tasks', label: 'Tarefas', icon: '✅' },
    { path: '/projects', label: 'Projetos', icon: '📁' },
    { path: '/notes', label: 'Notas', icon: '📝' },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4 text-xl font-bold">${PROJECT_NAME}</div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              \`block py-3 px-4 hover:bg-gray-700 transition-colors \${isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''}\`
            }
          >
            <div className="flex items-center">
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
EOL

cat > ${PROJECT_NAME}/frontend/src/components/LoadingSpinner.tsx <<EOL
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
EOL

cat > ${PROJECT_NAME}/frontend/src/components/TaskList.tsx <<EOL
import React from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  return (
    <div className="mt-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center">Nenhuma tarefa encontrada</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <span className={\`ml-3 \${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}\`}>
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
EOL

cat > ${PROJECT_NAME}/frontend/src/components/TaskForm.tsx <<EOL
import React, { useState } from 'react';

interface TaskFormProps {
  onAdd: (title: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adicione uma nova tarefa..."
        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none"
      >
        Adicionar
      </button>
    </form>
  );
};

export default TaskForm;
EOL

# Cria services
cat > ${PROJECT_NAME}/frontend/src/services/api.ts <<EOL
const API_BASE = '/api';

export const fetchTasks = async () => {
  const response = await fetch(\`\${API_BASE}/tasks\`);
  if (!response.ok) {
    throw new Error('Falha ao carregar tarefas');
  }
  return response.json();
};

export const createTask = async (title: string) => {
  const response = await fetch(\`\${API_BASE}/tasks\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Falha ao criar tarefa');
  }
  return response.json();
};

export const updateTask = async (id: number, completed: boolean) => {
  const response = await fetch(\`\${API_BASE}/tasks/\${id}\`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) {
    throw new Error('Falha ao atualizar tarefa');
  }
  return response.json();
};

export const deleteTask = async (id: number) => {
  const response = await fetch(\`\${API_BASE}/tasks/\${id}\`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Falha ao deletar tarefa');
  }
  return response.json();
};
EOL

# Cria páginas
cat > ${PROJECT_NAME}/frontend/src/pages/DashboardPage.tsx <<EOL
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Bem-vindo ao ${PROJECT_NAME}! Seu sistema de produtividade pessoal.</p>
        <p className="mt-4">Aqui você pode gerenciar suas tarefas, projetos e notas.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
EOL

cat > ${PROJECT_NAME}/frontend/src/pages/TasksPage.tsx <<EOL
import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      const newTask = await createTask(title);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateTask(id, !task.completed);
        setTasks(tasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciador de Tarefas</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <TaskForm onAdd={handleAddTask} />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Minhas Tarefas</h2>
        {loading ? (
          <p>Carregando tarefas...</p>
        ) : (
          <TaskList 
            tasks={tasks} 
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default TasksPage;
EOL

# Cria .env
cat > ${PROJECT_NAME}/.env <<EOL
# Configurações gerais
PROJECT_NAME=${PROJECT_NAME}

# Configurações do Flask
FLASK_SECRET_KEY=super_secret_key_${PROJECT_NAME}
EOL

# Cria .gitignore
cat > ${PROJECT_NAME}/.gitignore <<EOL
# Node
node_modules/
dist/
npm-debug.log

# Python
__pycache__/
*.pyc
venv/
.env

# Banco de dados
*.db
*.sqlite3

# Docker
.env
.venv
EOL

# Cria README
cat > ${PROJECT_NAME}/README.md <<EOL
# ${PROJECT_NAME} - Sistema de Produtividade

Este é um sistema completo de produtividade com backend Flask e frontend React.

## Como executar

1. Certifique-se de ter o Docker instalado
2. Navegue até a pasta do projeto:
   \`\`\`bash
   cd ${PROJECT_NAME}
   \`\`\`
3. Inicie os containers:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

## Acesso

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:8000/api/tasks
- **Health Check**: http://localhost:8000/api/health

## Recursos implementados

1. **Frontend**:
   - Vite + React + TypeScript
   - Navegação com React Router
   - Menu lateral responsivo
   - CRUD completo de tarefas
   - Componentes reutilizáveis

2. **Backend**:
   - Flask com SQLAlchemy
   - SQLite para armazenamento
   - Migrações com Flask-Migrate
   - API RESTful para gerenciamento de tarefas

3. **Infraestrutura**:
   - Nginx como proxy reverso
   - Docker Compose para orquestração
   - Configuração de ambiente

## Otimizações

1. **Proxy Reverso com Nginx**:
   - Roteamento inteligente (frontend e backend na mesma porta)
   - Configuração WebSocket para HMR do Vite
   - Prefíxo /api para rotas backend

2. **Arquitetura do Frontend**:
   - Code splitting com React.lazy
   - Suspense para loading states
   - Service layer para API calls
   - Componentização eficiente

3. **Backend Otimizado**:
   - Docker multi-stage build
   - Gunicorn pronto para produção
   - Migrações de banco de dados
   - Blueprint para organização de rotas

4. **Desempenho**:
   - Cache de dependências no Docker
   - HMR (Hot Module Replacement) do Vite
   - Lazy loading de rotas
   - Componentes otimizados

5. **Segurança**:
   - Variáveis de ambiente isoladas
   - CORS configurado
   - User node no container frontend
   - Imagens oficiais Docker
EOL

echo "Projeto ${PROJECT_NAME} criado com sucesso!"
echo "Para executar:"
echo "  cd ${PROJECT_NAME}"
echo "  docker-compose up --build"