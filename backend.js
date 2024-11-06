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
}

app.get('/horarios', async (req, res) => {
    try {
        const session = await mysqlx.getSession(config); // Conecta ao MySQL

        // Executa a consulta
        const resultado = await session.sql('SELECT tbDiasSemana.diaSemana, tbHorarios.horarioVoluntarios FROM tbDiasSemana JOIN tbHorarios ON tbDiasSemana.idDiaSemana = tbHorarios.idDiaSemana ORDER BY tbHorarios.idDiaSemana DESC').execute();

        // Converte o resultado em array
        const horarios = resultado.fetchAll();

        // Envia os horários como resposta em formato JSON
        res.json(horarios);
    } 
    catch (error) {
        console.error("Erro ao buscar horários:", error);
        res.status(500).json({ error: "Erro ao buscar horários" });
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
    
})