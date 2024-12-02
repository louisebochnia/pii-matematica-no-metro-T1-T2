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

async function prepararPaginaContato() {
    const enderecosEndpoint = '/enderecos'
    const URLcompletaEnderecos = `${protocolo}${baseURL}${enderecosEndpoint}`
    const enderecos = (await axios.get(URLcompletaEnderecos)).data
    exibirEnderecos(enderecos)
}

async function postarDuvida() {
    let inputNomeCompleto = (document.querySelector('#nomeInput'))
    let inputEmailContato = (document.querySelector('#emailInput'))
    let inputMensagemContato = (document.querySelector('#duvidaTextarea'))
    let nome = inputNomeCompleto.value
    let email = inputEmailContato.value
    let mensagem = inputMensagemContato.value
    if (nome && email && mensagem){
        try{
            const contatoEndpoint = '/contato'
            const URLcompletaContato = `${protocolo}${baseURL}${contatoEndpoint}`
            const response = await axios.post(URLcompletaContato, {nomeCompleto: nome, emailContato: email, mensagemContato: mensagem})
            console.log(response)
        }
        catch(e) {
            console.log(e)
        }
    } else {
        console.log("Preencha todos os campos!")
    }
   
}

async function prepararForum() {
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    exibirUltimoAviso(avisos[0])
    const postsEndPoint = '/posts'
    const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
    const posts = (await axios.get(URLcompletaPosts)).data
    exibirPosts(posts)
    const filtrarTudo = document.querySelector('.filtro-inicio')
    if(filtrarTudo.classList.contains('d-none') == false){
        filtrarTudo.classList.add('d-none')
    }
    const divPosts = document.querySelector('.posts')
    if(divPosts.classList.contains('d-none')){
        divPosts.classList.remove('d-none')
    }
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

function exibirUltimoAviso(aviso) {
    let div = document.querySelector('.avisos')
    div.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.textContent = "Último Aviso"
    div.appendChild(h4)

    formatacaoDiv = "row justify-content-end align-items-end my-2"
    formatacaoBalao = "col-8 col-md-11 p-3 mx-auto bg-secondary-subtle rounded-top-4 rounded-end-4"

    montarPost("null", aviso, formatacaoDiv, formatacaoBalao, div, "post")

    let respostasContainer = document.createElement('div')
    respostasContainer.className = "respostas-container d-none"
    
    for (resposta of aviso.resposta) {
        let divResp = document.createElement('div')

        let formatacaoDivResposta = "row justify-content-end align-items-end my-2"
        let formatacaoBalaoResposta = "col-6 col-md-10 p-3 mx-auto mx-md-1 bg-secondary-subtle rounded-top-4 rounded-end-4"

        montarPost(divResp, resposta, formatacaoDivResposta, formatacaoBalaoResposta, respostasContainer, "resposta")    
    }
    div.appendChild(respostasContainer)

    botoesRespostas(respostasContainer, div)

}

async function filtrarAvisos(){
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    exibirAvisos(avisos)
}

function exibirAvisos(avisos) {
    let filtrarTudo = document.querySelector('.filtro-inicio')
    filtrarTudo.classList.remove('d-none')
    let div = document.querySelector('.avisos')
    div.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.textContent = "Avisos"
    div.appendChild(h4)
    let divPosts = document.querySelector('.posts')
    divPosts.classList.add('d-none')

    for (let aviso of avisos){
        formatacaoDiv = "row justify-content-end align-items-end my-2"
        formatacaoBalao = "col-8 col-md-11 p-3 mx-auto bg-secondary-subtle rounded-top-4 rounded-end-4"

        montarPost("null", aviso, formatacaoDiv, formatacaoBalao, div, "post")

        let respostasContainer = document.createElement('div')
        respostasContainer.className = "respostas-container d-none"

        for (resposta of aviso.resposta) {
            
            let divResp = document.createElement('div')
            let formatacaoDivResposta = "row justify-content-end align-items-end my-2"
            let formatacaoBalaoResposta = "col-6 col-md-10 p-3 mx-auto mx-md-1 bg-secondary-subtle rounded-top-4 rounded-end-4"

            montarPost(divResp, resposta, formatacaoDivResposta, formatacaoBalaoResposta, respostasContainer, "resposta")
        }

        div.appendChild(respostasContainer)

        botoesRespostas(respostasContainer, div)
    }
    
}

function exibirPosts(posts) {
    let div = document.querySelector('.posts')
    div.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.textContent = "Posts"
    div.appendChild(h4)

    for (let post of posts){
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

            montarPost(divResp, resposta, formatacaoDivResposta, formatacaoBalaoResposta, respostasContainer, "resposta")
        }

        div.appendChild(respostasContainer)
    
        
        botoesRespostas(respostasContainer, div)
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

function botoesRespostas(respostasContainer, div){
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

// Códigos para visualizar a página de Desafios 
async function prepararPaginaDesafios() {
    const desafiosEndpoint = '/desafios'
    const URLcompletaDesafios = `${protocolo}${baseURL}${desafiosEndpoint}`
    const desafios = (await axios.get(URLcompletaDesafios)).data
    exibirDesafios(desafios)
}

function exibirDesafios(topicosDesafio) {
    let div = document.querySelector('.topico-desafios')
    div.innerHTML = ""

    for (let topicoDesafio of topicosDesafio) {
        const details = document.createElement('details')
        details.className = "my-2"
        const summary = document.createElement('summary')
        summary.textContent = topicoDesafio.topico
        details.appendChild(summary)
        let i = 1

        for (let desafio of topicoDesafio.desafio){
            const divQuestao = document.createElement('div')
            divQuestao.className = "my-2 p-4 border-bottom border-3"
            divQuestao.style = "border-color: #002687 !important;"

            const enunciado = document.createElement('p')
            enunciado.innerHTML = `${i}.  ${desafio.questao}`

            const fieldset = document.createElement('fieldset')
            const escolha = document.createElement('p')
            escolha.style = "font-weight: bold;"
            escolha.innerHTML = "Escolha uma alternativa"

            //salva uma cópia da lista de alternativas
            let alternativas = [...desafio.alternativas]

            //embaralha as alternativas na lista para que elas fiquem em ordem diferentes
            let alternativasEmbaralhadas = embaralharAlternativas(desafio.alternativas)

            for(let alternativa of alternativasEmbaralhadas) {
                const p = document.createElement('p')
                const inputRadio = document.createElement('input')
                inputRadio.type = 'radio'
                inputRadio.name = `alternativa-${topicoDesafio.id}-${desafio.id}`
                inputRadio.value = alternativa
                
                const label = document.createElement('label')
                label.style.cursor = "pointer";
                label.appendChild(inputRadio)
                label.appendChild(document.createTextNode(` ${alternativa}`))

                p.appendChild(label)

                fieldset.appendChild(p)
            }

            const divResolucao = document.createElement('div')
            divResolucao.className = "d-none"
            const resolucao = document.createElement('p')
            resolucao.innerHTML = desafio.resolucao

            const botao = document.createElement('button')
            botao.className = "justify-content-start btn"
            botao.style = "background-color: #002687; color: white;"
            botao.innerHTML = "Responder"

            botao.onclick = function () {
                let assinalada = divQuestao.querySelector(`input[name="alternativa-${topicoDesafio.id}-${desafio.id}"]:checked`)
                
                //confirma se o usuário selecionou uma alternativa
                if (assinalada) {
                    let resposta = assinalada.value
                    console.log("Alternativa selecionada:", resposta);

                    //verifica se o usuário acertou ou errou a questão
                    if (resposta == desafio.respostaCorreta){
                        let quantidade = desafio.porcentagemRespCorreta + 1
                        armazenarResposta(desafio.idQuestao, "porcentagemRespCorreta", quantidade)
                    } else {
                        //pega o indíce da resposta do usuário na lista não embaralhada
                        let nRepsIncorreta = alternativas.indexOf(resposta)
                        console.log(nRepsIncorreta)
                        
                        //pega a quantidade de vezes que a resposta do usuário já foi selecionada
                        let quantidade = desafio.porcentagemRespIncorretas[nRepsIncorreta - 1] + 1
                        console.log(quantidade)

                        let alternativaMarcada = `porcentagemRespIncorreta${nRepsIncorreta}`
                        console.log(alternativaMarcada)
                        console.log(desafio.idQuestao)
                        armazenarResposta(desafio.idQuestao, alternativaMarcada, quantidade)
                        
                    }
                } else {
                    alert("Por favor, selecione uma alternativa antes de enviar.");
                }
            }

            divQuestao.appendChild(enunciado)
            divQuestao.appendChild(fieldset)
            divQuestao.appendChild(botao)
            divQuestao.appendChild(divResolucao)

            details.appendChild(divQuestao)

            i++
        }

        div.appendChild(details)
        
    }
}

// código para embaralhar as alternativas do desafio
function embaralharAlternativas(respostas) {
    let m = respostas.length, t, i;
    
    while (m) {
      i = Math.floor(Math.random() * m--);
  
      t = respostas[m];
      respostas[m] = respostas[i];
      respostas[i] = t;
    }
  
    return respostas;
}

// código para armazenar a quantidade de respostas
async function armazenarResposta(questao, assinalada, quantidade) {
        const desafiosEndpoint = '/desafios'
        const URLcompletaDesafios = `${protocolo}${baseURL}${desafiosEndpoint}`
        const response = await axios.post(URLcompletaDesafios, {idQuestao: questao, assinalada: assinalada, quantidade: quantidade}) 
        console.log(response)
}


// Códigos para visualizar a página de login
async function prepararPaginaLogin() {
    const loginEndpoint = '/login'
    const URLcompletaLogin = `${protocolo}${baseURL}${loginEndpoint}`
    const login = (await axios.get(URLcompletaLogin)).data
}
function esconderSenha() {
    document.getElementById('senhaButton').addEventListener('click', function () {
        // Seleciona os campos de senha pelos IDs
        let senhas = [
            document.getElementById('senhaInput'),
            document.getElementById('senhaCadastroInput'),
            document.getElementById('senhaCadastroInput2')
        ];
        for (let senha of senhas) {
            if (senha) { // Certifica-se de que o elemento existe
                const type = senha.getAttribute('type') === 'password' ? 'text' : 'password'
                senha.setAttribute('type', type)
            }
        }
        // Altera o texto do botão com base no estado do primeiro campo
        this.textContent = senhas[0]?.getAttribute('type') === 'password' ? 'Mostrar' : 'Esconder'
    })
}
async function cadastrarUsuario() {
    esconderModal('#modalTermos', 500)
}
function esconderModal(seletor, timeout) {
    setTimeout (() => {
        let modal = bootstrap.Modal.getInstance(seletor)
        modal.hide()
    }, timeout)
}