#!/bin/bash

echo "🌀 Iniciando setup do projeto Gohan-Treinamentos com IA..."

read -p "👨‍💻 Digite o nome do projeto: " project_name

# Criar projeto com Vite + React + TS
npm create vite@latest $project_name --template react-ts
cd $project_name

echo "📦 Instalando dependências essenciais..."
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom

echo "🎨 Instalando Tailwind CSS..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "🔧 Configurando TailwindCSS..."
cat > tailwind.config.js <<EOL
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
EOL

echo "🧪 Criando estilização global..."
cat > src/index.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOL

echo "Atualzando o json do vite..."
cat > tsconfig.node.json << EOL
{
  "compilerOptions": {
    "allowJs": true,
    "jsx": "react-jsx",      // ou "react" se estiver no React <17
    "checkJs": false,        // evita checagem de tipo nos arquivos JS
    "esModuleInterop": true,
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "Node"
  },
  "include": ["src"]
}
EOL

echo "📁 Criando estrutura de pastas poderosa..."
mkdir -p src/{controllers,context,hooks,assets,models,views}

echo "🧼 Limpando arquivos desnecessários..."
rm -f src/App.css src/assets/react.svg
rm -f src/main.tsx src/App.tsx

echo "✅ Setup concluído! Agora é só codar e dominar o universo 💥"
echo "🚀 Para rodar seu app:"
echo "cd $project_name && npm run dev"
