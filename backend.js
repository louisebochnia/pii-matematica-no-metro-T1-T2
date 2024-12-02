const express = require('express')
const cors = require('cors')
const mysqlx = require('@mysql/xdevapi')

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())
const bcrypt = require('bcrypt') //para criptografar as senhas dos usuários

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

        for (let post of posts) {
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
    }
    catch (e) {
        console.error("Erro ao buscar posts:", e)
        res.status(500).json({ e: "Erro ao buscar posts" })
    }
})

app.get('/avisos', async (req, res) => {
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

        for (let aviso of avisos) {
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
    catch (e) {
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
    }
    catch (e) {
        console.error("Erro ao buscar endereços:", e)
        res.status(500).json({ e: "Erro ao buscar endereços" })
    }
})

app.get('/desafios', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config) // Conecta ao MySQL

        //Pega os tópicos dos desafios
        const resultado = await session.sql('SELECT * FROM tbTopicosDesafios').execute()

        const topicosDesafio = resultado.fetchAll().map(topicoDesafio => ({
            id: topicoDesafio[0],
            topico: topicoDesafio[1],
            desafio: []
        }))

        for (let topicoDesafio of topicosDesafio) {
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
    }
    catch (e) {
        console.error("Erro ao buscar desafios:", e)
        res.status(500).json({ error: "Erro ao buscar desafios" })
    }
})

app.post('/desafios', async (req, res) => {
    try {
        const idQuestao = req.body.idQuestao
        const assinalada = req.body.assinalada
        const quantidade = req.body.quantidade

        const query = `UPDATE tbDesafios SET ${assinalada} = ? WHERE idQuestao = ?`

        // Conecta ao MySQL
        const session = await mysqlx.getSession(config)

        //Registra a alternativa marcada no banco de dados
        const respSQL = await session.sql(query).bind(quantidade, idQuestao).execute()
        console.log(respSQL)
        res.status(200).send('Atualização realizada com sucesso!');
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.');
    }
})

// Cadastrando usuários no banco de dados
app.post('/cadastro', async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password

        const password_criptografada = await bcrypt.hash(password, 10)

        const usuario = new Usuario({ login: login, password: password_criptografada })
        const respMongo = await usuario.save()
        console.log(respMongo)
        //para dar o status de q deu certo
        res.status(201).end()
    }
    catch (e) {
        console.log(e)
        res.status(409).end()
    }

})
// Validando usuário para fazer login
app.post('/login', async (req, res) => {
    const login = req.body.login
    const password = req.body.password

    const usuarioExiste = await Usuario.findOne({ login: login })
    if (!usuarioExiste) {
        return res.status(401).json({ mensagem: "Login inválido" })
    }
    const senhaValida = await bcrypt.compare(password, usuarioExiste.password)

    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Senha inválida" })
    }
    //daqui a pouco voltamos
    res.end()
})

app.post('/contato', async (req, res) => {
    try {
        const nomeCompleto = req.body.nomeCompleto
        const emailContato = req.body.emailContato
        const mensagemContato = req.body.mensagemContato
        const session = await mysqlx.getSession(config)
        await session.sql('insert into tbContato (nomeCompleto, email, duvida) values (?, ?, ?)').bind(nomeCompleto, emailContato, mensagemContato).execute()
        res.status(200).send('Mensagem enviada com sucesso!')
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.');
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