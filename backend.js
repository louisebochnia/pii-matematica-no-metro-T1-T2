const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const bcrypt = require('bcrypt')

const app = express() //construindo uma aplicação express
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    host: 'mysql-2ea90144-matnometrot1t2-7d69.c.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_7NP1Lp7jYXOoEog6j1C',
    database: 'matNoMetro'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
});

// Rota para pegar as postagens da tabela
app.get('/forum', (req, res) => {
    const sql = 'SELECT tp.postagem, tp.imagemPost, tl.apelido FROM tbPostagens as tp JOIN tbLogins as tl ON tp.idLogin = tl.idLogin WHERE tp.idTipoPostagem = 2';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

const Respostas = mysql.json({

})