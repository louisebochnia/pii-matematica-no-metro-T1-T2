const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function prepararPaginaInicial() {
    const horariosEndpoint = '/horarios'
    const URLcompletaHorarios = `${protocolo}${baseURL}${horariosEndpoint}`
    const horarios = (await axios.get(URLcompletaHorarios)).data
    exibirHorarios(horarios)
    const enderecosEndpoint = '/enderecos'
    const URLcompletaEnderecos = `${protocolo}${baseURL}${enderecosEndpoint}`
    const enderecos = (await axios.get(URLcompletaEnderecos)).data
    exibirEnderecos(enderecos)
}

async function prepararForum() {
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    exibirAvisosRecentes(avisos)
    const postsEndPoint = '/posts'
    const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
    const posts = (await axios.get(URLcompletaPosts)).data
    exibirPosts(posts)
}

function exibirHorarios(horarios){
    let tabela = document.querySelector('#horarios')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""

    for (let horario of horarios){
        let linha = corpoTabela.insertRow(0)
        let celulaDiaSemana = linha.insertCell(0)
        let celulaHorarioVoluntarios = linha.insertCell(1)
        let celulaEstacao = linha.insertCell(2)
        celulaDiaSemana.innerHTML = horario.diaSemana
        celulaHorarioVoluntarios.innerHTML = horario.horarioVoluntarios  
        celulaEstacao.innerHTML = horario.estacao
    }
}

function exibirEnderecos(enderecos){
    let div = document.querySelector('.enderecos')
    div.innerHTML = ""

    for (let endereco of enderecos){
        const p = document.createElement('p')
        p.textContent = `${endereco.estacao}${' - '}${endereco.enderecoEstacao}`
        div.appendChild(p)
    }
}

function exibirAvisosRecentes(avisos) {
    const tamanhoAvisos = avisos.length
    console.log("Número de avisos:", tamanhoAvisos)

    let div = document.querySelector('.avisos')
    div.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.textContent = "Últimos Avisos"
    div.appendChild(h4)

    if (tamanhoAvisos < 2) {
        for (aviso of avisos){
            formatacaoDiv = "row justify-content-end align-items-end my-2"
            formatacaoBalao = "col-8 col-md-11 p-3 mx-auto bg-secondary-subtle rounded-top-4 rounded-end-4"

            montarPost("null", aviso, formatacaoDiv, formatacaoBalao, div, "post")
            
            for (resposta of aviso.resposta) {
                divPost = document.createElement('div')
                formatacaoDiv = "row justify-content-end align-items-end my-2 d-none"
                formatacaoBalao = "col-6 col-md-10 p-3 mx-auto mx-md-1 bg-secondary-subtle rounded-top-4 rounded-end-4"

                montarPost(divPost, resposta, formatacaoDiv, formatacaoBalao, div, "resposta")
        }}
    }
    else {
        for (let i = 0; i < 2; i++) {
            let aviso = avisos[(tamanhoAvisos - i)]

            formatacaoDiv = "row justify-content-end align-items-end my-2"
            formatacaoBalao = "col-8 col-md-11 p-3 mx-auto bg-secondary-subtle rounded-top-4 rounded-end-4"

            montarPost(aviso, formatacaoDiv, formatacaoBalao, div, "post")
         
            for (resposta of aviso.reposta) {
                formatacaoDiv = "row justify-content-end align-items-end my-2 d-none"
                formatacaoBalao = "col-6 col-md-10 p-3 mx-auto mx-md-1 bg-secondary-subtle rounded-top-4 rounded-end-4"

                montarPost(resposta, formatacaoDiv, formatacaoBalao, div, "resposta")
            }
        }
    }
    let botoes = document.createElement('div')
    let mostrarRespostas = document.createElement('div')
    mostrarRespostas.className = "color-secondary justify-content-start btn"
    mostrarRespostas.innerHTML = "Mostrar Respostas"
    let esconderRespostas = document.createElement('div')
    esconderRespostas.className = "color-secondary justify-content-start btn d-none"
    esconderRespostas.innerHTML = "Esconder Respostas"
    mostrarRespostas.onclick = function() {
        divPost.classList.remove('d-none')
        mostrarRespostas.classList.add('d-none')
        esconderRespostas.classList.remove('d-none')
        }
    esconderRespostas.onclick = function() {
        divPost.classList.add('d-none')
        mostrarRespostas.classList.remove('d-none')
        esconderRespostas.classList.add('d-none')
    }
    let responder = document.createElement('div')
    responder.className = "color-secondary justify-content-start btn"
    responder.innerHTML = "Responder"
    
    botoes.appendChild(responder)
    botoes.appendChild(mostrarRespostas)
    botoes.appendChild(esconderRespostas)
    
    div.appendChild(botoes)
}

