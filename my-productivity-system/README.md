# My Productivity System (Pedro Victor's Personal OS)

Este é o seu sistema de organização pessoal completo, Mestre Pedro Victor, construído com Next.js (Frontend), Flask (Backend) e SQLite (Banco de Dados).

## Arquitetura

-   **Frontend**: Desenvolvido com **Next.js (React)** e estilizado com **Tailwind CSS**. A interface de usuário permite gerenciar vitórias diárias, visualizar progresso de XP e acessar outras áreas de organização.
-   **Backend**: Construído com **Python Flask** e **SQLAlchemy**, fornecendo uma API RESTful para operações CRUD (Criar, Ler, Atualizar, Deletar) com o banco de dados.
-   **Banco de Dados**: **SQLite**, um banco de dados leve baseado em arquivo, ideal para prototipagem e aplicações pessoais. O arquivo `productivity.db` será criado no diretório `backend/`.

## Estrutura do Projeto

```
my-productivity-system/
├── frontend/             # Projeto Next.js (Frontend)
│   ├── public/
│   ├── src/
│   │   ├── components/   # Componentes React reutilizáveis
│   │   ├── pages/        # Páginas do Next.js (incluindo a página principal)
│   │   └── styles/       # Estilos globais e do Tailwind CSS
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── next.config.js
│   ├── package.json
│   └── README.md
├── backend/              # Aplicação Flask (Backend)
│   ├── productivity.db   # Arquivo do banco de dados SQLite
│   ├── app.py            # Código da API Flask
│   └── requirements.txt  # Dependências Python
├── run_dev.sh            # Script para iniciar ambos (Frontend e Backend)
├── .gitignore            # Ignorar arquivos gerados/temporários
└── README.md             # Este arquivo
```

## Como Iniciar

Siga os passos abaixo para configurar e rodar o projeto:

### 1. Clonar o Repositório (ou criar os arquivos manualmente):

Crie uma pasta chamada `my-productivity-system` e salve todos os arquivos dentro dela, seguindo a estrutura acima.

### 2. Configurar o Backend (Flask):

Navegue até o diretório `backend/`:

```bash
cd my-productivity-system/backend
```

Crie e ative um ambiente virtual (recomendado):

```bash
python -m venv venv
source venv/bin/activate  # No Linux/macOS
# ou
.\venv\Scripts\activate  # No Windows
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

### 3. Configurar o Frontend (Next.js):

Navegue até o diretório `frontend/`:

```bash
cd my-productivity-system/frontend
```

Instale as dependências do Node.js:

```bash
npm install
```

### 4. Rodar o Aplicativo Completo:

Volte para o diretório raiz do projeto (`my-productivity-system/`):

```bash
cd my-productivity-system/
```

Execute o script de desenvolvimento:

```bash
bash run_dev.sh
```

-   O backend Flask será iniciado na porta `5000`.
-   O frontend Next.js será iniciado na porta `3000`.
-   A aplicação estará acessível em `http://localhost:3000`.

**Para parar a aplicação**, pressione `Ctrl+C` no terminal onde `run_dev.sh` está rodando. O script tentará parar ambos os processos.

## Funcionalidades Principais

-   **Gerenciamento de Vitórias Diárias (CRUD)**: Adicione, edite, visualize e remova suas vitórias diárias.
-   **Sistema de XP e Níveis**: Suas vitórias contribuem para o seu XP, permitindo que você suba de nível até se tornar um Mestre JEDI da Organização.
-   **Visualização de Progresso**: Gráfico visual do seu XP e nível.
-   **Templates Markdown**: Acesso rápido a templates para organizar suas áreas e projetos.
-   **Editor e Pré-visualizador Markdown**: Edite e visualize seus arquivos Markdown diretamente no navegador.
-   **Dados Financeiros Básicos**: Registre suas receitas e gastos (funcionalidade em desenvolvimento).
-   **Exportação de Dados**: Exporte todos os seus dados (vitórias, projetos, tarefas) para um arquivo CSV compatível com Excel.
-   **Tema Dracula**: Interface moderna e confortável para o desenvolvimento.
-   **Responsivo**: Design adaptável para diferentes tamanhos de tela.

## Próximos Passos e Possíveis Melhorias

-   **Persistência de Projetos e Tarefas**: Atualmente, apenas as Vitórias Diárias são salvas no banco de dados. Estenda a lógica CRUD para os modelos `Project` e `Task` no frontend.
-   **Autenticação de Usuários**: Implemente um sistema de login para que múltiplos usuários possam ter seus próprios dados.
-   **Relatórios e Análises**: Crie dashboards mais complexos com base nos dados do banco de dados (ex: gráficos de progresso de projetos, análise de gastos).
-   **Integração Real com ClickUp**: Desenvolva uma integração com a API do ClickUp para sincronizar tarefas e projetos.
-   **Deployment**: Prepare a aplicação para ser hospedada em um servidor online.
-   **Refatorar o `renderMarkdown`**: Para renderização Markdown mais avançada, considere usar uma biblioteca como `marked` ou `react-markdown` no frontend.
-   **Internacionalização (i18n)**: Adicione suporte a múltiplos idiomas.

Comece a construir seu império, Mestre Pedro Victor! Qualquer dúvida, estarei aqui para ajudar.
