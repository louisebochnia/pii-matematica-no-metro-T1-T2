const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function obterHorarios() {
    const horariosEndpoint = '/horarios'
    const URLcompleta = `${protocolo}${baseURL}${horariosEndpoint}`
    const horarios = (await axios.get(URLcompleta)).data
    console.log(horarios)
    exibirHorarios(horarios)
}

function exibirHorarios(horarios){
    let tabela = document.querySelector('#horarios')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""

    for (let horario of horarios){
        let linha = corpoTabela.insertRow(0)
        let celulaDiaSemana = linha.insertCell(0)
        let celulaHorarioVoluntarios = linha.insertCell(1)
        celulaDiaSemana.innerHTML = horario[0]
        celulaHorarioVoluntarios.innerHTML = horario[1]
        
    }
}