function exibirPosts(posts) {
    const tamanhoPosts = posts.length
    console.log("Número de posts:", tamanhoPosts)

    let div = document.querySelector('.posts')
    div.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.textContent = "Posts"
    div.appendChild(h4)

    for (post of posts){
        formatacaoDiv = "row justify-content-end align-items-end my-2"
        formatacaoBalao = "col-8 col-md-11 p-3 mx-auto bg-secondary-subtle rounded-top-4 rounded-end-4"

        montarPost("null", post, formatacaoDiv, formatacaoBalao, div, "post")
        
        let respostasContainer = document.createElement('div')
        respostasContainer.className = "respostas-container d-none"

        for (let resposta of post.resposta) {
            let divResp = document.createElement('div')
            let formatacaoDivResposta = "row justify-content-end align-items-end my-2"
            let formatacaoBalaoResposta = "col-6 col-md-10 p-3 mx-auto mx-md-1 bg-secondary-subtle rounded-top-4 rounded-end-4"
            console.log(resposta)

            montarPost(divResp, resposta, formatacaoDivResposta, formatacaoBalaoResposta, respostasContainer, "resposta");
        }

        div.appendChild(respostasContainer)
    
        
        let botoes = document.createElement('div')
        let mostrarRespostas = document.createElement('div')
        mostrarRespostas.className = "color-secondary justify-content-start btn"
        mostrarRespostas.innerHTML = "Mostrar Respostas"
        let esconderRespostas = document.createElement('div')
        esconderRespostas.className = "color-secondary justify-content-start btn d-none"
        esconderRespostas.innerHTML = "Esconder Respostas"
        mostrarRespostas.onclick = function () {
            respostasContainer.classList.remove('d-none');
            mostrarRespostas.classList.add('d-none');
            esconderRespostas.classList.remove('d-none');
        }

        esconderRespostas.onclick = function () {
            respostasContainer.classList.add('d-none');
            mostrarRespostas.classList.remove('d-none');
            esconderRespostas.classList.add('d-none');
        }
        let responder = document.createElement('div')
        responder.className = "color-secondary justify-content-start btn"
        responder.innerHTML = "Responder"
        
        botoes.appendChild(responder)
        botoes.appendChild(mostrarRespostas)
        botoes.appendChild(esconderRespostas)
        
        div.appendChild(botoes)
    }
}

function mostrarRespostas(divPost) {
    divPost.classList.remove('d-none')
}

function montarPost(divPost, post, formatacaoDiv, formatacaoBalao, div, tipo){
    if (tipo == "post"){
        divAviso = document.createElement('div')
    }
    else{
        divAviso = divPost
    }

    divAviso.innerHTML = ""
    divAviso.className = formatacaoDiv

    let postFoto = document.createElement('img')
    postFoto.src = "/front/images/user_icon.png"
    postFoto.id = "forum-icon"

    let divFoto = document.createElement('div')
    divFoto.className ="col-1"
    divFoto.appendChild(postFoto)

    let divBalao = document.createElement('div')
    divBalao.innerHTML = ""
    divBalao.className = formatacaoBalao

    let pApelido = document.createElement('p')
    pApelido.textContent = post.apelido
    pApelido.style = "font-weight: bold;"

    let pTexto = document.createElement('p')
    pTexto.textContent = post.postagem

    divBalao.appendChild(pApelido)
    divBalao.appendChild(pTexto)

    if (post.imagemPost) { 
        let imgAviso = document.createElement('img')
        imgAviso.src = post.imagemPost
        divBalao.appendChild(imgAviso)
    }

    divAviso.appendChild(divFoto)
    divAviso.appendChild(divBalao)
    div.appendChild(divAviso)
}

// Códigos para visualizar a página de Desafios 
async function prepararPaginaDesafios() {
    const desafiosEndpoint = '/desafios'
    const URLcompletaDesafios = `${protocolo}${baseURL}${desafiosEndpoint}`
    const desafios = (await axios.get(URLcompletaDesafios)).data
    console.log(desafios)
    exibirTopicoDesafios(desafios)
}

function exibirTopicoDesafios(topicosDesafio) {
    let div = document.querySelector('.topico-desafios')
    div.innerHTML = ""

    for (let topicoDesafio of topicosDesafio) {
        const details = document.createElement('details')
        details.className = "my-2"
        const summary = document.createElement('summary')
        summary.innerHTML = topicoDesafio.topico
        details.appendChild(summary)

        for (let desafio of topicoDesafio.desafio){
            const enunciado = document.createElement('p')
            enunciado.innerHTML = desafio.questao
            const fieldset = document.createElement('fieldset')
            const escolha = document.createElement('p')
            escolha.style = "font-weight: bold;"
            escolha.innerHTML = "Escolha uma alternativa"

            
            const resolucao = document.createElement('p')
            resolucao.innerHTML = desafio.resolucao

            details.appendChild(enunciado)
            details.appendChild(resolucao)
        }

        div.appendChild(details)
        
    }
}