# Alterações feitas no TarefasPage.jsx

## Remoção da afirmação de não-nulo
- Na linha onde o título da nova tarefa é definido, a afirmação de não-nulo foi removida para evitar erro em arquivos JavaScript. Agora, um valor padrão vazio é utilizado caso o valor seja nulo.

# Mudanças no task_manager.tsx

- Atualizado o tipo de `status` para aceitar apenas os valores permitidos: `"pendente"`, `"em_progresso"`, `"concluida"`.
