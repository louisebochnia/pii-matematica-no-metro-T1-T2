const express = require('express')
const cors = require('cors')
const mysqlx = require('@mysql/xdevapi')

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())
const bcrypt = require('bcrypt') //para criptografar as senhas dos usuários
const jwt = require('jsonwebtoken') //token para deixar o usuário logado

const config = {
    password: 'AVNS_7NP1Lp7jYXOoEog6j1C',
    user: 'avnadmin',
    host: 'mysql-31de77e0-matnometrot1t2-7d69.c.aivencloud.com',
    port: 18549,
    schema: 'matNoMetro'
}

async function conectarAoMySQL() {
    mysqlx.getSession(config)
        .then(session => {
            console.log(session.inspect())
        });
}

app.get('/horarios', async (req, res) => {
    try {
        // Conecta ao MySQL
        const session = await mysqlx.getSession(config) 

        // Executa a consulta
        const resultado = await session.sql('SELECT tbDiasSemana.diaSemana, tbHorarios.horarioVoluntarios, tbEnderecos.estacao FROM tbDiasSemana JOIN tbHorarios ON tbDiasSemana.idDiaSemana = tbHorarios.idDiaSemana JOIN tbEnderecos ON tbHorarios.idEndereco = tbEnderecos.idEndereco ORDER BY tbHorarios.idDiaSemana DESC').execute()

        // Converte o resultado em array
        const horarios = resultado.fetchAll().map(horario => ({
            diaSemana: horario[0],
            horarioVoluntarios: horario[1],
            estacao: horario[2]
        }))

        // Envia os horários como resposta em formato JSON
        res.json(horarios)
        await session.close()
    } 
    catch (e) {
        console.error("Erro ao buscar horários:", e)
        res.status(500).json({ e: "Erro ao buscar horários" })
    }
})

app.get('/posts', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)
        const resultados = await session.sql('SELECT tl.apelido, tp.idPostagem, tp.postagem, tp.imagemPost FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 2 ORDER BY tp.idPostagem DESC').execute()
        
        const posts = resultados.fetchAll().map(post => ({
            apelido: post[0],
            idPost: post[1],
            postagem: post[2],
            imagemPost: post[3],
            resposta: []
        }))

        for (let post of posts){
            let idPost = post.idPost
            let resultados2 = await session.sql('SELECT tl.apelido, tp.postagem, tp.imagemPost FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 3 AND tp.idPostagemResp = ?').bind(idPost).execute()

            let respostas = resultados2.fetchAll().map(resposta => ({
                apelido: resposta[0],
                postagem: resposta[1],
                imagemPost: resposta[2]
            }))
            
            post.resposta = respostas
        }

        res.json(posts)
        await session.close()
    }
    catch (e){
        console.error("Erro ao buscar posts:", e)
        res.status(500).json({ e: "Erro ao buscar posts" })
    }
})

app.get ('/avisos', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)
        const resultados = await session.sql('SELECT tl.apelido, tp.idPostagem, tp.postagem, tp.imagemPost FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 1 ORDER BY tp.idPostagem DESC').execute()
        
        const avisos = resultados.fetchAll().map(aviso => ({
            apelido: aviso[0],
            idAviso: aviso[1],
            postagem: aviso[2],
            imagemPost: aviso[3],
            resposta: []
        }))

        for (let aviso of avisos){
            let idAviso = aviso.idAviso
            let resultados2 = await session.sql('SELECT tl.apelido, tp.postagem, tp.imagemPost FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 3 AND tp.idPostagemResp = ?').bind(idAviso).execute()

            let respostas = resultados2.fetchAll().map(resposta => ({
                apelido: resposta[0],
                postagem: resposta[1],
                imagemPost: resposta[2]
            }))
            
            aviso.resposta = respostas
        }
        
        res.json(avisos)
        await session.close()
    }
    catch (e){
        console.error("Erro ao buscar avisos:", e)
        res.status(500).json({ e: "Erro ao buscar avisos" })
    }
})

app.get('/enderecos', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)

        const resultado = await session.sql('SELECT estacao, endereco FROM tbEnderecos ORDER BY estacao').execute()

        const enderecos = resultado.fetchAll().map(endereco => ({
            estacao: endereco[0],
            enderecoEstacao: endereco[1]
        }))

        res.json(enderecos)
        await session.close()
    } 
    catch (e) {
        console.error("Erro ao buscar endereços:", e)
        res.status(500).json({ e: "Erro ao buscar endereços" })
    }
})

app.get('/estacao', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)
        const resultado = await session.sql('select estacao from tbEnderecos').execute()

        const estacoes = resultado.fetchAll().map(estacao => ({
            estacao: estacao[0]
        }))

        res.json(estacoes)
        await session.close(e)
    }
    catch (e) {
      console.log("Erro ao pegar a estação")
    }
})

