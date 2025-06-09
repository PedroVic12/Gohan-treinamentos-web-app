// frontend/src/components/StudiesSection.tsx
import React from 'react';
import  { useState, useEffect } from 'react';


// frontend/src/components/CustomSnackbar.tsx

interface CustomSnackbarProps {
    message: string;
    type: 'success' | 'error';
    open: boolean;
    onClose: () => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ message, type, open, onClose }) => {
    const bgColor = type === 'success' ? 'bg-accentGreen' : 'bg-accentRed';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark';

    if (!open) return null;

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
            <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 transform transition-transform duration-300 ease-out scale-100`}>
                <i className={`fas ${icon}`}></i>
                <span>{message}</span>
                <button onClick={onClose} className="ml-auto focus:outline-none">
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    );
};


// frontend/src/components/SectionTitle.tsx
interface SectionTitleProps {
    iconClass: string;
    title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ iconClass, title }) => {
    return (
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
            <i className={`${iconClass} mr-3 text-accentCyan`}></i> {title}
        </h2>
    );
};

const MantraSection: React.FC = () => {
    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine text-center">
            <SectionTitle iconClass="fas fa-shield-alt" title="6. Tenha um mantra fixo contra recaída" />
            <p className="text-xl italic font-bold text-accentOrange leading-relaxed">
                "Não vim ao mundo para me esconder, vim para brilhar como Steve Jobs e lutar como Goku."
            </p>
        </div>
    );
};


// frontend/src/components/SpiritualAndPhysicalRewardSection.tsx
const SpiritualAndPhysicalRewardSection: React.FC = () => {
    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine">
            <SectionTitle iconClass="fas fa-trophy" title="5. Recompensa Espiritual e Física" />
            <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>A cada <span className="font-bold text-accentGreen">1 dia sem usar: ganhe 1 ponto</span></li>
                <li>A cada <span className="font-bold text-accentYellow">5 pontos: recompensa</span> (pode ser um game, comida favorita, etc)</li>
                <li>A cada <span className="font-bold text-accentCyan">21 dias: novo upgrade de hábito!</span></li>
            </ul>
        </div>
    );
};


interface Project {
    name: string;
    status: string;
    notes: string;
}

const ProjectsSection: React.FC = () => {
    // These projects are static for now. In a full implementation, they would be fetched from Flask.
    const projects: Project[] = [
        { name: 'App de Delivery com PDV', status: 'Em Desenvolvimento', notes: 'Integração de APIs, Frontend React.' },
        { name: 'Agente com WebSocket + IA', status: 'Em Conceito', notes: 'Pesquisa de tecnologias de IA e WebSockets.' },
        { name: 'Site pessoal + Portfólio', status: 'Planejamento', notes: 'Design UI/UX e conteúdo inicial.' },
        { name: 'Sistema de Tarefas com Chakra + Alinhamento Espiritual', status: 'Em Desenvolvimento', notes: 'Foco na UX e integração de princípios.' }
    ];

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine">
            <SectionTitle iconClass="fas fa-folder-open" title="📁 Projetos" />
            <div className="space-y-4">
                {projects.map((project, index) => (
                    <div key={index} className="bg-currentLine p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="mb-2 sm:mb-0">
                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                            <p className="text-sm text-gray-400">{project.notes}</p>
                        </div>
                        <span className="text-xs text-primary bg-primary bg-opacity-20 px-2 py-1 rounded-full whitespace-nowrap">
                            {project.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface Study {
    name: string;
    icon: string;
}

const StudiesSection: React.FC = () => {
    // These studies are static for now. In a full implementation, they could be fetched from Flask.
    const studies: Study[] = [
        { name: 'Circuitos Elétricos', icon: 'fa-bolt' },
        { name: 'Circuitos Digitais', icon: 'fa-microchip' },
        { name: 'Sinais e Sistemas (Laplace, Fourier, Z)', icon: 'fa-wave-square' },
        { name: 'Eletromagnetismo (Ampère, Laplace, Poisson)', icon: 'fa-atom' },
        { name: 'Revisão matemática geral: integrais, derivadas, vetores', icon: 'fa-calculator' }
    ];

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine">
            <SectionTitle iconClass="fas fa-book-open" title="📘 Estudos" />
            <ul className="space-y-3">
                {studies.map((study, index) => (
                    <li key={index} className="bg-currentLine p-3 rounded-md flex items-center text-foreground">
                        <i className={`fas ${study.icon} text-primary mr-3`}></i>
                        {study.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};


// frontend/src/components/RoutineAndFinanceSection.tsx


// DailyWin interface (duplicate for type safety, could be imported from shared types in a larger project)
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

interface RoutineAndFinanceSectionProps {
    dailyWins: DailyWin[];
    setDailyWins: (wins: DailyWin[]) => void;
}

const API_BASE_URL = 'http://localhost:5000/api';
const XP_PER_WIN = 20;

const RoutineAndFinanceSection: React.FC<RoutineAndFinanceSectionProps> = ({ dailyWins, setDailyWins }) => {
    const [monthlyIncome, setMonthlyIncome] = useState<string>('');
    const [fixedExpenses, setFixedExpenses] = useState<string>('');
    const [variableExpenses, setVariableExpenses] = useState<string>('');
    const [newWinText, setNewWinText] = useState<string>('');
    const [editingWinId, setEditingWinId] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

    const powerPhrase = "Quem organiza sua mente, organiza o mundo ao seu redor. O caos é o campo de batalha do criador.";

    const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    // Fetch Daily Wins from Flask API
    const fetchDailyWins = async () => {
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
    };

    useEffect(() => {
        fetchDailyWins();
    }, []); // Run once on component mount

    const handleAddOrUpdateWin = async () => {
        if (newWinText.trim() === '') {
            showSnackbar('A vitória diária não pode estar vazia.', 'error');
            return;
        }

        const winData = {
            text: newWinText,
            category: 'geral',
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            xp_gained: XP_PER_WIN,
        };

        try {
            let response;
            if (editingWinId !== null) {
                response = await fetch(`${API_BASE_URL}/daily_wins/${editingWinId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(winData),
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                showSnackbar('Vitória diária atualizada com sucesso!');
                setEditingWinId(null);
            } else {
                response = await fetch(`${API_BASE_URL}/daily_wins`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(winData),
                });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                showSnackbar('Vitória diária adicionada! Você ganhou XP!');
            }
            setNewWinText('');
            fetchDailyWins(); // Re-fetch to update UI and XP
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
            fetchDailyWins(); // Re-fetch to update UI and XP
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
                    "{powerPhrase}"
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


