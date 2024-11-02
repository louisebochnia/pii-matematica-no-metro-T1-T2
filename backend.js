const express = require('express')
const cors = require('cors')
const mysqlx = require('@mysql/xdevapi');

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

const connectionString = 'mysql://avnadmin:AVNS_7NP1Lp7jYXOoEog6j1C@mysql-31de77e0-matnometrot1t2-7d69.c.aivencloud.com:18545/defaultdb?ssl-mode=REQUIRED/matNoMetro'

const tabelaHorarios = { schema: 'matNoMetro', table: 'tbHorarios', user: 'avnadmin' };

async function conectarAoMySQL() {
    await mysqlx.getSession('mysql://avnadmin:AVNS_7NP1Lp7jYXOoEog6j1C@mysql-31de77e0-matnometrot1t2-7d69.c.aivencloud.com:18545/defaultdb?ssl-mode=REQUIRED/matNoMetro')
        .then(session => {
            console.log(session.inspect());
        });
}

app.listen(33060, () => {
    try {
        conectarAoMySQL()
        console.log("server up & running, conexão ok")
    }
    catch (e) {
        console.log('erro de conexão', e)
    }
})