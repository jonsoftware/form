// public/js/tasks.js

function testarCriarTarefa() {
    const titulo = prompt('Digite o título da tarefa:');
    if (!titulo) return;

    fetch('/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo, descricao: 'Tarefa criada via interface' })
    })
    .then(res => res.json())
    .then(data => {
        alert('Tarefa criada com sucesso!\n\n' + JSON.stringify(data, null, 2));
        location.reload();
    })
    .catch(err => alert('Erro: ' + err.message));
}

function testarAtualizarTarefa() {
    const id = prompt('Digite o ID da tarefa para atualizar:');
    if (!id) return;

    fetch(`/api/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: 'Tarefa atualizada',
            descricao: 'Descrição atualizada via interface',
            concluida: true
        })
    })
    .then(res => res.json())
    .then(data => {
        alert('Tarefa atualizada com sucesso!\n\n' + JSON.stringify(data, null, 2));
        location.reload();
    })
    .catch(err => alert('Erro: ' + err.message));
}

function testarDeletarTarefa() {
    const id = prompt('Digite o ID da tarefa para deletar:');
    if (!id) return;
    if (!confirm(`Tem certeza que deseja deletar a tarefa ${id}?`)) return;

    fetch(`/api/tarefas/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
        alert('Tarefa deletada com sucesso!\n\n' + JSON.stringify(data, null, 2));
        location.reload();
    })
    .catch(err => alert('Erro: ' + err.message));
}
