/**
 * AULA 1 - ROTAS DE API
 * 
 * Este arquivo contém todas as rotas relacionadas à API REST
 * da nossa aplicação. Aqui você pode adicionar novos endpoints.
 */

const express = require('express');
const router = express.Router();


/* COMENTADO - AGORA AS TAREFAS ESTÃO NO index.js
// Array para simular banco de dados (em memória) - ADICIONE ISSO NO INÍCIO
let tarefas = [
    { id: 1, titulo: 'Configurar ambiente', descricao: 'Configurar o ambiente de desenvolvimento', concluida: true, data: '2024-01-01' },
    { id: 2, titulo: 'Criar rotas', descricao: 'Criar as rotas da aplicação', concluida: true, data: '2024-01-02' },
    { id: 3, titulo: 'Implementar funcionalidades', descricao: 'Implementar as funcionalidades principais', concluida: false, data: '2024-01-03' },
    { id: 4, titulo: 'Testar aplicação', descricao: 'Realizar testes na aplicação', concluida: false, data: '2024-01-04' }
];

/**
 * LISTAR TAREFAS - ROTA GET QUE ESTAVA FALTANDO
 * ==============
 * Rota: GET /api/tarefas
 * Descrição: Retorna lista de tarefas
 */
/*
router.get('/tarefas', (req, res) => {
    console.log('📋 Listando tarefas...');
    
    res.json({
        success: true,
        data: tarefas,
        total: tarefas.length,
        timestamp: new Date().toISOString()
    });
});
*/

/**
 * OBTER TAREFA POR ID
 * ===================
 * Rota: GET /api/tarefas/:id
 * Descrição: Retorna uma tarefa específica
 */
/*
router.get('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    console.log(`🔍 Buscando tarefa ${id}...`);
    
    const tarefa = tarefas.find(t => t.id == id);
    
    if (!tarefa) {
        return res.status(404).json({
            success: false,
            error: 'Tarefa não encontrada',
            timestamp: new Date().toISOString()
        });
    }
    
    res.json({
        success: true,
        data: tarefa,
        timestamp: new Date().toISOString()
    });
});
*/

/**
 * CRIAR TAREFA - JÁ EXISTE E FUNCIONA
 * ============
 * Rota: POST /api/tarefas
 * Descrição: Cria uma nova tarefa
 */
/*
router.post('/tarefas', (req, res) => {
    console.log('➕ Criando nova tarefa...');
    console.log('Dados recebidos:', req.body);
    
    const { titulo, descricao } = req.body;
    
    if (!titulo) {
        return res.status(400).json({
            success: false,
            error: 'Título é obrigatório',
            timestamp: new Date().toISOString()
        });
    }
    
    // Gera um ID único
    const novoId = tarefas.length > 0 ? Math.max(...tarefas.map(t => t.id)) + 1 : 1;
    
    const novaTarefa = {
        id: novoId,
        titulo,
        descricao: descricao || '',
        concluida: false,
        data: new Date().toISOString().split('T')[0],
        dataCriacao: new Date().toISOString()
    };
    
    // Adiciona à lista
    tarefas.push(novaTarefa);
    
    res.status(201).json({
        success: true,
        message: 'Tarefa criada com sucesso!',
        data: novaTarefa,
        timestamp: new Date().toISOString()
    });
});
*/

/**
 * ATUALIZAR TAREFA
 * ================
 * Rota: PUT /api/tarefas/:id
 * Descrição: Atualiza uma tarefa existente
 */
/*
router.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    console.log(`🔄 Atualizando tarefa ${id}...`);
    console.log('Dados recebidos:', req.body);
    
    const { titulo, descricao, concluida } = req.body;
    
    // Encontra a tarefa
    const tarefaIndex = tarefas.findIndex(t => t.id == id);
    
    if (tarefaIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Tarefa não encontrada',
            timestamp: new Date().toISOString()
        });
    }
    
    // Atualiza a tarefa
    tarefas[tarefaIndex] = {
        ...tarefas[tarefaIndex],
        titulo: titulo || tarefas[tarefaIndex].titulo,
        descricao: descricao !== undefined ? descricao : tarefas[tarefaIndex].descricao,
        concluida: concluida !== undefined ? concluida : tarefas[tarefaIndex].concluida,
        dataAtualizacao: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: `Tarefa ${id} atualizada com sucesso!`,
        data: tarefas[tarefaIndex],
        timestamp: new Date().toISOString()
    });
});
*/

/**
 * DELETAR TAREFA
 * ==============
 * Rota: DELETE /api/tarefas/:id
 * Descrição: Deleta uma tarefa
 */
/*
router.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    console.log(`🗑️ Deletando tarefa ${id}...`);
    
    const tarefaIndex = tarefas.findIndex(t => t.id == id);
    
    if (tarefaIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Tarefa não encontrada',
            timestamp: new Date().toISOString()
        });
    }
    
    // Remove a tarefa
    const tarefaRemovida = tarefas.splice(tarefaIndex, 1)[0];
    
    res.json({
        success: true,
        message: `Tarefa ${id} deletada com sucesso!`,
        data: tarefaRemovida,
        timestamp: new Date().toISOString()
    });
});
*/
/*FIM DO COMENTÁRIO - ROTAS DE TAREFAS COMENTADAS */

/**
 * STATUS DA API
 * =============
 * Rota: GET /api/status
 * Descrição: Retorna informações sobre o status da API
 */
router.get('/status', (req, res) => {
    console.log('📊 Verificando status da API...');
    
    const status = {
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform,
        port: process.env.PORT || 3000
    };
    
    res.json(status);
});

/**
 * STATUS DO BANCO DE DADOS
 * ========================
 * Rota: GET /api/database
 * Descrição: Retorna informações sobre o banco de dados
 */
router.get('/database', async (req, res) => {
    console.log('🗄️ Verificando status do banco de dados...');
    
    try {
        const databaseStatus = {
            connection: 'Simulado em memória',
            isConnected: true,
            timestamp: new Date().toISOString()
        };
        
        res.json(databaseStatus);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao verificar banco de dados',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * TESTE POST
 * ==========
 * Rota: POST /api/test
 * Descrição: Testa requisições POST
 */
router.post('/test', (req, res) => {
    console.log('🧪 Teste POST recebido...');
    console.log('Dados recebidos:', req.body);
    
    res.json({
        message: 'Teste POST executado com sucesso!',
        receivedData: req.body,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;