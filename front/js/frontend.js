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
    exibirUltimoAviso(avisos[0])
    const postsEndPoint = '/posts'
    const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
    const posts = (await axios.get(URLcompletaPosts)).data
    exibirPosts(posts)
    const filtrarTudo = document.querySelector('.filtro-inicio')
    if(filtrarTudo.classList.contains('d-none') == false){
        filtrarTudo.classList.add('d-none')
        let filtroAvisos = document.querySelector('.filtro-avisos')
        filtroAvisos.classList.remove('d-none')
        let filtroAvisosAntigos = document.querySelector('.filtro-avisos-antigos')
        filtroAvisosAntigos.classList.add('d-none')
        let filtroPosts = document.querySelector('.filtro-posts')
        filtroPosts.classList.remove('d-none')
        let filtroPostsAntigos = document.querySelector('.filtro-posts-antigos')
        filtroPostsAntigos.classList.remove('d-none')
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

async function filtrar(ordem){
    const postsEndPoint = '/posts'
    const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
    const posts = (await axios.get(URLcompletaPosts)).data
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    if(ordem == 1) {
        exibirPosts(posts)
    }
    else if(ordem == 0) {
        antigos = [...posts].reverse()
        exibirPosts(antigos)
    }
    else if(ordem == 2){
        exibirAvisos(avisos.reverse())
    }
}

function exibirAvisos(avisos) {
    let filtrarTudo = document.querySelector('.filtro-inicio')
    filtrarTudo.classList.remove('d-none')
    let filtroAvisos = document.querySelector('.filtro-avisos')
    filtroAvisos.classList.add('d-none')
    let filtroAvisosAntigos = document.querySelector('.filtro-avisos-antigos')
    filtroAvisosAntigos.classList.remove('d-none')
    let filtroPosts = document.querySelector('.filtro-posts')
    filtroPosts.classList.add('d-none')
    let filtroPostsAntigos = document.querySelector('.filtro-posts-antigos')
    filtroPostsAntigos.classList.add('d-none')
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

        let divPost = document.createElement('div')
        let formatacaoDiv = "row justify-content-end align-items-end my-2"
        let formatacaoBalao = "col-8 col-md-11 p-3 mx-auto bg-secondary-subtle rounded-top-4 rounded-end-4"

        montarPost(divPost, post, formatacaoDiv, formatacaoBalao, div, "post")
        
        let respostasContainer = document.createElement('div')
        respostasContainer.className = "respostas-container d-none"

        for (let resposta of post.resposta) {

            let divResp = document.createElement('div')
            let formatacaoDivResposta = "row justify-content-end align-items-end my-2"
            let formatacaoBalaoResposta = "col-6 col-md-10 p-3 mx-auto mx-md-1 bg-secondary-subtle rounded-top-4 rounded-end-4"

            montarPost(divResp, resposta, formatacaoDivResposta, formatacaoBalaoResposta, respostasContainer, "resposta")
        }

        divPost.appendChild(respostasContainer)
        div.appendChild(divPost)
        
        let idPostResp = post.idPost

        botoesRespostas(respostasContainer, div, idPostResp)

        criarModal(idPostResp, post.apelido)
    }
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

    let rowApelidoData = document.createElement('div')
    rowApelidoData.className = "row"

    let pApelido = document.createElement('p')
    pApelido.textContent = post.apelido
    pApelido.className = "col-auto"
    pApelido.style = "font-weight: bold;"

    let pDataHora = document.createElement('p')
    pDataHora.textContent = `${post.data} - ${post.horario}`
    pDataHora.className = "col-auto"
    pDataHora.style = "font-weight: lighter; font-style: italic;"

    rowApelidoData.appendChild(pApelido)
    rowApelidoData.appendChild(pDataHora)

    let pTexto = document.createElement('p')
    pTexto.textContent = post.postagem

    divBalao.appendChild(rowApelidoData)
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

function botoesRespostas(respostasContainer, div, idPost){
    let botoes = document.createElement('div')

    let mostrarRespostas = document.createElement('div')
    mostrarRespostas.className = "color-secondary justify-content-start btn"
    mostrarRespostas.innerHTML = "Mostrar Respostas"
    mostrarRespostas.onclick = function () {
        respostasContainer.classList.remove('d-none');
        mostrarRespostas.classList.add('d-none');
        esconderRespostas.classList.remove('d-none');
    }

    let esconderRespostas = document.createElement('div')
    esconderRespostas.className = "color-secondary justify-content-start btn d-none"
    esconderRespostas.innerHTML = "Esconder Respostas"
    esconderRespostas.onclick = function () {
        respostasContainer.classList.add('d-none');
        mostrarRespostas.classList.remove('d-none');
        esconderRespostas.classList.add('d-none');
    }

    let responder = document.createElement('div')
    responder.className = "color-secondary justify-content-start btn"
    responder.innerHTML = "Responder"
    responder.setAttribute('data-bs-toggle', 'modal')
    responder.setAttribute('data-bs-target', `#modalResposta${idPost}`)
    
    botoes.appendChild(responder)
    botoes.appendChild(mostrarRespostas)
    botoes.appendChild(esconderRespostas)
    
    div.appendChild(botoes)
}

function criarModal (idPost, apelido) {
    let div1 = document.createElement('div')
    div1.className = "modal fade"
    div1.id = `modalResposta${idPost}`
    let div2 = document.createElement('div')
    div2.className = "modal-dialog modal-dialog-centered"
    let div3 = document.createElement('div')
    div3.className = "modal-content"

    // Cria o header do modal
    let modalHeader = document.createElement('div')
    modalHeader.className = "modal-header"
    let titulo = document.createElement('h1')
    titulo.className = "modal-title fs-5"
    titulo.innerHTML = `Respondendo ao post de ${apelido}`
    modalHeader.appendChild(titulo)
    div3.appendChild(modalHeader)

    // Cria o body do modal
    let modalBody = document.createElement('div')
    modalBody.className = "modal-body"
    let alert = document.createElement('div')
    alert.className = "alert d-none alert-dismissable fade alert-modal-resposta"
    alert.role = "alert"
    modalBody.appendChild(alert)
    let form = document.createElement('form')
    let div4 = document.createElement('div')
    div4.className = "mb-3"
    form.appendChild(div4)
    let label = document.createElement('label')
    label.className = "col-form-label"
    label.textContent = "Escreva sua resposta na caixa abaixo"
    label.setAttribute("for", `mensagemResposta${idPost}`)
    let input = document.createElement('textarea')
    input.className = "form-control"
    input.id = `mensagemResposta${idPost}`
    div4.appendChild(label)
    div4.appendChild(input)
    modalBody.appendChild(form)
    div3.appendChild(modalBody)

    // Cria o footer do modal
    let modalFooter = document.createElement('div')
    modalFooter.className = "modal-footer"
    let botaoCancelar = document.createElement('button')
    botaoCancelar.className = "btn btn-outline-secondary"
    botaoCancelar.type = "button"
    botaoCancelar.setAttribute("data-bs-dismiss", "modal")
    botaoCancelar.innerHTML = "Cancelar"
    let botaoResponder = document.createElement('button')
    botaoResponder.className = "btn btn-primary"
    botaoResponder.innerHTML = "Publicar"
    botaoResponder.id = `botaoResposta${idPost}`
    botaoResponder.addEventListener('click', function (event) {
        console.log("Botão clicado")
        event.preventDefault()
        enviarResposta(3, idPost, `#mensagemResposta${idPost}`)
        prepararForum()
        input.value = ""
    })
    botaoResponder.setAttribute("data-bs-dismiss", "modal")
    modalFooter.appendChild(botaoCancelar)
    modalFooter.appendChild(botaoResponder)
    div3.appendChild(modalFooter)

    div2.appendChild(div3)
    div1.appendChild(div2)

    // Adiciona o modal ao body
    document.body.appendChild(div1)
}

async function enviarPost (idTipoPost, idModal) {
    let idUsuario = localStorage.getItem("idLogin")
    let resposta = (document.querySelector(idModal)).value

    const tempoPassado = Date.now()
    let data = new Date(tempoPassado)
    let hora = data.getHours()
    let minuto = data.getMinutes()
    let horarioAtual = `${hora}:${minuto}`
    dataAtual = data.toLocaleDateString()

    // Verifica se os valores necessários estão disponíveis
    if (!idUsuario || !resposta) {
        alert("Por favor, verifique os dados antes de enviar.")
        return
    }

    try {
        const postsEndPoint = '/posts'
        const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
        await axios.post(URLcompletaPosts, {postagem: resposta, idLogin: idUsuario, idTipoPostagem: idTipoPost, data: dataAtual, horario: horarioAtual})
    } catch (error) {
        console.error(error.response?.data || error.message)
    }
    
}

async function enviarResposta (idTipoPost, idPost, idModal) {
    let idUsuario = localStorage.getItem("idLogin")
    let resposta = (document.querySelector(idModal)).value
    let idTipoPostagem = idTipoPost
    let idPostResp = idPost

    const tempoPassado = Date.now()
    let data = new Date(tempoPassado)
    let hora = data.getHours()
    let minuto = data.getMinutes()
    let horarioAtual = `${hora}:${minuto}`
    dataAtual = data.toLocaleDateString()

    // Verifica se os valores necessários estão disponíveis
    if (!idUsuario || !resposta) {
        alert("Por favor, verifique os dados antes de enviar.")
        return
    }

    const respostasEndpoint = '/respostas'
    const URLcompletaResposta = `${protocolo}${baseURL}${respostasEndpoint}`
    try {
        let result = await axios.post(URLcompletaResposta, {postagem: resposta, idLogin: idUsuario, idTipoPostagem: idTipoPostagem, idPostagemResp: idPostResp, data: dataAtual, horario: horarioAtual})
        console.log(result.data)
    } catch (error) {
        console.error(error.response?.data || error.message)
    }

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

    //coloca e exibe todos os tópicos de desafios na página
    for (let topicoDesafio of topicosDesafio) {
        const details = document.createElement('details')
        details.className = "my-2"
        const summary = document.createElement('summary')
        summary.textContent = topicoDesafio.topico
        details.appendChild(summary)
        let i = 1

        //coloca e exibe todos os desafios da lista desafio na página na página
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

            //coloca e exibe todas as alternativas da lista embaralhada na página
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
            const respAssinalada = document.createElement('p')
            divResolucao.appendChild(respAssinalada)             
            const mensagem = document.createElement('p')
            divResolucao.appendChild(mensagem)
            const resolucao = document.createElement('p')
            resolucao.innerHTML = desafio.resolucao
            divResolucao.appendChild(resolucao)

            const botao = document.createElement('button')
            botao.className = "justify-content-start btn"
            botao.style = "background-color: #002687; color: white;"
            botao.innerHTML = "Responder"

            botao.onclick = function () {
                let assinalada = divQuestao.querySelector(`input[name="alternativa-${topicoDesafio.id}-${desafio.id}"]:checked`)
                
                //confirma se o usuário selecionou uma alternativa
                if (assinalada) {
                    //pega a resposta que o usuário selecionou
                    let resposta = assinalada.value

                    //verifica se o usuário acertou ou errou a questão
                    if (resposta == desafio.respostaCorreta){
                        //pega a quantidade de vezes que a resposta do usuário já foi selecionada
                        let quantidade = desafio.porcentagemRespCorreta + 1

                        //chama a função para armazenar a quantidade de respostas no banco de dados
                        armazenarResposta(desafio.idQuestao, "porcentagemRespCorreta", quantidade)

                        //mostra a resolução da questão e informa ao usuário que ele acertou
                        respAssinalada.textContent = `Você assinalou: ${resposta}`
                        mensagem.textContent = "Parabéns! Você acertou! Confira se sua resolução ficou igual ou parecida com a resolução correta abaixo:"
                        divResolucao.classList.remove('d-none', 'bg-danger-subtle', 'border-danger')
                        divResolucao.classList.add('my-3', 'p-3', 'bg-success-subtle', 'border', 'border-success', 'rounded-3')
                    } else {
                        //pega o indíce da resposta do usuário na lista não embaralhada
                        let nRepsIncorreta = alternativas.indexOf(resposta)
                        
                        //pega a quantidade de vezes que a resposta do usuário já foi selecionada
                        let quantidade = desafio.porcentagemRespIncorretas[nRepsIncorreta - 1] + 1

                        //forma a string do nome das resposta marcada no banco de dados
                        let alternativaMarcada = `porcentagemRespIncorreta${nRepsIncorreta}`

                        //chama a função para armazenar a quantidade de respostas no banco de dados
                        armazenarResposta(desafio.idQuestao, alternativaMarcada, quantidade)
                        
                        //mostra a resolução da questão e informa ao usuário que ele errou
                        respAssinalada.textContent = `Você assinalou: ${resposta}`
                        mensagem.textContent = "Oh não! Você Errou! Veja a resolução correta abaixo:"
                        divResolucao.classList.remove('d-none', 'bg-success-subtle', 'border-success')
                        divResolucao.classList.add('my-2', 'p-3', 'bg-danger-subtle', 'border', 'border-danger', 'rounded-3')
                    }
                } else {
                    alert("Por favor, selecione uma alternativa antes de responder!");
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