const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function prepararPaginaInicial() {
    const horariosEndpoint = '/horarios'
    const URLcompletaHorarios = `${protocolo}${baseURL}${horariosEndpoint}`
    const horarios = (await axios.get(URLcompletaHorarios)).data
    console.log(horarios)
    exibirHorarios(horarios)
    const enderecosEndpoint = '/enderecos'
    const URLcompletaEnderecos = `${protocolo}${baseURL}${enderecosEndpoint}`
    const enderecos = (await axios.get(URLcompletaEnderecos)).data
    console.log(enderecos)
    exibirEnderecos(enderecos)
}


function exibirHorarios(horarios){
    let tabela = document.querySelector('#horarios')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""

    for (let horario of horarios){
        let linha = corpoTabela.insertRow(0)
        let celulaDiaSemana = linha.insertCell(0)
        let celulaHorarioVoluntarios = linha.insertCell(1)
        celulaDiaSemana.innerHTML = horario.diaSemana
        celulaHorarioVoluntarios.innerHTML = horario.horarioVoluntarios
        
    }
}

function exibirEnderecos(enderecos){
    let div = document.querySelector('.enderecos')
    div.innerHTML = ""

    for (let endereco of enderecos){
        const p = document.createElement('p')
        p.textContent = `${endereco.estacao}${' - '}${endereco.enderecoEstacao}`
        div.appendChild(p);
    }
}

// Códigos para visualizar a página de Desafios 
async function prepararDesafios() {
    const desafiosEndpoint = '/desafios'
    const URLcompletaDesafios = `${protocolo}${baseURL}${desafiosEndpoint}`
    const desafios = (await axios.get(URLcompletaDesafios)).data
    console.log(desafios)
    exibirDesafios(horarios)
}

function exibirTopicoDesafios(desafios) {
    let div = document.querySelector('.topico-desafios')
    div.innerHTML = ""

    for (let desafio of desafios) {
        const p = document.createElement('p')
        p.textContent = `${desafio.questao}`
        div.appendChild(p)
        if(desafios.imagemURL){
            let imgDesafio = document.createElement('img')
            imgDesafio.scr = post.imagemURL
            div.appendChild(imgDesafio)
        }
        
    }
}

function exibirDesafios(desafios) {
    let div = document.querySelector('.topico-desafios')
    div.innerHTML = ""

    for (let desafio of desafios) {
        const p = document.createElement('p')
        p.textContent = `${endereco[0]}${' - '}${endereco[1]}`
        div.appendChild(p)
    }
}