const express = require('express')
const cors = require('cors')
const mysqlx = require('@mysql/xdevapi');

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

const tabelaHorarios = { schema: 'matNoMetro', table: 'tbHorarios', user: 'avnadmin' };

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
        const tbHorarios = session.getSchema(tabelaHorarios.schema).getTable(tabelaHorarios.table);

        // Executa a consulta
        const result = await tbHorarios.select('diaSemana', 'horarioVoluntarios').execute();

        // Converte o resultado em array
        const horarios = result.toArray();

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