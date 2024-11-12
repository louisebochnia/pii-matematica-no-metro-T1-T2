const express = require('express')
const cors = require('cors')
const mysqlx = require('@mysql/xdevapi');

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

const tabelaHorarios = { schema: 'matNoMetro', table: 'tbHorarios', user: 'avnadmin' };
const tabelaDiasSemana = { schema: 'matNoMetro', table: 'tbDiasSemana', user: 'avnadmin' };

const config = {
    password: 'AVNS_7NP1Lp7jYXOoEog6j1C',
    user: 'avnadmin',
    host: 'mysql-31de77e0-matnometrot1t2-7d69.c.aivencloud.com',
    port: 18549,
    schema: 'matNoMetro'
};

async function conectarAoMySQL() {
    mysqlx.getSession(config)
        .then(session => {
            console.log(session.inspect());
        });
};

app.get('/horarios', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config) // Conecta ao MySQL

        // Executa a consulta
        const resultado = await session.sql('SELECT tbDiasSemana.diaSemana, tbHorarios.horarioVoluntarios FROM tbDiasSemana JOIN tbHorarios ON tbDiasSemana.idDiaSemana = tbHorarios.idDiaSemana ORDER BY tbHorarios.idDiaSemana DESC').execute()

        // Converte o resultado em array
        const horarios = resultado.fetchAll().map(horario => ({
            diaSemana: horario[0],
            horarioVoluntarios: horario[1]
        }))

        // Envia os horários como resposta em formato JSON
        res.json(horarios)
    } 
    catch (e) {
        console.error("Erro ao buscar horários:", e)
        res.status(500).json({ e: "Erro ao buscar horários" })
    }
});

app.get('/posts', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config); // Conecta ao MySQL
        const resultados = await session.sql('SELECT tl.apelido, tp.idPostagem, tp.postagem, tp.imagemPost FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 2').execute()
        
        const posts = resultados.fetchAll().map(post => ({
            apelido: post[0],
            idPost: post[1],
            postagem: post[2],
            imagemPost: post[3],
            resposta: []
        }))

        for (let post in posts){
            let idPost = post.idPost
            let resultados2 = await session.sql('SELECT tl.apelido, tp.postagem, tp.imagemPost FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 2 AND tp.idPostagemResp = ?').bind(idPost).execute()

            let respostas = resultados2.fetchAll().map(resposta => ({
                apelido: resposta[0],
                postagem: resposta[1],
                imagemPost: resposta[2]
            }))
            
            post.resposta = respostas
        }

        res.json(posts)
    }
    catch (e){
        console.error("Erro ao buscar horários:", e);
        res.status(500).json({ e: "Erro ao buscar horários" });
    }
});

app.get('/enderecos', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config) // Conecta ao MySQL

        // Executa a consulta
        const resultado = await session.sql('SELECT estacao, endereco FROM tbEnderecos ORDER BY estacao').execute()

        // Converte o resultado em array
        const enderecos = resultado.fetchAll().map(endereco => ({
            estacao: endereco[0],
            enderecoEstacao: endereco[1]
        }))

        // Envia os enderecos como resposta em formato JSON
        res.json(enderecos)
    } 
    catch (e) {
        console.error("Erro ao buscar endereços:", e)
        res.status(500).json({ e: "Erro ao buscar endereços" })
    }
});

app.get('/desafios', async(req, res) => {
    try {
        const session = await mysqlx.getSession(config) // Conecta ao MySQL

        // Recupera o ID do tópico de desafio a partir da requisição
        const idTopicoDesafio = req.query.idTopicoDesafio

        // Verifica se o idTopicoDesafio foi passado
        if (!idTopicoDesafio) {
            return res.status(400).json({ error: 'ID do tópico de desafio é obrigatório' })
        }

        // Executa a consulta, vinculando o idTopicoDesafio no lugar do ?
        const resultado = await session.sql('SELECT td.topicoDesafio, d.questao, d.imagemURL, d.respostaCorreta, d.respostaIncorreta1, d.respostaIncorreta2, d.respostaIncorreta3, d.respostaIncorreta4, d.resolucao FROM tbTopicosDesafios as td JOIN tbDesafios as d ON td.idTopicoDesafios = d.idTopicoDesafios WHERE td.idTopicoDesafios = ?').bind(idTopicoDesafio).execute()

        // Converte o resultado em array
        const desafios = resultado.fetchAll().map(desafio => ({
            topicoDesafio : desafio[0],
            questao: desafio[1],
            imagemURL: desafio[2],
            respostaCorreta: desafio[3],
            respostaIncorreta1: desafio[4],
            respostaIncorreta2: desafio[5],
            respostaIncorreta3: desafio[6],
            respostaIncorreta4: desafio[7],
            resolucao: desafio[8]
        }));

        // Envia os desafios como resposta em formato JSON
        res.json(desafios);
    } 
    catch (e) {
        console.error("Erro ao buscar desafios:", e);
        res.status(500).json({ error: "Erro ao buscar desafios" });
    }
});

app.listen(3000, () => {
    try {
        conectarAoMySQL()
        console.log("server up & running, conexão ok")
    }
    catch (e) {
        console.log('erro de conexão', e)
    }
    
});