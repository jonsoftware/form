// public/js/tarefas-funcional.js - VERSÃO MODERNA

console.log('🚀 Script de tarefas moderno carregado!');

class GerenciadorTarefas {
    constructor() {
        this.tarefas = [];
        this.filtroAtual = 'todas';
        console.log('📋 Gerenciador de Tarefas Moderno inicializado');
        this.init();
    }

    async init() {
        // Configura eventos do formulário
        this.configurarFormulario();
        this.configurarFiltros();
        this.configurarEventos();
        
        // Carrega tarefas iniciais
        await this.carregarTarefas();
    }

    configurarFormulario() {
        const form = document.getElementById('form-nova-tarefa');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.criarTarefaForm();
        });
    }

    configurarFiltros() {
        const botoesFiltro = document.querySelectorAll('.filter-btn');
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', () => {
                // Remove classe active de todos
                botoesFiltro.forEach(b => b.classList.remove('active'));
                // Adiciona classe active no botão clicado
                botao.classList.add('active');
                // Aplica filtro
                this.filtroAtual = botao.dataset.filter;
                this.aplicarFiltro();
            });
        });
    }

    aplicarFiltro() {
        const tarefasFiltradas = this.tarefas.filter(tarefa => {
            switch (this.filtroAtual) {
                case 'pendentes':
                    return !tarefa.concluida;
                case 'concluidas':
                    return tarefa.concluida;
                case 'alta':
                    return tarefa.prioridade === 'alta';
                case 'media':
                    return tarefa.prioridade === 'media';
                case 'baixa':
                    return tarefa.prioridade === 'baixa';
                default:
                    return true; // todas
            }
        });
        this.exibirTarefas(tarefasFiltradas);
    }

    async carregarTarefas() {
        try {
            console.log('📥 Carregando tarefas...');
            
            const response = await fetch('/api/tarefas');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.tarefas = result.data || [];
                console.log(`📋 ${this.tarefas.length} tarefas carregadas`);
                this.aplicarFiltro();
                this.atualizarEstatisticas();
                this.mostrarMensagem(`✅ ${this.tarefas.length} tarefas carregadas`, 'success');
            } else {
                throw new Error(result.error || 'Erro ao carregar tarefas');
            }
        } catch (error) {
            console.error('💥 Erro ao carregar tarefas:', error);
            this.mostrarMensagem('❌ Erro ao carregar tarefas', 'error');
        }
    }

    exibirTarefas(tarefas = this.tarefas) {
        const container = document.getElementById('tarefas-container');
        if (!container) return;
    
        console.log('🔍 DEBUG - Dados recebidos para exibição:', JSON.stringify(tarefas, null, 2));
    
        if (tarefas.length === 0) {
            container.innerHTML = '<div class="task-card"><p>📝 Nenhuma tarefa encontrada</p></div>';
            return;
        }
    
        let html = '';
        
        tarefas.forEach(tarefa => {
            // DEBUG para cada tarefa
            console.log('📋 Tarefa:', {
                id: tarefa.id,
                titulo: tarefa.titulo,
                descricao: tarefa.descricao,
                temTitulo: !!tarefa.titulo,
                temDescricao: !!tarefa.descricao
            });
    
            // FORÇA a exibição do título
            const tituloParaExibir = tarefa.titulo ? tarefa.titulo : 'Título não definido';
            const descricaoParaExibir = tarefa.descricao || '';
            
            // CORREÇÃO: Texto da prioridade formatado
            const textoPrioridade = tarefa.prioridade === 'alta' ? 'Alta' : 
                                   tarefa.prioridade === 'media' ? 'Média' : 'Baixa';
    
            html += `
                <div class="task-card ${tarefa.concluida ? 'concluida' : ''} ${tarefa.prioridade || 'media'}" data-id="${tarefa.id}">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <div class="custom-checkbox ${tarefa.concluida ? 'checked' : ''}" 
                                 onclick="manager.toggleConcluida(${tarefa.id})"></div>
                            <div style="flex: 1;">
                                <h3 style="margin: 0; color: #333; ${tarefa.concluida ? 'text-decoration: line-through; color: #666;' : ''}">
                                    ${tituloParaExibir}
                                </h3>
                                ${descricaoParaExibir ? `
                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                                        ${descricaoParaExibir}
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                            <small style="color: #666; font-size: 11px; font-weight: 600;">PRIORIDADE</small>
                            <span class="task-priority priority-${tarefa.prioridade || 'media'}">
                                ${textoPrioridade}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
                        <span style="color: #999; font-size: 12px;">
                            ID: ${tarefa.id} | Criada em: ${tarefa.data || 'N/A'}
                        </span>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-action btn-edit" onclick="manager.editarTarefa(${tarefa.id})">
                                ✏️ Editar
                            </button>
                            <button class="btn-action btn-delete" onclick="manager.deletarTarefa(${tarefa.id})">
                                🗑️ Deletar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    
        container.innerHTML = html;
    }

    atualizarEstatisticas() {
        const total = this.tarefas.length;
        const concluidas = this.tarefas.filter(t => t.concluida).length;
        const pendentes = total - concluidas;

        // Atualiza as estatísticas
        document.querySelector('.task-completed').textContent = concluidas;
        document.querySelector('.task-pending').textContent = pendentes;
        document.querySelector('.task-total').textContent = total;
    }
    async editarTarefa(id) {
        const tarefa = this.tarefas.find(t => t.id == id);
        if (!tarefa) {
            this.mostrarMensagem('❌ Tarefa não encontrada', 'error');
            return;
        }
    
        // Cria um modal simples para edição
        const novoTitulo = prompt('Novo título:', tarefa.titulo);
        if (novoTitulo === null) return;
    
        if (!novoTitulo.trim()) {
            this.mostrarMensagem('❌ Título não pode estar vazio', 'error');
            return;
        }
    
        const novaDescricao = prompt('Nova descrição:', tarefa.descricao || '');
        
        // VERSÃO MELHORADA: Seleção por número
        const prioridadeAtual = tarefa.prioridade || 'media';
        const novaPrioridade = prompt(
            'Nova prioridade:\n1 - Alta 🔴\n2 - Média 🟡\n3 - Baixa 🟢\n\nDigite o número (1, 2 ou 3):', 
            prioridadeAtual === 'alta' ? '1' : prioridadeAtual === 'media' ? '2' : '3'
        );
    
        // CORREÇÃO: Mapear número para texto
        let prioridadeParaEnviar;
        switch(novaPrioridade) {
            case '1':
                prioridadeParaEnviar = 'alta';
                break;
            case '2':
                prioridadeParaEnviar = 'media';
                break;
            case '3':
                prioridadeParaEnviar = 'baixa';
                break;
            default:
                // Se não for 1,2,3, mantém a atual
                prioridadeParaEnviar = prioridadeAtual;
        }
    
        try {
            console.log(`✏️ Editando tarefa ${id} com prioridade: ${prioridadeParaEnviar}`);
            
            const response = await fetch(`/api/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: novoTitulo,
                    descricao: novaDescricao !== null ? novaDescricao : (tarefa.descricao || ''),
                    prioridade: prioridadeParaEnviar,
                    concluida: tarefa.concluida
                })
            });
    
            const result = await response.json();
    
            if (result.success) {
                this.mostrarMensagem('✅ Tarefa atualizada com sucesso!', 'success');
                await this.carregarTarefas();
            } else {
                this.mostrarMensagem('❌ Erro ao editar tarefa', 'error');
            }
        } catch (error) {
            console.error('💥 Erro ao editar tarefa:', error);
            this.mostrarMensagem('❌ Erro ao editar tarefa', 'error');
        }
    }
    async criarTarefaForm() {
        const tituloInput = document.getElementById('titulo');
        const descricaoInput = document.getElementById('descricao');
        const prioridadeSelect = document.getElementById('prioridade');

        const titulo = tituloInput.value.trim();
        const descricao = descricaoInput.value.trim();
        const prioridade = prioridadeSelect.value;

        if (!titulo) {
            this.mostrarMensagem('❌ Título é obrigatório', 'error');
            tituloInput.focus();
            return;
        }

        try {
            const response = await fetch('/api/tarefas', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    titulo, 
                    descricao,
                    prioridade
                })
            });

            const result = await response.json();

            if (result.success) {
                this.mostrarMensagem('✅ Tarefa criada com sucesso!', 'success');
                // Limpa o formulário
                tituloInput.value = '';
                descricaoInput.value = '';
                prioridadeSelect.value = 'media';
                // Recarrega a lista
                await this.carregarTarefas();
            } else {
                this.mostrarMensagem('❌ ' + (result.error || 'Erro ao criar tarefa'), 'error');
            }
        } catch (error) {
            console.error('💥 Erro ao criar tarefa:', error);
            this.mostrarMensagem('❌ Erro ao criar tarefa', 'error');
        }
    }

    async toggleConcluida(id) {
        const tarefa = this.tarefas.find(t => t.id == id);
        if (!tarefa) return;

        const novaSituacao = !tarefa.concluida;

        try {
            const response = await fetch(`/api/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    concluida: novaSituacao,
                    titulo: tarefa.titulo,
                    descricao: tarefa.descricao || '',
                    prioridade: tarefa.prioridade || 'media'
                })
            });

            const result = await response.json();

            if (result.success) {
                this.mostrarMensagem(
                    `✅ Tarefa ${novaSituacao ? 'concluída' : 'marcada como pendente'}!`, 
                    'success'
                );
                await this.carregarTarefas();
            } else {
                this.mostrarMensagem('❌ Erro ao atualizar tarefa', 'error');
            }
        } catch (error) {
            console.error('💥 Erro ao atualizar tarefa:', error);
            this.mostrarMensagem('❌ Erro ao atualizar tarefa', 'error');
        }
    }

    async editarTarefa(id) {
        const tarefa = this.tarefas.find(t => t.id == id);
        if (!tarefa) return;

        // Cria um modal simples para edição
        const novoTitulo = prompt('Novo título:', tarefa.titulo);
        if (novoTitulo === null) return;

        if (!novoTitulo.trim()) {
            this.mostrarMensagem('❌ Título não pode estar vazio', 'error');
            return;
        }

        const novaDescricao = prompt('Nova descrição:', tarefa.descricao || '');
        const novaPrioridade = prompt('Nova prioridade (alta/media/baixa):', tarefa.prioridade || 'media');

        if (!['alta', 'media', 'baixa'].includes(novaPrioridade?.toLowerCase())) {
            this.mostrarMensagem('❌ Prioridade deve ser: alta, media ou baixa', 'error');
            return;
        }

        try {
            const response = await fetch(`/api/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titulo: novoTitulo,
                    descricao: novaDescricao !== null ? novaDescricao : (tarefa.descricao || ''),
                    prioridade: novaPrioridade?.toLowerCase() || 'media',
                    concluida: tarefa.concluida
                })
            });

            const result = await response.json();

            if (result.success) {
                this.mostrarMensagem('✅ Tarefa atualizada com sucesso!', 'success');
                await this.carregarTarefas();
            } else {
                this.mostrarMensagem('❌ Erro ao editar tarefa', 'error');
            }
        } catch (error) {
            console.error('💥 Erro ao editar tarefa:', error);
            this.mostrarMensagem('❌ Erro ao editar tarefa', 'error');
        }
    }

    async deletarTarefa(id) {
        const tarefa = this.tarefas.find(t => t.id == id);
        if (!tarefa) return;

        if (!confirm(`🗑️ Deletar a tarefa "${tarefa.titulo}"?\n\nEsta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            const response = await fetch(`/api/tarefas/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.mostrarMensagem('✅ Tarefa deletada com sucesso!', 'success');
                await this.carregarTarefas();
            } else {
                this.mostrarMensagem('❌ Erro ao deletar tarefa', 'error');
            }
        } catch (error) {
            console.error('💥 Erro ao deletar tarefa:', error);
            this.mostrarMensagem('❌ Erro ao deletar tarefa', 'error');
        }
    }

    async limparConcluidas() {
        const concluidas = this.tarefas.filter(t => t.concluida);
        
        if (concluidas.length === 0) {
            this.mostrarMensagem('ℹ️ Não há tarefas concluídas para limpar', 'info');
            return;
        }

        if (!confirm(`🧹 Limpar ${concluidas.length} tarefa(s) concluída(s)?`)) {
            return;
        }

        try {
            // Deleta cada tarefa concluída
            for (const tarefa of concluidas) {
                await fetch(`/api/tarefas/${tarefa.id}`, {
                    method: 'DELETE'
                });
            }

            this.mostrarMensagem(`✅ ${concluidas.length} tarefas concluídas removidas!`, 'success');
            await this.carregarTarefas();
        } catch (error) {
            console.error('💥 Erro ao limpar tarefas:', error);
            this.mostrarMensagem('❌ Erro ao limpar tarefas', 'error');
        }
    }

    mostrarMensagem(mensagem, tipo = 'info') {
        // Remove mensagens anteriores
        const mensagensAntigas = document.querySelectorAll('.mensagem-flutuante');
        mensagensAntigas.forEach(msg => msg.remove());

        // Cria nova mensagem
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem-flutuante ${tipo}`;
        mensagemDiv.textContent = mensagem;
        
        // Estilos da mensagem
        mensagemDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 300px;
            background: ${tipo === 'success' ? '#28a745' : 
                        tipo === 'error' ? '#dc3545' : 
                        tipo === 'info' ? '#17a2b8' : '#007bff'};
        `;

        // Adiciona animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(mensagemDiv);

        // Remove após 4 segundos
        setTimeout(() => {
            mensagemDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => mensagemDiv.remove(), 300);
        }, 4000);
    }

    configurarEventos() {
        console.log('⚙️ Configurando eventos...');
        
        // Adiciona estilo para o botão "Ver API"
        const verApiBtn = document.querySelector('a.btn[href="/api/tarefas"]');
        if (verApiBtn) {
            verApiBtn.onclick = (e) => {
                e.preventDefault();
                window.open('/api/tarefas', '_blank');
            };
        }
    }
}

// Inicialização global
let manager;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM carregado, inicializando gerenciador...');
    manager = new GerenciadorTarefas();
});

// Funções globais para acesso via HTML
window.manager = manager;