import { useState } from "react";
import { computed, effect, signal } from "@preact/signals-react";

const LOCAL_STORAGE = "TAREFAS";

// Signal to get all todos from localStorage
const getAllTodos = () => {
    const value = localStorage.getItem(LOCAL_STORAGE);
    return value ? JSON.parse(value) : []; // Retorna um array vazio se não houver tarefas
};

// Signal to manage todos
const tarefas = signal(getAllTodos());

function TodoListSignal() {
    console.log("Render TodoList");

    const [newTodoName, setNewTodoName] = useState("");

    // Create or update todo
    function addTodo(e) {
        e.preventDefault();
        if (newTodoName.trim() === "") return; // Evita adicionar tarefas vazias

        tarefas.value = [
            ...tarefas.value,
            { id: crypto.randomUUID(), name: newTodoName, completed: false }
        ];
        setNewTodoName(""); // Limpa o campo de entrada
    }

    // Check todo
    function toggleTodo(id, completed) {
        tarefas.value = tarefas.value.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed };
            }
            return todo;
        });
    }

    // Effect to sync with localStorage
    effect(() => {
        console.log("Render TodoListSignal");
        localStorage.setItem(LOCAL_STORAGE, JSON.stringify(tarefas.value));
    });

    // Computed property to count completed tasks
    const contadorTarefasCompletas = computed(() => {
        return tarefas.value.filter(tarefa => tarefa.completed).length;
    });

    // TodoListView
    return (
        <>
            <div>
                <h1>Lista de Tarefas</h1>
                <div>
                    Tarefas Completas: {contadorTarefasCompletas}
                </div>
            </div>

            <form onSubmit={addTodo} className="form">
                <label htmlFor="">Nova Tarefa</label>
                <input type="text" value={newTodoName} onChange={e => setNewTodoName(e.target.value)} />
                <button type="submit">Adicionar</button>
            </form>

            <ul>
                {tarefas.value.map(todo => (
                    <li key={todo.id}>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={todo.completed} 
                                onChange={e => toggleTodo(todo.id, e.target.checked)} 
                            />
                            {todo.name}
                        </label>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default function TodoSignalPage() {
    return (
        <TodoListSignal />
    );
}