import { useState, useEffect } from "react";
import { TextField, Button, List, ListItem, ListItemText, Checkbox, Container } from "@mui/material";
import { IonCheckbox } from "@ionic/react";

const LOCAL_STORAGE = "TODOS";

export function TodoListReact() {
    console.log("Render TodoList");

    const [todos, setTodos] = useState(() => {
        const value = localStorage.getItem(LOCAL_STORAGE);
        if (value == null) return [];
        return JSON.parse(value);
    });

    const [newTodoName, setNewTodoName] = useState("");
    const [editTodoId, setEditTodoId] = useState(null); // ID da tarefa em edição

    // Create or Update
    function addOrUpdateTodo(e) {
        e.preventDefault();
        if (editTodoId) {
            // Atualiza a tarefa existente
            setTodos(prevTodos => prevTodos.map(todo => 
                todo.id === editTodoId ? { ...todo, name: newTodoName } : todo
            ));
            setEditTodoId(null); // Limpa o ID de edição
        } else {
            // Adiciona uma nova tarefa
            setTodos(prevTodos => [
                ...prevTodos,
                { id: crypto.randomUUID(), name: newTodoName, completed: false }
            ]);
        }
        setNewTodoName(""); // Limpa o campo de entrada
    }

    // Check todo
    function toggleTodo(id, completed) {
        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, completed };
                }
                return todo;
            });
        });
    }

    // Delete todo
    function deleteTodo(id) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE, JSON.stringify(todos));
    }, [todos]);

    if (todos.length === 0) {
        return <div>Nenhuma tarefa encontrada.</div>; // Mensagem quando não há tarefas
    }

    // TodoListView
    return (
        <Container>
            <form onSubmit={addOrUpdateTodo} style={{ marginBottom: '20px' }}>
                <TextField 
                    value={newTodoName} 
                    onChange={e => setNewTodoName(e.target.value)} 
                    placeholder="Nova Tarefa" 
                    variant="outlined" 
                    fullWidth 
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                    {editTodoId ? "Atualizar" : "Adicionar"}
                </Button>
            </form>

            <List>
                {todos.map(todo => (
                    <ListItem key={todo.id} style={{ marginBottom: '10px' }}>
                        <IonCheckbox 
                        
                            checked={todo.completed} 
                            onChange={e => toggleTodo(todo.id, e.target.checked)} 
                        />
                        <ListItemText primary={todo.name} />
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={() => {
                                setNewTodoName(todo.name);
                                setEditTodoId(todo.id); // Define o ID da tarefa a ser editada
                            }}
                        >
                            Editar
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="error" 
                            onClick={() => deleteTodo(todo.id)}
                        >
                            Deletar
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}