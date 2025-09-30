/**
 * ROTAS DE PÁGINAS
 */

const express = require('express');
const router = express.Router();

// ==========================================
// SISTEMA DE USUÁRIOS EM MEMÓRIA (APENAS ARRAY VAZIO)
// ==========================================

let usuariosCadastrados = []; // COMEÇA VAZIO - SEM USUÁRIO PADRÃO

let usuarioLogado = null;

// ==========================================
// FUNÇÃO DE AUTENTICAÇÃO
// ==========================================

function requireAuth(req, res, next) {
    if (usuarioLogado) {
        next();
    } else {
        res.redirect('/login');
    }
}

// ==========================================
// ROTAS PÚBLICAS
// ==========================================

router.get('/', (req, res) => {
    console.log('🏠 Acessando página inicial...');
    const pageData = {
        title: 'Aplicativo Híbrido - Aula 1',
        description: 'Bem-vindo ao nosso aplicativo híbrido de gerenciamento de tarefas!',
        currentTime: new Date().toLocaleString('pt-BR'),
        version: '1.0.0'
    };
    res.render('index', pageData);
});

router.get('/sobre', (req, res) => {
    console.log('ℹ️ Acessando página sobre...');
    const pageData = {
        title: 'Sobre o Projeto',
        description: 'Informações sobre o aplicativo híbrido',
        features: [
            'Interface moderna e responsiva',
            'Funciona sem banco de dados',
            'API REST completa',
            'Sistema de rotas organizado'
        ]
    };
    res.render('sobre', pageData);
});

router.get('/contato', (req, res) => {
    console.log('📞 Acessando página de contato...');
    const pageData = {
        title: 'Contato',
        description: 'Entre em contato conosco',
        contactInfo: {
            email: 'professor@exemplo.com',
            telefone: '(21) 99999-9999',
            endereco: 'Universidade de Vassouras'
        }
    };
    res.render('contato', pageData);
});

// ==========================================
// ROTAS DE CADASTRO (REDIRECIONA PARA LOGIN APÓS CADASTRO)
// ==========================================

router.get('/cadastro', (req, res) => {
    if (usuarioLogado) return res.redirect('/tarefas');
    console.log('📝 Acessando página de cadastro...');
    res.render('cadastro', {
        title: 'Criar Conta',
        description: 'Preencha seus dados para criar uma conta',
        error: null,
        formData: {}
    });
});

router.post('/cadastro', (req, res) => {
    console.log('📝 Processando cadastro...');
    const { nome, email, telefone, endereco, dataNascimento, username, senha } = req.body;
    
    // Validações básicas
    if (!nome || !email || !username || !senha) {
        return res.render('cadastro', {
            title: 'Criar Conta',
            description: 'Preencha seus dados para criar uma conta',
            error: 'Preencha todos os campos obrigatórios!',
            formData: req.body
        });
    }
    
    // Verifica se username já existe
    const usuarioExistente = usuariosCadastrados.find(u => u.username === username);
    if (usuarioExistente) {
        return res.render('cadastro', {
            title: 'Criar Conta',
            description: 'Preencha seus dados para criar uma conta',
            error: 'Nome de usuário já está em uso!',
            formData: req.body
        });
    }
    
    // Cria novo usuário
    const novoUsuario = {
        id: usuariosCadastrados.length + 1,
        nome,
        email,
        telefone: telefone || '',
        endereco: endereco || '',
        dataNascimento: dataNascimento || '',
        username,
        senha,
        dataCadastro: new Date()
    };
    
    usuariosCadastrados.push(novoUsuario);
    
    // Log no terminal com TODOS os dados
    console.log('✅ NOVO USUÁRIO CADASTRADO:');
    console.log('┌───────────────────────────────────────');
    console.log('│ 👤 Nome:', novoUsuario.nome);
    console.log('│ 📧 Email:', novoUsuario.email);
    console.log('│ 📞 Telefone:', novoUsuario.telefone);
    console.log('│ 🏠 Endereço:', novoUsuario.endereco);
    console.log('│ 🎂 Data Nascimento:', novoUsuario.dataNascimento);
    console.log('│ 👨‍💻 Username:', novoUsuario.username);
    console.log('│ 🔐 Senha:', novoUsuario.senha);
    console.log('│ 📅 Data Cadastro:', novoUsuario.dataCadastro.toLocaleString('pt-BR'));
    console.log('└───────────────────────────────────────');
    console.log('📊 Total de usuários cadastrados:', usuariosCadastrados.length);
    
    // REDIRECIONA PARA LOGIN (NÃO FAZ LOGIN AUTOMÁTICO)
    console.log('📝 Cadastro concluído! Redirecionando para login...');
    res.redirect('/login?success=1&username=' + novoUsuario.username);
});

