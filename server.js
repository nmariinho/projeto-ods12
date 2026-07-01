const express = require('express');
const cors = require('cors');
const fs = require('fs'); // <-- ler e salvar arquivos
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// arquivos que vão funcionar como "Banco de Dados"
const PONTOS_FILE = path.join(__dirname, 'pontos.json');
const USUARIOS_FILE = path.join(__dirname, 'usuarios.json');

// ler dados dos arquivos JSON com segurança
const lerArquivo = (caminhoArquivo, dadosIniciais = []) => {
    try {
        if (!fs.existsSync(caminhoArquivo)) {
            fs.writeFileSync(caminhoArquivo, JSON.stringify(dadosIniciais, null, 2));
            return dadosIniciais;
        }
        const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
        return JSON.parse(dados);
    } catch (error) {
        console.error(`Erro ao ler o arquivo ${caminhoArquivo}:`, error);
        return dadosIniciais;
    }
};

// salvar dados nos arquivos JSON
const salvarArquivo = (caminhoArquivo, dados) => {
    try {
        fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2));
    } catch (error) {
        console.error(`Erro ao salvar no arquivo ${caminhoArquivo}:`, error);
    }
};

// caso o arquivo de pontos esteja vazio 
const pontosIniciais = [
    {
        id: 1,
        nome: "Ecoponto Central",
        cep: "12345-678",
        endereco: "Av. Principal, 100 - Centro",
        tipoResiduo: "Eletrônicos e Pilhas"
    },
    {
        id: 2,
        nome: "Recicla Bairro",
        cep: "98765-432",
        endereco: "Rua da Reciclagem, 50 - Vila Verde",
        tipoResiduo: "Óleo de Cozinha e Plástico"
    }
];

// ==================== ROTAS DE PONTOS DE COLETA ====================

// Buscar todos os pontos (Lê do arquivo pontos.json)
app.get('/api/pontos', (req, res) => {
    const pontosColeta = lerArquivo(PONTOS_FILE, pontosIniciais);
    res.json(pontosColeta);
});

// Cadastra um novo ponto (Salva permanentemente no arquivo pontos.json)
app.post('/api/pontos', (req, res) => {
    const { nome, cep, endereco, address, tipoResiduo } = req.body;
    const pontosColeta = lerArquivo(PONTOS_FILE, pontosIniciais);
    
    const novoPonto = {
        id: pontosColeta.length > 0 ? Math.max(...pontosColeta.map(p => p.id)) + 1 : 1,
        nome,
        cep,
        endereco: endereco || address,
        tipoResiduo
    };
    
    pontosColeta.push(novoPonto);
    salvarArquivo(PONTOS_FILE, pontosColeta);
    
    res.status(201).json(novoPonto);
});

// ADICIONADA ROTA DE ATUALIZAR (PUT) PARA O CRUD FUNCIONAR COMPLETO
app.put('/api/pontos/:id', (req, res) => {
    const idParaEditar = parseInt(req.params.id);
    const { nome, cep, endereco, address, tipoResiduo } = req.body;
    let pontosColeta = lerArquivo(PONTOS_FILE, pontosIniciais);

    const indice = pontosColeta.findIndex(p => p.id === idParaEditar);

    if (indice === -1) {
        return res.status(404).json({ error: "Ponto de coleta não encontrado." });
    }

    // Atualiza os dados mantendo o mesmo ID
    pontosColeta[indice] = {
        id: idParaEditar,
        nome,
        cep,
        endereco: endereco || address,
        tipoResiduo
    };

    salvarArquivo(PONTOS_FILE, pontosColeta);
    res.json(pontosColeta[indice]);
});

// Deletar um ponto permanentemente
app.delete('/api/pontos/:id', (req, res) => {
    const idParaDeletar = parseInt(req.params.id);
    let pontosColeta = lerArquivo(PONTOS_FILE, pontosIniciais);
    
    pontosColeta = pontosColeta.filter(ponto => ponto.id !== idParaDeletar);
    salvarArquivo(PONTOS_FILE, pontosColeta);
    
    console.log(`Ponto com ID ${idParaDeletar} deletado permanentemente.`);
    res.status(204).send();
});


// ==================== ROTAS DE USUÁRIOS ====================

// Cadastrar Usuário (Salva permanentemente no arquivo usuarios.json)
app.post('/api/usuarios', (req, res) => {
    const { nome, email, senha, telefone, city, cidade } = req.body;
    const usuarios = lerArquivo(USUARIOS_FILE, []);

    // Validação simples para evitar cadastrar e-mails duplicados
    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) {
        return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }

    const novoUsuario = {
        id: usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1,
        nome,
        email,
        senha, 
        telefone,
        cidade: cidade || city
    };

    usuarios.push(novoUsuario);
    salvarArquivo(USUARIOS_FILE, usuarios);

    console.log(`Usuário ${nome} cadastrado e salvo permanentemente.`);
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!", usuarioId: novoUsuario.id });
});

// CORREÇÃO: ROTA DE LOGIN NO LOCAL CERTO E COM AS FUNÇÕES CORRETAS
app.post('/api/usuarios/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    // função correta do arquivo original
    const usuarios = lerArquivo(USUARIOS_FILE, []);

    // Procura o usuário pelo e-mail
    const usuarioEncontrado = usuarios.find(u => u.email === email);

    if (!usuarioEncontrado) {
        return res.status(400).json({ error: "E-mail não cadastrado. Crie uma conta!" });
    }

    // Verifica se a senha está correta
    if (usuarioEncontrado.senha !== senha) {
        return res.status(400).json({ error: "Senha incorreta. Tente novamente." });
    }

    res.json({ message: "Login bem-sucedido!", usuario: { nome: usuarioEncontrado.nome, email: usuarioEncontrado.email } });
});

// Listar usuários cadastrados 
app.get('/api/usuarios', (req, res) => {
    const usuarios = lerArquivo(USUARIOS_FILE, []);
    res.json(usuarios);
}); 

// Verifica se é o arquivo principal e sobe o servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app; 