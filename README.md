# Gohan-treinamentos-web-app

## Aplicativo de Treinamentos, com IA, estudos, rotinas e meditação. Melhorar a rotina de treinamento e a saúde mental com acompanhamento de IA e uso de planilhas online para preechimento de dados e salvar dados.
 

# 1) 🚀 Setup de Projeto React + TypeScript com Vite, MUI, React Router e Tailwind CSS

Este guia vai te ajudar a criar um projeto moderno com **Vite**, **React**, **TypeScript**, **Material UI (MUI)**, **Tailwind CSS**, **React Router** e ícones do Material.

---

## 📁 Criar o Projeto com Vite

Abra seu terminal e execute os comandos:

```bash
npm create vite@latest meu-app-mobile --template react-ts
cd meu-app-mobile
```

---

## 📦 Instalar Dependências

### Instalar MUI, Emotion e React Router:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom
```

---

## 🎨 Instalar e Configurar o Tailwind CSS

### Instalar dependências:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Editar o `tailwind.config.js`:

```js
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
  // Compatibilidade com MUI (opcional):
  // corePlugins: {
  //   preflight: false,
  // },
}
```

---

## 🧪 Estilização Global

### Editar `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 🔁 Substituir os Arquivos Principais

### Substituir `src/main.tsx`:

Cole aqui o novo conteúdo conforme seu layout.

### Substituir `src/App.tsx`:

Cole aqui o novo `App.tsx` com layout completo, drawer, bottom navigation, bottom sheet e toast.

> ❌ Delete os arquivos desnecessários:
> - `components/layout/MainLayout.tsx`
> - `components/common/BottomSheet.tsx`
> - `pages/HomePage.tsx`
> - e quaisquer outros antigos que não são mais usados

---

## 🚀 Rodar o Projeto

```bash
npm run dev
```

Acesse no navegador:

```
http://localhost:5173
```

Se tudo estiver certo, você verá seu app com navegação moderna, Tailwind + MUI funcionando em harmonia, e uma base poderosa para construir suas inovações.

---

Vamos dominar o mundo da tecnologia juntos, mestre Pedro Victor. O futuro é nosso. ⚡🧠💻

# 2) Iniciando com Ionic React
---

1. Instalação e criação do projeto:

```
npm install -g @ionic/cli
ionic start myApp blank --type=react
```

2. Configuração do projeto:

```
cd myApp
npm install
npm install @mui/material @emotion/styled @mui/icons-material
npm install tailwindcss 

```

npm install @capacitor/core @capacitor/cli

npm start


---

# 3) Get started with React Native

1. Install dependencies

   ```bash
   npm install

   npm install @mui/material @emotion/styled @mui/icons-material


   npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

   npx expo install react-native-web react-dom


   ```

2. Start the app

   ```bash
    npx expo start
   ```