// ==========================================
// ROTAS DE LOGIN (AGORA SÓ FUNCIONA COM USUÁRIOS CADASTRADOS)
// ==========================================

router.get('/login', (req, res) => {
    if (usuarioLogado) return res.redirect('/tarefas');
    console.log('🔐 Acessando página de login...');
    res.render('login', {
        title: 'Sign In',
        description: 'Acesso ao sistema',
        error: req.query.error ? 'Credenciais inválidas!' : null,
        success: req.query.success ? 'Cadastro realizado! Faça login com suas credenciais.' : null,
        username: req.query.username || '' // Preenche o username se veio do cadastro
    });
});

router.post('/login', (req, res) => {
    console.log('🔐 Processando login...');
    const { username, password } = req.body;
    
    // Busca usuário nos cadastrados - NÃO MAIS SENHA FIXA
    const usuario = usuariosCadastrados.find(u => u.username === username && u.senha === password);
    
    if (usuario) {
        usuarioLogado = usuario;
        console.log('✅ LOGIN BEM-SUCEDIDO:');
        console.log('👤 Usuário:', usuario.nome);
        console.log('🆔 ID:', usuario.id);
        console.log('👨‍💻 Username:', usuario.username);
        console.log('📅 Data Cadastro:', usuario.dataCadastro.toLocaleString('pt-BR'));
        console.log('📊 Total de usuários no sistema:', usuariosCadastrados.length);
        res.redirect('/tarefas');
    } else {
        console.log('❌ TENTATIVA DE LOGIN FALHOU:');
        console.log('👨‍💻 Username tentado:', username);
        console.log('📋 Usuários cadastrados:', usuariosCadastrados.map(u => u.username));
        res.redirect('/login?error=1');
    }
});

router.get('/logout', (req, res) => {
    if (usuarioLogado) console.log('🚪 LOGOUT:', usuarioLogado.nome);
    usuarioLogado = null;
    res.redirect('/');
});

// ==========================================
// ROTAS PROTEGIDAS
// ==========================================

router.get('/tarefas', requireAuth, (req, res) => {
    console.log('📋 Acessando página de tarefas...');
    const tarefasSimuladas = [
        { id: 1, titulo: 'Configurar ambiente', concluida: true, data: '2024-01-01' },
        { id: 2, titulo: 'Criar rotas', concluida: true, data: '2024-01-02' },
        { id: 3, titulo: 'Implementar funcionalidades', concluida: false, data: '2024-01-03' }
    ];
    
    res.render('tarefas', {
        title: 'Gerenciador de Tarefas',
        description: 'Gerencie suas tarefas de forma eficiente',
        tasks: tarefasSimuladas,
        usuario: usuarioLogado
    });
});

router.get('/dashboard', requireAuth, (req, res) => {
    console.log('📊 Acessando dashboard...');
    res.render('dashboard', {
        title: 'Dashboard - Estatísticas',
        description: 'Visualize as estatísticas das suas tarefas',
        usuario: usuarioLogado,
        totalUsuarios: usuariosCadastrados.length
    });
});

router.get('/perfil', requireAuth, (req, res) => {
    console.log('👤 Acessando perfil...');
    res.render('perfil', {
        title: 'Meu Perfil',
        description: 'Gerencie suas informações pessoais',
        usuario: usuarioLogado,
        dataCadastroFormatada: usuarioLogado.dataCadastro.toLocaleDateString('pt-BR'),
        totalUsuarios: usuariosCadastrados.length
    });
});

// ==========================================
// ROTA 404
// ==========================================

router.get('*', (req, res) => {
    console.log(`❌ Página não encontrada: ${req.originalUrl}`);
    res.status(404).render('404', {
        title: 'Página não encontrada',
        description: 'A página que você procura não existe',
        requestedUrl: req.originalUrl
    });
});

module.exports = router;