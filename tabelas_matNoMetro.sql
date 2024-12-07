create database matNoMetro;
use matNoMetro;

-- a tabela tbTiposLogins serve para separar os logins de voluntáios do login de outros usuários comuns
create table tbTiposLogins (
	idTipoLogin int PRIMARY KEY NOT NULL, 
    tipoLogin varchar(200) NOT NULL);

create table tbLogins (
	idLogin int PRIMARY KEY auto_increment NOT NULL, 
    email varchar(200) UNIQUE NOT NULL,
    senha varchar(200) NOT NULL,
    apelido varchar(200) UNIQUE NOT NULL,
    idTipoLogin int NOT NULL,
    FOREIGN KEY (idTipoLogin) REFERENCES tbTiposLogins(idTipoLogin));
    
create table tbDiasSemana (
	idDiaSemana int PRIMARY KEY NOT NULL,
    diaSemana varchar(200) NOT NULL);

create table tbHorarios (
	idHorario int PRIMARY KEY auto_increment NOT NULL,
    idDiaSemana int NOT NULL,
    horarioVoluntarios varchar(200) NOT NULL,
    idEndereco int NOT NULL,
    FOREIGN KEY (idDiaSemana) REFERENCES tbDiasSemana(idDiaSemana),
    FOREIGN KEY (idEndereco) REFERENCES tbEnderecos(idEndereco));
        
create table tbEnderecos (
	idEndereco int PRIMARY KEY auto_increment NOT NULL,
    estacao varchar (200) NOT NULL,
    endereco mediumtext NOT NULL);
    
-- a tabela tbTiposPostagem serve para diferenciar os diferentes tipos de postagem existentes no fórum: avisos, posts novos e respostas
create table tbTiposPostagem (
	idTipoPostagem int PRIMARY KEY NOT NULL,
    tipoPostagem varchar(200) NOT NULL);

-- na tabela tbPostagens, não é obrigatório obter caminhoImagem, tipo, nem idPostagemResp porque os usuários podem enviar mensagens sem fotos ou fazer uma publicação nova, ao invés de responder uma existente
create table tbPostagens (
	idPostagem int PRIMARY KEY auto_increment NOT NULL, 
    postagem  mediumtext NOT NULL, 
    caminhoImagem mediumtext,
    dia varchar(10) NOT NULL,
    horario varchar(5) NOT NULL,
    idLogin int NOT NULL, 
    idTipoPostagem int NOT NULL,
    idPostagemResp int,
    tipo varchar(255),
    FOREIGN KEY (idLogin) REFERENCES tbLogins(idLogin),
    FOREIGN KEY (idTipoPostagem) REFERENCES tbTiposPostagem(idTipoPostagem),
    FOREIGN KEY (idPostagemResp) REFERENCES tbPostagens(idPostagem));

create table tbTopicosDesafios (
idTopicoDesafios int auto_increment PRIMARY KEY, 
topicoDesafio varchar (100));

-- na tabela tbDesafios, não é obrigatório obter imagemURL, nem respostaIncorreta4 porque alguns exercícios não possuem uma imagem e outros só têm quatro alternativas de resposta
create table tbDesafios (
idTopicoDesafios int NOT NULL,
idQuestao int auto_increment PRIMARY KEY,
questao mediumtext NOT NULL,
imagemURL mediumtext,
respostaCorreta mediumtext NOT NULL,
respostaIncorreta1 mediumtext NOT NULL,
respostaIncorreta2 mediumtext NOT NULL,
respostaIncorreta3 mediumtext NOT NULL,
respostaIncorreta4 mediumtext,
resolucao mediumtext,
porcentagemRespCorreta int default 0,
porcentagemRespIncorreta1 int DEFAULT 0,
porcentagemRespIncorreta2 int DEFAULT 0,
porcentagemRespIncorreta3 int DEFAULT 0,
porcentagemRespIncorreta4 int DEFAULT 0,
FOREIGN KEY (idTopicoDesafios) REFERENCES tbTopicosDesafios (idTopicoDesafios));

create table tbContato (
idDuvida int auto_increment PRIMARY KEY,
nomeCompleto mediumtext NOT NULL,
email mediumtext NOT NULL,
duvida mediumtext NOT NULL);
    