interface LevelProgressChartProps {
    currentXp: number;
    level: number;
    xpToNextLevel: number;
    levelNames: string[];
}

const LevelProgressChart: React.FC<LevelProgressChartProps> = ({ currentXp, level, xpToNextLevel, levelNames }) => {
    const maxLevelXp = level === levelNames.length - 1 ? currentXp : xpToNextLevel; 
    const progressPercentage = maxLevelXp > 0 ? (currentXp / maxLevelXp) * 100 : 0;
    const currentLevelName = levelNames[level] || 'Desconhecido';

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-md mb-6 border border-currentLine text-center">
            <SectionTitle iconClass="fas fa-star" title="Seu Nível de Organização" />
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-currentLine border-4 border-primary shadow-lg">
                    <span className="text-4xl sm:text-5xl font-extrabold text-accentYellow">
                        {level + 1}
                    </span>
                    <div className="absolute -bottom-2 px-3 py-1 bg-primary text-white text-xs sm:text-sm font-semibold rounded-full shadow-md">
                        {currentLevelName}
                    </div>
                </div>
                <div className="flex-1 w-full sm:w-auto max-w-sm">
                    <p className="text-2xl font-bold text-foreground mb-2">XP: <span className="text-accentGreen">{currentXp}</span> / <span className="text-foreground">{maxLevelXp}</span></p>
                    <div className="w-full bg-currentLine rounded-full h-5 mb-3 shadow-inner">
                        <div
                            className="bg-gradient-to-r from-accentGreen to-primary h-full rounded-full transition-all duration-700 ease-in-out shadow-md"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    {level < levelNames.length - 1 && (
                        <p className="text-sm text-gray-400">Próximo Nível: <span className="font-semibold text-accentCyan">{levelNames[level + 1]}</span> (faltam <span className="font-bold text-accentRed">{xpToNextLevel - currentXp} XP</span>)</p>
                    )}
                     {level === levelNames.length - 1 && (
                        <p className="text-sm text-gray-400 font-bold text-accentGreen">Você atingiu o nível máximo! Mestre JEDI da Organização!</p>
                    )}
                </div>
            </div>
        </div>
    );
};


interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-secondary p-6 rounded-lg shadow-md border border-currentLine ${className}`}>
            <h3 className="font-semibold text-primary mb-2">{title}</h3>
            {children}
        </div>
    );
};

export default RoutineAndFinanceSection;

