const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

let tarefas = [
    { id: 1, titulo: 'Tarefa 1', concluida: false },
    { id: 2, titulo: 'Tarefa 2', concluida: true }
];

// Rota simples de teste
app.get('/api/tarefas', (req, res) => {
    console.log('✅ API funcionando!');
    res.json({ success: true, data: tarefas });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de teste na porta ${PORT}`);
    console.log(`🌐 Teste: http://localhost:${PORT}/api/tarefas`);
});