app.get('/desafios', async(req, res) => {
    try {
        const session = await mysqlx.getSession(config) // Conecta ao MySQL

        //Pega os tópicos dos desafios
        const resultado = await session.sql('SELECT * FROM tbTopicosDesafios').execute()

        const topicosDesafio = resultado.fetchAll().map(topicoDesafio => ({
            id: topicoDesafio[0],
            topico: topicoDesafio[1],
            desafio: []
        }))

        for (let topicoDesafio of topicosDesafio){
            // Executa a consulta, vinculando o idTopicoDesafio no lugar do ?
            const resultado2 = await session.sql('SELECT d.idQuestao, d.questao, d.imagemURL, d.respostaCorreta, d.resolucao, d.porcentagemRespCorreta, d.porcentagemRespIncorreta1, d.porcentagemRespIncorreta2, d.porcentagemRespIncorreta3, d.porcentagemRespIncorreta4 FROM tbDesafios as d JOIN tbTopicosDesafios as td ON td.idTopicoDesafios = d.idTopicoDesafios WHERE td.idTopicoDesafios = ?').bind(topicoDesafio.id).execute()
            
            // Converte o resultado em array
            const desafios = resultado2.fetchAll().map(desafio => ({
                idQuestao: desafio[0],
                questao: desafio[1],
                imagemURL: desafio[2],
                respostaCorreta: desafio[3],
                alternativas: [],
                resolucao: desafio[4],
                porcentagemRespCorreta: desafio[5],
                porcentagemRespIncorretas: [
                    desafio[6],
                    desafio[7],
                    desafio[8],
                    desafio[9]
                ]
            }))

            for (let desafio of desafios) {
                const resultado3 = await session.sql('SELECT respostaCorreta, respostaIncorreta1, respostaIncorreta2, respostaIncorreta3, respostaIncorreta4 FROM tbDesafios WHERE idQuestao = ?').bind(desafio.idQuestao).execute()

                desafio.alternativas = resultado3.fetchOne()
            }

            topicoDesafio.desafio = desafios
        }

        // Envia os desafios como resposta em formato JSON
        res.json(topicosDesafio);
        await session.close()
    } 
    catch (e) {
        console.error("Erro ao buscar desafios:", e)
        res.status(500).json({ error: "Erro ao buscar desafios" })
    }
})

app.post('/desafios', async(req, res) => {
    try {
        const idQuestao = req.body.idQuestao
        const assinalada = req.body.assinalada
        const quantidade = req.body.quantidade

        const query =`UPDATE tbDesafios SET ${assinalada} = ? WHERE idQuestao = ?`

        // Conecta ao MySQL
        const session = await mysqlx.getSession(config) 

        //Registra a alternativa marcada no banco de dados
        const respSQL = await session.sql(query).bind(quantidade, idQuestao).execute()
        console.log(respSQL)
        res.status(200).send('Atualização realizada com sucesso!')
        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.')
    }
})

// Postar uma dúvida na página contato
app.post('/contato', async (req, res) => {
    try {
        const nomeCompleto = req.body.nomeCompleto
        const emailContato = req.body.emailContato
        const mensagemContato = req.body.mensagemContato
        const session = await mysqlx.getSession(config)
        await session.sql('insert into tbContato (nomeCompleto, email, duvida) values (?, ?, ?)').bind(nomeCompleto, emailContato, mensagemContato).execute()
        res.status(200).send('Mensagem enviada com sucesso!')
        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.');
    }
})

app.post('/horarios', async (req,res) => {
    try {
        const diaSemanaInput = req.body.diaSemana
        const horarioInput = req.body.horario
        const estacaoInput = req.body.estacao
        const session = await mysqlx.getSession(config)
        const diaSemana = await session.sql('SELECT idDiaSemana FROM tbDiasSemana WHERE diaSemana = ?').bind(diaSemanaInput).execute()
        const endereco = await session.sql('SELECT idEndereco FROM tbEnderecos WHERE estacao = ?').bind(estacaoInput).execute()
        await session.sql('insert into tbHorarios(idDiaSemana, horarioVoluntarios, idEndereco) values(?, ?, ?)').bind(diaSemana, horarioInput, endereco).execute()
        await session.close()
    }
    catch(e) {
        console.log('erro nos horários')
    }
})

// Cadastrando usuários no banco de dados
app.post('/cadastro', async(req, res) => {
    try{
        const email = req.body.email
        const senha = req.body.senha
        const apelido = req.body.apelido
        const idTipoLogin = req.body.idTipoLogin
        
        // Criptografando a senha para inserir no banco de dados
        const senha_criptografada = await bcrypt.hash(senha, 10)
        const usuario = new Usuario ({email: email, senha: senha_criptografada, apelido: apelido, idTipoLogin: idTipoLogin})
        
        const session = await mysqlx.getSession(config)
        await session.sql('insert into tbLogins (email, senha, apelido, idTipoLogin) values (?, ?, ?, ?)').bind(email, senha_criptografada, apelido, idTipoLogin).execute()
        res.status(201).send('Usuário cadastrado')
        await session.close()
    }
    catch(e) {
        console.log(e)
        res.status(409).end()
    }
    
})
// Validando usuário para fazer login
app.post('/login', async(req, res) => {
    const email = req.body.email
    const senha = req.body.senha

    try{
        const session = await mysqlx.getSession(config)
        const validacaoLogin = await session.sql('select idLogin, email, senha, idTipoLogin from tbLogins where email = ?').bind(email).execute()
        // Converte o resultado em Array
        const logins = resultado.fetchAll().map(login => ({
            idLogin: login[0],
            email: login[1],
            senha: login[2],
            idTipoLogin: login[3]
        }))

        if(validacaoLogin){
            const senhaValida = await bcrypt.compare(senha, login.senha)
            if(senhaValida){
                console.log("Usuário logado!")
            }else{
                return res.status(401).json({mensagem: "Senha inválida"})
            }
        }else{
            return res.status(401).json({mensagem: "Email inválido"})
        }
        await session.close()
    }
    catch(e){
        console.log(e)
    }
})

app.listen(3000, () => {
    try {
        conectarAoMySQL()
        console.log("server up & running, conexão ok")
    }
    catch (e) {
        console.log('erro de conexão', e)
    }
    
})