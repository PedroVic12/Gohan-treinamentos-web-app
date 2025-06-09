

// frontend/src/pages/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

// Importe seus componentes reutilizáveis
// Certifique-se de que cada componente esteja em seu próprio arquivo dentro de src/components
import SectionTitle from './components/SectonTitle';
import InfoCard from './components/InfoCard';
import CustomSnackbar from '../components/CustomSnackbar';
import LevelProgressChart from '../components/LevelProgressChart';
import ProjectsSection from '../components/ProjectsSection'; // Mantido como componente 'estático' por agora
import StudiesSection from '../components/StudiesSection'; // Mantido como componente 'estático' por agora
import SpiritualAndPhysicalRewardSection from '../components/SpiritualAndPhysicalRewardSection';
import AntiRecidivismMantraSection from '../components/AntiRecidivismMantraSection';

// API Base URL (Flask backend)
const API_BASE_URL = 'http://localhost:5000/api';

// Componente para a seção de Rotina e Finanças Básicas (agora interagindo com a API)
const RoutineAndFinanceSection: React.FC = () => {
    const [monthlyIncome, setMonthlyIncome] = useState<string>('');
    const [fixedExpenses, setFixedExpenses] = useState<string>('');
    const [variableExpenses, setVariableExpenses] = useState<string>('');
    const [dailyWins, setDailyWins] = useState<DailyWin[]>([]);
    const [newWinText, setNewWinText] = useState<string>('');
    const [editingWinId, setEditingWinId] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

    // DailyWin interface
    interface DailyWin {
        id: number;
        text: string;
        category?: string;
        completed?: boolean;
        notes?: string;
        date?: string; // ISO format string
        xp_gained?: number;
        created_at?: string;
        updated_at?: string;
    }

    // XP and Level System constants
    const XP_PER_WIN = 20;
    const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];
    const LEVEL_NAMES = ['Iniciante', 'Aprendiz', 'Mestre', 'Grão-Mestre', 'JEDI'];

    // State for XP and Level
    const [currentXp, setCurrentXp] = useState<number>(0);
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [xpToNextLevel, setXpToNextLevel] = useState<number>(LEVEL_THRESHOLDS[1]);
    const [lastLevelUpXp, setLastLevelUpXp] = useState<number>(0); // Track last XP to check for level up

    const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Fetch Daily Wins from Flask API
    const fetchDailyWins = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/daily_wins`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDailyWins(data.items);
        } catch (error) {
            console.error("Error fetching daily wins:", error);
            showSnackbar("Erro ao carregar vitórias diárias.", "error");
        }
    }, []);

    // Calculate XP and Level based on fetched wins
    const calculateXpAndLevel = useCallback((wins: DailyWin[]) => {
        const totalXp = wins.reduce((sum, win) => sum + (win.xp_gained || 0), 0);
        let level = 0;
        let xpThresholdForNextLevel = LEVEL_THRESHOLDS[1];

        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (totalXp >= LEVEL_THRESHOLDS[i]) {
                level = i;
            } else {
                break;
            }
        }

        if (level < LEVEL_NAMES.length - 1) {
            xpThresholdForNextLevel = LEVEL_THRESHOLDS[level + 1];
        } else {
            xpThresholdForNextLevel = totalXp; // If at max level, show current XP
        }

        setCurrentXp(totalXp);
        setCurrentLevel(level);
        setXpToNextLevel(xpThresholdForNextLevel);
    }, [LEVEL_THRESHOLDS, LEVEL_NAMES.length]);

    useEffect(() => {
        fetchDailyWins();
    }, [fetchDailyWins]);

    useEffect(() => {
        calculateXpAndLevel(dailyWins);
    }, [dailyWins, calculateXpAndLevel]);

    // Effect to check for level up notification
    useEffect(() => {
        if (currentXp > lastLevelUpXp) {
            // Recalculate level before the last XP gain
            const prevWins = dailyWins.filter(win => win.xp_gained !== undefined && win.id !== (dailyWins[dailyWins.length - 1]?.id || null));
            const prevXp = prevWins.reduce((sum, win) => sum + (win.xp_gained || 0), 0);
            let oldLevel = 0;
            for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                if (prevXp >= LEVEL_THRESHOLDS[i]) {
                    oldLevel = i;
                } else {
                    break;
                }
            }
            
            if (currentLevel > oldLevel) {
                 showSnackbar(`Parabéns! Você alcançou o Nível ${LEVEL_NAMES[currentLevel]}!`, 'success');
            }
        }
        setLastLevelUpXp(currentXp);
    }, [currentXp, currentLevel, lastLevelUpXp, dailyWins, calculateXpAndLevel, LEVEL_THRESHOLDS, LEVEL_NAMES]);

    const handleAddOrUpdateWin = async () => {
        if (newWinText.trim() === '') {
            showSnackbar('A vitória diária não pode estar vazia.', 'error');
            return;
        }

        const winData = {
            text: newWinText,
            category: 'geral', // Default category
            date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
            xp_gained: XP_PER_WIN,
        };

        try {
            let response;
            if (editingWinId !== null) {
                // Update existing win
                response = await fetch(`${API_BASE_URL}/daily_wins/${editingWinId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(winData),
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                showSnackbar('Vitória diária atualizada com sucesso!');
                setEditingWinId(null);
            } else {
                // Add new win
                response = await fetch(`${API_BASE_URL}/daily_wins`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(winData),
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                showSnackbar('Vitória diária adicionada! Você ganhou XP!');
            }
            setNewWinText('');
            fetchDailyWins(); // Re-fetch all wins to update UI and XP
        } catch (error) {
            console.error("Error adding/updating win:", error);
            showSnackbar(`Erro ao ${editingWinId !== null ? 'atualizar' : 'adicionar'} vitória diária.`, "error");
        }
    };

    const handleEditWin = (win: DailyWin) => {
        setNewWinText(win.text);
        setEditingWinId(win.id);
    };

    const handleCancelEdit = () => {
        setNewWinText('');
        setEditingWinId(null);
    };

    const handleDeleteWin = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/daily_wins/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            showSnackbar('Vitória diária removida.');
            if (editingWinId === id) {
                setEditingWinId(null);
                setNewWinText('');
            }
            fetchDailyWins(); // Re-fetch wins to update UI and XP
        } catch (error) {
            console.error("Error deleting win:", error);
            showSnackbar("Erro ao remover vitória diária.", "error");
        }
    };

    const formatCurrencyInput = (value: string): string => {
        if (/^\d*([,\.]?\d*)$/.test(value)) {
            return value;
        }
        return '';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Routine Section */}
            <div className="bg-secondary p-6 rounded-lg shadow-md border border-currentLine flex flex-col">
                <SectionTitle iconClass="fas fa-calendar-alt" title="🗓️ Ações de Hoje & Rotina" />
                <div className="mb-4">
                    <h3 className="font-semibold text-primary mb-2">Tarefas Principais do Dia:</h3>
                    <ul className="list-disc list-inside text-gray-300">
                        <li>Criar planilha geral com rotina semanal, horários e finanças simples</li>
                        <li>Criar arquivo Markdown com organização de tech stack + estudos</li>
                        <li>Criar estrutura de ClickUp com lista de projetos e metas semanais</li>
                        <li>Separar 3 tarefas principais de hoje: organização, estudo e código</li>
                        <li>Fazer backup dos códigos importantes no GitHub</li>
                    </ul>
                </div>
                <div className="mt-auto pt-4 border-t border-currentLine">
                    <h3 className="font-semibold text-primary mb-2">Vitórias Diárias:</h3>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Adicionar ou editar vitória"
                            value={newWinText}
                            onChange={(e) => setNewWinText(e.target.value)}
                            className="flex-1 p-2 border border-gray-600 bg-gray-800 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleAddOrUpdateWin}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-200 ease-in-out"
                            >
                                {editingWinId !== null ? 'Atualizar' : 'Adicionar'}
                            </button>
                            {editingWinId !== null && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                    <ul className="space-y-1">
                        {dailyWins.map(win => (
                            <li key={win.id} className="flex items-center justify-between bg-currentLine p-2 rounded-md text-gray-300">
                                {win.text}
                                <div>
                                    <button onClick={() => handleEditWin(win)} className="text-gray-500 hover:text-accentCyan mr-2 p-1 rounded-full hover:bg-gray-700 transition duration-200">
                                        <i className="fas fa-edit text-xs"></i>
                                    </button>
                                    <button onClick={() => handleDeleteWin(win.id)} className="text-gray-500 hover:text-accentRed p-1 rounded-full hover:bg-gray-700 transition duration-200">
                                        <i className="fas fa-trash-alt text-xs"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="mt-6 text-center text-accentYellow font-semibold text-lg italic">
                    "Quem organiza sua mente, organiza o mundo ao seu redor. O caos é o campo de batalha do criador."
                </p>
            </div>

            {/* Basic Finance Section */}
            <div className="bg-secondary p-6 rounded-lg shadow-md border border-currentLine">
                <SectionTitle iconClass="fas fa-money-bill-wave" title="💰 Finanças Básicas" />
                <div className="space-y-4">
                    <div>
                        <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-300 mb-1">Receita Mensal:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="text"
                                id="monthlyIncome"
                                placeholder="Valor"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(formatCurrencyInput(e.target.value))}
                                inputMode="decimal"
                                className="w-full pl-9 pr-2 py-2 border border-gray-600 bg-gray-800 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="fixedExpenses" className="block text-sm font-medium text-gray-300 mb-1">Gastos Fixos:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="text"
                                id="fixedExpenses"
                                placeholder="Valor"
                                value={fixedExpenses}
                                onChange={(e) => setFixedExpenses(formatCurrencyInput(e.target.value))}
                                inputMode="decimal"
                                className="w-full pl-9 pr-2 py-2 border border-gray-600 bg-gray-800 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="variableExpenses" className="block text-sm font-medium text-gray-300 mb-1">Gastos Variáveis:</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="text"
                                id="variableExpenses"
                                placeholder="Valor"
                                value={variableExpenses}
                                onChange={(e) => setVariableExpenses(formatCurrencyInput(e.target.value))}
                                inputMode="decimal"
                                className="w-full pl-9 pr-2 py-2 border border-gray-600 bg-gray-800 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-4">
                        * Use sua planilha (Google Sheets) para controle financeiro detalhado, planejamento de renda com projetos e reservas.
                    </p>
                </div>
            </div>
            <CustomSnackbar
                message={snackbarMessage}
                type={snackbarType}
                open={snackbarOpen}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};


// Main App Component (now in Next.js page format)
const App: React.FC = () => {
    // State for Markdown content in the editor
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [dailyWins, setDailyWins] = useState<DailyWin[]>([]); // Centralized state for wins

    // XP and Level System states moved to RoutineAndFinanceSection to handle XP calculation and display
    // within that component, simplifying overall App component.
    const XP_PER_WIN = 20;
    const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];
    const LEVEL_NAMES = ['Iniciante', 'Aprendiz', 'Mestre', 'Grão-Mestre', 'JEDI'];

    // DailyWin interface (duplicate for type safety, could be imported from shared types in a larger project)
    interface DailyWin {
        id: number;
        text: string;
        category?: string;
        completed?: boolean;
        notes?: string;
        date?: string;
        xp_gained?: number;
        created_at?: string;
        updated_at?: string;
    }

    // Handlers for Daily Wins, passed down to RoutineAndFinanceSection
    const handleSetDailyWins = (wins: DailyWin[]) => {
        setDailyWins(wins);
    };

    // Example Markdown Templates for easy access
    const readmeTemplate = `# README.md
## Objetivo da Área: [Nome da Área]
## Projetos Associados:
- [ ] Projeto A
- [ ] Projeto B
## Progresso e Métrica:
- Progresso semanal:
- Métrica chave:
## Status Semanal:`;

    const projectTemplate = `# Projeto: Nome do Projeto
## Status: Em andamento / Pausado / Finalizado
## Tarefas:
- [ ] Esboço inicial
- [ ] Primeira versão
- [ ] Testes
- [ ] Revisão
## Anotações:
- Detalhes técnicos...
## Tempo gasto:
- ⏱️ 2h em 29/05`;

    const diaryTemplate = `# Diário PVRV – DD/MM/AAAA

### Chakra: Plexo Solar  
### Salmo: 91  
### Evangelho: João 10:10  
### Dom do Espírito Santo: Fortaleza  
### Filosofia Japonesa: Kaizen  
### Equação do dia: ∇·E = ρ/ε₀  
### Vitórias:
- [x] Grow Mindset
- [x] Money
- [ ] Estudos
- [x] Criatividade
- [ ] In Shape`;

    const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdownContent(e.target.value);
    };

    // Basic Markdown rendering function (rudimentary for demonstration)
    const renderMarkdown = (markdownText: string) => {
        let html = markdownText
            .split('\n')
            .map(line => {
                if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-semibold text-accentCyan mb-2">${line.substring(4)}</h3>`;
                } else if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-semibold text-primary mb-3">${line.substring(3)}</h2>`;
                } else if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold text-accentGreen mb-4">${line.substring(2)}</h1>`;
                } else if (line.startsWith('- [x]')) {
                    return `<li class="flex items-center text-accentGreen"><i class="fas fa-check-square mr-2"></i><span class="line-through">${line.substring(5).trim()}</span></li>`;
                } else if (line.startsWith('- [ ]')) {
                    return `<li class="flex items-center text-foreground"><i class="far fa-square mr-2"></i><span>${line.substring(5).trim()}</span></li>`;
                } else if (line.startsWith('- ')) {
                    return `<li class="list-disc list-inside ml-4 text-gray-300">${line.substring(2).trim()}</li>`;
                } else if (line.trim() === '') {
                    return '<p class="my-1">&nbsp;</p>';
                }
                return `<p>${line}</p>`;
            })
            .join('');
        return { __html: html };
    };

    // Calculate XP and Level for the LevelProgressChart
    const calculateXpAndLevelForChart = useCallback((wins: DailyWin[]) => {
        const currentXp = wins.reduce((sum, win) => sum + (win.xp_gained || 0), 0);
        let currentLevel = 0;
        let xpToNextLevel = LEVEL_THRESHOLDS[1];

        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (currentXp >= LEVEL_THRESHOLDS[i]) {
                currentLevel = i;
            } else {
                break;
            }
        }
        
        if (currentLevel < LEVEL_NAMES.length - 1) {
            xpToNextLevel = LEVEL_THRESHOLDS[currentLevel + 1];
        } else {
            xpToNextLevel = currentXp;
        }

        return { currentXp, currentLevel, xpToNextLevel };
    }, [LEVEL_THRESHOLDS, LEVEL_NAMES.length]);

    const { currentXp, currentLevel, xpToNextLevel } = calculateXpAndLevelForChart(dailyWins);


    return (
        <div className="w-full max-w-6xl bg-currentLine text-foreground rounded-lg shadow-2xl overflow-hidden">
            <Head>
                <title>Plano de Organização Total</title>
                <meta name="description" content="Sistema de organização pessoal com Next.js, Flask e SQLite" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <AppHeader />
            <div className="p-6">
                {/* Objective Section */}
                <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine">
                    <SectionTitle iconClass="fas fa-bullseye" title="🎯 Objetivo do Dia" />
                    <p className="text-lg text-foreground leading-relaxed">
                        → Consolidar ferramentas, projetos, estudos e rotina em Markdown, Planilha e ClickUp.
                        <br />
                        → Criar um sistema simples, prático e visual para controlar tudo:
                        <ul className="list-disc list-inside ml-4 mt-2">
                            <li>Tech Stack</li>
                            <li>Projetos</li>
                            <li>Estudos por matéria</li>
                            <li>Tarefas e metas</li>
                            <li>Rotina com alinhamento espiritual</li>
                            <li>Controle financeiro básico</li>
                        </ul>
                    </p>
                </div>

                {/* Main Content: Kanban Areas + Markdown Templates & Viewer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Left Column: Kanban Areas and Markdown Templates */}
                    <div className="col-span-1">
                        {/* Kanban Areas */}
                        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine h-full">
                            <SectionTitle iconClass="fas fa-th-large" title="✅ 1. Estrutura dos ÁREAS (Kanban no ClickUp)" />
                            <p className="text-foreground mb-4">Cada macro-área terá seu Board Kanban com checklist em .md.</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-currentLine rounded-md text-sm">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th className="py-2 px-3 text-left">Área</th>
                                            <th className="py-2 px-3 text-left">Tempo Semanal</th>
                                            <th className="py-2 px-3 text-left">Meta Diária</th>
                                            <th className="py-2 px-3 text-left">Finalidade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Table rows from user prompt */}
                                        <tr className="border-b border-gray-700">
                                            <td className="py-2 px-3">PVRV</td>
                                            <td className="py-2 px-3">Diária</td>
                                            <td className="py-2 px-3">1h</td>
                                            <td className="py-2 px-3">Alinhamento espiritual + 5 vitórias</td>
                                        </tr>
                                        <tr className="border-b border-gray-700">
                                            <td className="py-2 px-3">UFF</td>
                                            <td className="py-2 px-3">10h</td>
                                            <td className="py-2 px-3">~1,5h/dia</td>
                                            <td className="py-2 px-3">Estudo teórico, revisões, anotações</td>
                                        </tr>
                                        <tr className="border-b border-gray-700">
                                            <td className="py-2 px-3">ONS</td>
                                            <td className="py-2 px-3">20h</td>
                                            <td className="py-2 px-3">4h x 5 dias</td>
                                            <td className="py-2 px-3">Projeto, execução, registros</td>
                                        </tr>
                                        <tr className="border-b border-gray-700">
                                            <td className="py-2 px-3">Coding</td>
                                            <td className="py-2 px-3">14h</td>
                                            <td className="py-2 px-3">2h/dia</td>
                                            <td className="py-2 px-3">Projetos pessoais e MVPs</td>
                                        </tr>
                                        <tr className="border-b border-gray-700">
                                            <td className="py-2 px-3">JOBS</td>
                                            <td className="py-2 px-3">30h</td>
                                            <td className="py-2 px-3">flexível</td>
                                            <td className="py-2 px-3">Freelas, apps, demandas externas</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-3">ARTIGO</td>
                                            <td className="py-2 px-3">10h</td>
                                            <td className="py-2 px-3">2h x 5 dias</td>
                                            <td className="py-2 px-3">Artigo científico, paper, documentação</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Markdown Templates */}
                        <div className="bg-secondary p-6 rounded-lg shadow-md border border-currentLine">
                            <SectionTitle iconClass="fas fa-file-alt" title="🗂️ 2. Pastas e Templates Markdown (.md)" />
                            <p className="text-foreground mb-4">Em cada área, você vai usar arquivos .md assim:</p>
                            
                            <h3 className="font-semibold text-primary mb-2 mt-4">🔹 README.md por área:</h3>
                            <pre className="bg-currentLine p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap"><code className="text-accentGreen">{readmeTemplate}</code></pre>

                            <h3 className="font-semibold text-primary mb-2 mt-4">🔹 projeto-X.md:</h3>
                            <pre className="bg-currentLine p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap"><code className="text-accentGreen">{projectTemplate}</code></pre>

                            <h3 className="font-semibold text-primary mb-2 mt-4">🔹 diario-pvrv.md:</h3>
                            <pre className="bg-currentLine p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap"><code className="text-accentGreen">{diaryTemplate}</code></pre>
                        </div>
                    </div>

                    {/* Right Column: Markdown Editor/Viewer */}
                    <div className="col-span-1">
                        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine">
                            <SectionTitle iconClass="fas fa-desktop" title="🧠 3. Painel Central de Organização + Editor Markdown" />
                            <p className="text-foreground mb-4">
                                Este é o seu painel integrado. Você pode editar o Markdown e ver a prévia.
                                <br />
                                <span className="text-sm text-gray-400">
                                    (Conceitualmente, este painel se integraria com o ClickUp e um app de tracking de tempo)
                                </span>
                            </p>

                            <div className="mb-4">
                                <textarea
                                    className="w-full h-64 p-3 border border-gray-600 bg-gray-800 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                                    placeholder="Comece a escrever seu Markdown aqui ou cole um dos templates acima!"
                                    value={markdownContent}
                                    onChange={handleMarkdownChange}
                                ></textarea>
                            </div>

                            <h3 className="font-semibold text-primary mb-2">Prévia do Markdown:</h3>
                            <div className="bg-currentLine p-4 rounded-md min-h-[150px] max-h-96 overflow-y-auto border border-gray-700">
                                {markdownContent ? (
                                    <div dangerouslySetInnerHTML={renderMarkdown(markdownContent)} className="prose prose-invert max-w-none text-foreground"></div>
                                ) : (
                                    <p className="text-gray-500 italic">Nenhum conteúdo para pré-visualizar. Digite ou cole algo no editor acima.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Section (Moved down, as it's more of a reference) */}
                <ProjectsSection /> {/* Project and Task management will be here */}
                <StudiesSection />
                <RoutineAndFinanceSection dailyWins={dailyWins} setDailyWins={handleSetDailyWins} />

                {/* Spiritual and Physical Reward Section */}
                <SpiritualAndPhysicalRewardSection />

                {/* Level Progress Chart - Now dynamically updated */}
                <LevelProgressChart
                    currentXp={currentXp}
                    level={currentLevel}
                    xpToNextLevel={xpToNextLevel}
                    levelNames={LEVEL_NAMES}
                />

                {/* Anti-Recidivism Mantra Section */}
                <AntiRecidivismMantraSection />

                {/* Tools and Power Phrase Sections */}
                <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine text-center">
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center justify-center">
                        <i className="fas fa-rocket mr-3 text-accentCyan"></i> Ferramentas de Apoio
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                        <InfoCard title="Markdown" className="bg-currentLine">
                            <p className="text-sm text-gray-400">Planejamento diário, estudos, metas, checklists.</p>
                        </InfoCard>
                        <InfoCard title="Planilha (Google Sheets)" className="bg-currentLine">
                            <p className="text-sm text-gray-400">Controle financeiro, rotina semanal, vitórias diárias.</p>
                        </InfoCard>
                        <InfoCard title="ClickUp" className="bg-currentLine">
                            <p className="text-sm text-gray-400">Gerenciamento de projetos (Programação, TCC, ONS, Estudo, Espiritual).</p>
                        </InfoCard>
                        <InfoCard title="VSCode + GitHub" className="bg-currentLine">
                            <p className="text-sm text-gray-400">Projetos e versionamento de código (JS, Python, etc).</p>
                        </InfoCard>
                        <InfoCard title="Notion (Opcional)" className="bg-currentLine">
                            <p className="text-sm text-gray-400">Visão geral de vida de vida, portfólio pessoal e leitura organizada.</p>
                        </InfoCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
