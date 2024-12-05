const express = require('express')
const cors = require('cors')
const mysqlx = require('@mysql/xdevapi')
const bcrypt = require('bcrypt') //para criptografar as senhas dos usuários
const jwt = require('jsonwebtoken') //token para deixar o usuário logado
const multer = require('multer') //para baixar as imagens inseridas pelo usuário
const path = require('path');

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

// Configuração do multer para salvar arquivos na pasta "images"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'front', 'images')); // Define a pasta de destino
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${file.originalname}`; // Gera um nome único para evitar conflitos
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

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
        })
}

app.get('/horarios', async (req, res) => {
    try {
        // Conecta ao MySQL
        const session = await mysqlx.getSession(config)

        // Executa a consulta
        const resultado = await session.sql('SELECT tbDiasSemana.diaSemana, tbHorarios.horarioVoluntarios, tbEnderecos.estacao, tbHorarios.idHorario FROM tbDiasSemana JOIN tbHorarios ON tbDiasSemana.idDiaSemana = tbHorarios.idDiaSemana JOIN tbEnderecos ON tbHorarios.idEndereco = tbEnderecos.idEndereco ORDER BY tbHorarios.idDiaSemana DESC').execute()

        // Converte o resultado em array
        const horarios = resultado.fetchAll().map(horario => ({
            diaSemana: horario[0],
            horarioVoluntarios: horario[1],
            estacao: horario[2],
            idHorario: horario[3]
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

app.get('/posts', upload.single('imagem'), async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)
        const resultados = await session.sql('SELECT tl.apelido, tp.idPostagem, tp.postagem, tp.caminhoImagem, tp.dia, tp.horario FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 2 ORDER BY tp.idPostagem DESC').execute()

        const posts = resultados.fetchAll().map(post => ({
            apelido: post[0],
            idPost: post[1],
            postagem: post[2],
            imagemPost: post[3],
            data: post[4],
            horario: post[5],
            resposta: []
        }))

        for (let post of posts) {
            let idPost = post.idPost
            let resultados2 = await session.sql('SELECT tl.apelido, tp.postagem, tp.caminhoImagem, tp.dia, tp.horario FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 3 AND tp.idPostagemResp = ?').bind(idPost).execute()

            let respostas = resultados2.fetchAll().map(resposta => ({
                apelido: resposta[0],
                postagem: resposta[1],
                imagemPost: resposta[2],
                data: resposta[3],
                horario: resposta[4]
            }))

            post.resposta = respostas
        }

        res.json(posts)

        await session.close()
    }
    catch (e) {
        console.error("Erro ao buscar posts:", e)
        res.status(500).json({ e: "Erro ao buscar posts" })
    }
})

app.post('/uploadForum', upload.single('imagem'), async (req, res) => {
    try {
        const idPost = req.body.idPost; // Certifique-se de que o nome está correto no frontend
        if (!idPost) {
            return res.status(400).send({ message: "ID do post é obrigatório." });
        }

        if (!req.file) {
            return res.status(400).send({ message: "Nenhuma imagem foi enviada." });
        }

        const caminhoFoto = `/images/${req.file.filename}`;
        const tipoArquivo = req.file.mimetype;

        const session = await mysqlx.getSession(config);

        // Atualiza o post com o caminho da imagem
        await session.sql('UPDATE tbPostagens SET caminhoImagem = ?, tipo = ? WHERE idPostagem = ?')
            .bind(caminhoFoto, tipoArquivo, idPost)
            .execute();

        await session.close();
        res.status(200).send({ message: "Imagem enviada com sucesso!" });
    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).send("Erro ao salvar a imagem.");
    }
});

app.get('/topico', async (req, res) => {
    try {
        console.log ('entrei no try')
        const session = await mysqlx.getSession(config)
        const resultado = await session.sql('select idTopicoDesafios, topicoDesafio from tbTopicosDesafios').execute()
        console.log ('entrei no try2')

        const topicosDesafios = resultado.fetchAll().map(desafio => ({
            idtopicoDesafios: desafio[0],
            topicoDesafios: desafio[1]
        }))
        console.log (topicosDesafios)
        res.json(topicosDesafios)
        await session.close()
    }
    catch (e) {
      console.log("Erro ao pegar topicos")
    }
})

app.post('/desafios', async (req, res) => {
    try {
        const enunciado = req.body.enunciado
        const respostacorreta = req.body.respostacorreta
        const resposta1 = req.body.resposta1
        const resposta2 = req.body.resposta2
        const resposta3 = req.body.resposta3
        const resposta4 = req.body.resposta4
        const resolucao = req.body.resolucao
        const select = req.body.select
        const session = await mysqlx.getSession(config)
        await session.sql('Insert into tbDesafios (idTopicoDesafios, questao, respostaCorreta, respostaIncorreta1, respostaIncorreta2, respostaIncorreta3, respostaIncorreta4, resolucao) values(?, ?, ?, ?, ?, ?, ?, ?)').bind(select, enunciado, respostacorreta, resposta1, resposta2, resposta3, resposta4, resolucao).execute()
        res.status(200).send('Desafio enviado com sucesso!')
        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao enviar os dados.')
    }
})
app.post('/topico', async (req, res) => {
    try {
        const topico = req.body.topico
        const session = await mysqlx.getSession(config)
        await session.sql('insert into tbTopicosDesafios (topicoDesafio) values (?)').bind(topico).execute()
        res.status(200).send('Topico salvo!')
        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar o topico.')
    }
})


app.post('/posts', async (req, res) => {
    try {
        const postagem = req.body.postagem
        const idLogin = req.body.idLogin
        const idTipoPostagem = req.body.idTipoPostagem
        const horario = req.body.horario
        const data = req.body.data

        // Conecta ao MySQL
        const session = await mysqlx.getSession(config)

        //Registra a alternativa marcada no banco de dados
        await session.sql('INSERT INTO tbPostagens(postagem, idLogin, idTipoPostagem, dia, horario) VALUES (?, ?, ?, ?, ?)').bind(postagem, idLogin, idTipoPostagem, data, horario).execute()

        const idPostagem = (await (session.sql('SELECT idPostagem FROM tbPostagens WHERE postagem = ?').bind(postagem).execute())).fetchOne()

        res.status(200).send({ message: "Post enviado com sucesso!", idPost: idPostagem })

        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.')
    }
})

app.post('/respostas', async (req, res) => {
    try {
        const postagem = req.body.postagem
        const idLogin = req.body.idLogin
        const idTipoPostagem = req.body.idTipoPostagem
        const idPostagemResp = req.body.idPostagemResp
        const data = req.body.data
        const horario = req.body.horario

        // Conecta ao MySQL
        const session = await mysqlx.getSession(config)

        //Registra a resposta do usuário no banco de dados
        const result = await session.sql('INSERT INTO tbPostagens(postagem, idLogin, idTipoPostagem, idPostagemResp, dia, horario) VALUES (?, ?, ?, ?, ?, ?)').bind(postagem, idLogin, idTipoPostagem, idPostagemResp, data, horario).execute()

        const idPostagem = result.getAutoIncrementValue()

        res.status(200).send({ message: "Post enviado com sucesso!", idPost: idPostagem })

        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.')
    }
})

app.get('/avisos', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)

        const resultados = await session.sql('SELECT tl.apelido, tp.idPostagem, tp.postagem, tp.caminhoImagem, tp.dia, tp.horario FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 1 ORDER BY tp.idPostagem DESC').execute()

        const avisos = resultados.fetchAll().map(aviso => ({
            apelido: aviso[0],
            idAviso: aviso[1],
            postagem: aviso[2],
            imagemPost: aviso[3],
            data: aviso[4],
            horario: aviso[5],
            resposta: []
        }))

        for (let aviso of avisos) {
            let idAviso = aviso.idAviso
            let resultados2 = await session.sql('SELECT tl.apelido, tp.postagem, tp.caminhoImagem, tp.dia, tp.horario FROM tbPostagens as tp JOIN tbLogins as tl on tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 3 AND tp.idPostagemResp = ?').bind(idAviso).execute()

            let respostas = resultados2.fetchAll().map(resposta => ({
                apelido: resposta[0],
                postagem: resposta[1],
                imagemPost: resposta[2],
                data: resposta[3],
                horario: resposta[4]
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

app.get('/enderacoes', async (req, res) => {
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
        await session.close()
    }
    catch (e) {
        console.log("Erro ao pegar a estação")
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
        res.json(topicosDesafio)

        await session.close()
    }
    catch (e) {
        console.error("Erro ao buscar desafios:", e)
        res.status(500).json({ error: "Erro ao buscar desafios" })
    }
})

app.get('/mensagens', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config)
        const resultado = await session.sql('SELECT nomeCompleto, email, duvida FROM tbContato').execute()

        const mensagens = resultado.fetchAll().map(mensagem => ({
            nomeCompleto: mensagem[0],
            email: mensagem[1],
            duvida: mensagem[2]
        }))

        await session.close()
        res.json(mensagens)
    }
    catch (e) {
        console.log("Erro ao pegar a mensagem")
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
        res.status(200).send('Atualização realizada com sucesso!')

        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao atualizar os dados.')
    }
})

app.post('/enderacoes', async(req, res) => {
    try {
        const estacao = req.body.estacao
        const session = await mysqlx.getSession(config) 

        const respSQL = await session.sql("DELETE FROM tbEnderecos where estacao = ?").bind(estacao).execute()
        console.log(respSQL)
        res.status(200).send('Apagado com sucesso!')

        await session.close()
    }
    catch (e) {
        console.error(e);
        res.status(500).send('Erro ao apagar os dados.')
    
    }
})

app.post('/enderecos', async (req, res) => {
    try {
        const postEnderecos = req.body.postEnderecos
        console.log(postEnderecos)
        const postEstacoes = req.body.postEstacoes
        console.log(postEstacoes)
        const session = await mysqlx.getSession(config)
        await session.sql('insert into tbEnderecos (endereco, estacao) values (?, ?)').bind(postEnderecos, postEstacoes).execute()
        res.status(200).send('Estação salva com sucesso!')
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
        res.status(500).send('Erro ao atualizar os dados.')
    }
})

app.post('/horarios', async (req,res) => {
    try {
        const diaSemanaInput = req.body.diaSemana
        const horarioInput = req.body.horario
        const estacaoInput = req.body.estacao
        const session = await mysqlx.getSession(config)
        const endereco = (await session.sql('SELECT idEndereco FROM tbEnderecos WHERE estacao = ?').bind(estacaoInput).execute()).fetchOne()
        await session.sql('insert into tbHorarios(idDiaSemana, horarioVoluntarios, idEndereco) values(?, ?, ?)').bind(diaSemanaInput, horarioInput, endereco).execute()
        await session.close()
    }
    catch (e) {
        console.log('erro nos horários')
    }
})

app.post('/horarioss', async (req,res) => {
    try {
    let idHorario = req.body.idHorario
    const session = await mysqlx.getSession(config)
    const resultado = await session.sql('DELETE FROM tbHorarios where idHorario = ?').bind(idHorario).execute()
    await session.close()
    }
    catch(e) {
        console.log('erro ao apagar os horários')
    }
})

// Cadastrando usuários no banco de dados
app.post('/cadastro', async (req, res) => {
    try {
        const email = req.body.email
        const senha = req.body.senha
        const apelido = req.body.apelido
        const idTipoLogin = req.body.idTipoLogin

        // Criptografando a senha para inserir no banco de dados
        const senha_criptografada = await bcrypt.hash(senha, 10)

        const session = await mysqlx.getSession(config)
        await session.sql('insert into tbLogins (email, senha, apelido, idTipoLogin) values (?, ?, ?, ?)').bind(email, senha_criptografada, apelido, idTipoLogin).execute()
        res.status(201).send('Usuário cadastrado')

        await session.close()
    }
    catch (e) {
        console.log(e)
        res.status(409).end()
    }

})
// Validando usuário para fazer login
app.post('/login', async (req, res) => {
    const email = req.body.email
    const senha = req.body.senha

    try {
        const session = await mysqlx.getSession(config)
        const validacaoLoginExiste = await session.sql('select idLogin, email, senha, idTipoLogin from tbLogins where email = ?').bind(email).execute()
        // Converte o resultado em Array
        const login = validacaoLoginExiste.fetchOne()

        if (login) {
            senhaCriptografada = login[2]
            const senhaValida = await bcrypt.compare(senha, senhaCriptografada)
            if (senhaValida) {
                console.log("Usuário logado!")

                const dados = { idLogin: login[0], idTipoLogin: login[3] }

                res.json(dados)
            } else {
                return res.status(401).json({ mensagem: "Senha inválida" })
            }
        } else {
            return res.status(401).json({ mensagem: "Email inválido" })
        }
        await session.close()
    }
    catch (e) {
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