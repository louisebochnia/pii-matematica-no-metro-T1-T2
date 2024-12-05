const protocolo = 'http://'
const baseURL = 'localhost:3000'

function logout() {
    localStorage.clear()
}

function prepararPaginaSobreNos() {
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    const logout = document.querySelector('#logoutButton')
    const login = document.querySelector('.login-link')
    if (idTipoLogin) {
        logout.classList.remove('d-none')
        login.setAttribute("href", 'configuracoes.html')
    }
    else {
        logout.classList.add('d-none')
        login.setAttribute("href", 'login.html')
    }
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
}

async function prepararPaginaInicial() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    console.log(idTipoLogin)
    const logout = document.querySelector('#logoutButton')
    const login = document.querySelector('.login-link')
    const editarHorariosButton = document.querySelector('#editarHorariosButton')
    const deletarHorariosButton = document.querySelector('#deletarHorariosButton')
    const editarEnderecosButton = document.querySelector('#editarEnderecosButton')
    const deletarEnderecosButton = document.querySelector('#deletarEnderecosButton')
    if (idTipoLogin) {
        logout.classList.remove('d-none')
        login.setAttribute("href", 'configuracoes.html')
        if (idTipoLogin == '1') {
            editarHorariosButton.classList.remove('d-none')
            deletarHorariosButton.classList.remove('d-none')
            editarEnderecosButton.classList.remove('d-none')
            deletarEnderecosButton.classList.remove('d-none')
        }
        else {
            editarHorariosButton.classList.add('d-none')
            deletarHorariosButton.classList.add('d-none')
            editarEnderecosButton.classList.add('d-none')
            deletarEnderecosButton.classList.add('d-none')
        }
    }
    else {
        logout.classList.add('d-none')
        login.setAttribute("href", 'login.html')
    }
    const horariosEndpoint = '/horarios'
    const URLcompletaHorarios = `${protocolo}${baseURL}${horariosEndpoint}`
    const horarios = (await axios.get(URLcompletaHorarios)).data
    exibirHorarios(horarios)
    const enderecosEndpoint = '/enderacoes'
    const URLcompletaEnderecos = `${protocolo}${baseURL}${enderecosEndpoint}`
    const enderecos = (await axios.get(URLcompletaEnderecos)).data
    exibirEnderecos(enderecos)
}

async function salvarHorario() {
    let selecionarDia = (document.querySelector('#selecionarDia')).value
    console.log(selecionarDia)
    let primeiroHorario = (document.querySelector('#primeiroHorario')).value
    let segundoHorario = (document.querySelector('#segundoHorario')).value
    let estacaoEdit = (document.querySelector('#estacaoEdit')).value
    if (selecionarDia && primeiroHorario && segundoHorario && estacaoEdit) {
        try {
            const horariosEndpoint = '/horarios'
            const URLcompletaHorarios = `${protocolo}${baseURL}${horariosEndpoint}`
            const response = await axios.post(URLcompletaHorarios, { diaSemana: selecionarDia, horario: `${primeiroHorario} - ${segundoHorario}`, estacao: estacaoEdit })
            console.log(response)
            prepararPaginaInicial()
        }
        catch (e) {
            console.log(e)
        }
    } else {
        exibeAlerta('.alert-horarios', 'Preencha todos os campos!', ['show', 'alert-danger'], ['d-none'], 4000)
        console.log("Preencha todos os campos!")
    }
}

async function exibirEstacoes() {
    let select = document.querySelector('#estacaoEdit')
    select.innerHTML = ""
    const estacaoEndpoint = '/estacao'
    const URLcompletaEstacao = `${protocolo}${baseURL}${estacaoEndpoint}`
    const estacoes = (await axios.get(URLcompletaEstacao)).data
    for (let estacao of estacoes) {
        console.log(estacao.estacao)
        const option = document.createElement('option')
        option.innerHTML = estacao.estacao
        option.value = estacao.estacao
        select.appendChild(option)
    }
}

async function exibirEnderacoes() {
    let select = document.querySelector('#deletEnderecos')
    select.innerHTML = ""
    const enderecosEndpoint = '/enderacoes'
    const URLcompletaEnderecos = `${protocolo}${baseURL}${enderecosEndpoint}`
    const enderecos = (await axios.get(URLcompletaEnderecos)).data
    for (let endereco of enderecos) {
        console.log(endereco.enderecoEstacao)
        const option = document.createElement('option')
        option.innerHTML = `${endereco.estacao} - ${endereco.enderecoEstacao}`
        option.value = endereco.estacao
        select.appendChild(option)
    }
}

async function apagarEnderacoes() {
    let select = (document.querySelector('#deletEnderecos')).value
    const apagarEnderacoesEndpoint = '/enderacoes'
    const URLcompletaEnderacoes = `${protocolo}${baseURL}${apagarEnderacoesEndpoint}`
    try {
        await axios.post(URLcompletaEnderacoes, { estacao: select })
    }
    catch (e) {
        console.log(e)
    }
}

async function exibirHorarioss() {
    let select = document.querySelector('#deletHorarios')
    select.innerHTML = ""
    const horariosEndpoint = '/horarios'
    const URLcompletaHorarios = `${protocolo}${baseURL}${horariosEndpoint}`
    const horarios = (await axios.get(URLcompletaHorarios)).data
    for (let horario of horarios) {
        const option = document.createElement('option')
        option.innerHTML = `${horario.diaSemana} - ${horario.horarioVoluntarios} - ${horario.estacao}`
        option.value = horario.idHorario
        select.appendChild(option)
    }
}

async function apagarHorarios() {
    let select = (document.querySelector('#deletHorarios')).value
    const apagarHorariosEndpoint = '/horarioss'
    const URLcompletaHorarios = `${protocolo}${baseURL}${apagarHorariosEndpoint}`
    try {
        await axios.post(URLcompletaHorarios, { idHorario: select })
    }
    catch (e) {
        console.log(e)
    }
}

async function postarEnderecos() {
    let inputEnderecos = (document.querySelector('#enderecoTextarea'))
    let inputEstacoes = (document.querySelector('#estacaoTextarea'))
    let enderecos = inputEnderecos.value
    console.log(enderecos)
    let estacoes = inputEstacoes.value
    console.log(estacoes)
    if (enderecos && estacoes) {
        try {
            const enderecosEndpoint = '/enderecos'
            const URLcompletaEnderecos = `${protocolo}${baseURL}${enderecosEndpoint}`
            const response = await axios.post(URLcompletaEnderecos, { postEnderecos: enderecos, postEstacoes: estacoes })
            console.log(response)
        }
        catch (e) {
            console.log(e)
        }
    } else {
        exibeAlerta('.alert-contato', 'Preencha todos os campos!', ['show', 'alert-danger'], ['d-none'], 4000)
        console.log("Preencha todos os campos!")
    }

}

async function prepararPaginaContato() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    const logout = document.querySelector('#logoutButton')
    const login = document.querySelector('.login-link')
    const verMensagens = document.querySelector('#verMensagens')
    if (idTipoLogin) {
        logout.classList.remove('d-none')
        login.setAttribute("href", 'configuracoes.html')
        if(idTipoLogin == 1){
            verMensagens.classList.remove('d-none')
        }
        else{
            verMensagens.classList.add('d-none')
        }
    }
    else {
        logout.classList.add('d-none')
        login.setAttribute("href", 'login.html')
        verMensagens.classList.add('d-none')
    }
    const enderecosEndpoint = '/enderacoes'
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
    if (nome && email && mensagem) {
        try {
            const contatoEndpoint = '/contato'
            const URLcompletaContato = `${protocolo}${baseURL}${contatoEndpoint}`
            const response = await axios.post(URLcompletaContato, { nomeCompleto: nome, emailContato: email, mensagemContato: mensagem })
            console.log(response)
        }
        catch (e) {
            console.log(e)
        }
    } else {
        exibeAlerta('.alert-contato', 'Preencha todos os campos!', ['show', 'alert-danger'], ['d-none'], 4000)
        console.log("Preencha todos os campos!")
    }

}

async function prepararForum() {
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    const logout = document.querySelector('#logoutButton')
    const login = document.querySelector('.login-link')
    const novoPostButton = document.querySelector('#novoPostButton')
    const aviso = document.querySelector('.aviso-forum')
    if (idTipoLogin) {
        logout.classList.remove('d-none')
        login.setAttribute("href", 'configuracoes.html')
        novoPostButton.disabled = false
        aviso.classList.add('d-none')
    }
    else {
        logout.classList.add('d-none')
        login.setAttribute("href", 'login.html')
        novoPostButton.disabled = true
        aviso.classList.remove('d-none')
    }
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    exibirUltimoAviso(avisos[0])
    const postsEndPoint = '/posts'
    const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
    const posts = (await axios.get(URLcompletaPosts)).data
    exibirPosts(posts)
    const filtrarTudo = document.querySelector('.filtro-inicio')
    if (filtrarTudo.classList.contains('d-none') == false) {
        filtrarTudo.classList.add('d-none')
        let filtroAvisos = document.querySelector('.filtro-avisos')
        filtroAvisos.innerHTML = "Avisos"
        let filtroAvisosAntigos = document.querySelector('.filtro-avisos-antigos')
        filtroAvisosAntigos.classList.add('d-none')
        let filtroPosts = document.querySelector('.filtro-posts')
        filtroPosts.classList.remove('d-none')
        let filtroPostsAntigos = document.querySelector('.filtro-posts-antigos')
        filtroPostsAntigos.classList.remove('d-none')
    }
    const divPosts = document.querySelector('.posts')
    if (divPosts.classList.contains('d-none')) {
        divPosts.classList.remove('d-none')
    }
}

function exibirHorarios(horarios) {
    let tabela = document.querySelector('#horarios')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    corpoTabela.innerHTML = ""

    for (let horario of horarios) {
        let linha = corpoTabela.insertRow(0)
        let celulaDiaSemana = linha.insertCell(0)
        let celulaHorarioVoluntarios = linha.insertCell(1)
        let celulaEstacao = linha.insertCell(2)
        celulaDiaSemana.innerHTML = horario.diaSemana
        celulaHorarioVoluntarios.innerHTML = horario.horarioVoluntarios
        celulaEstacao.innerHTML = horario.estacao
    }
}

function exibirEnderecos(enderecos) {
    let div = document.querySelector('.enderecos')
    div.innerHTML = ""

    for (let endereco of enderecos) {
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

    let idAvisoResp = aviso.idAviso

    botoesRespostas(respostasContainer, div, idAvisoResp)

    criarModal(idAvisoResp, aviso.apelido)

}

async function filtrarAvisos() {
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    exibirAvisos(avisos)
}

async function filtrar(ordem) {
    const postsEndPoint = '/posts'
    const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
    const posts = (await axios.get(URLcompletaPosts)).data
    const avisosEndpoint = '/avisos'
    const URLcompletaAvisos = `${protocolo}${baseURL}${avisosEndpoint}`
    const avisos = (await axios.get(URLcompletaAvisos)).data
    if (ordem == 1) {
        exibirPosts(posts)
    }
    else if (ordem == 0) {
        antigos = [...posts].reverse()
        exibirPosts(antigos)
    }
    else if (ordem == 2) {
        exibirAvisos(avisos.reverse())
    }
}

function exibirAvisos(avisos) {
    let filtrarTudo = document.querySelector('.filtro-inicio')
    filtrarTudo.classList.remove('d-none')
    let filtroAvisos = document.querySelector('.filtro-avisos')
    filtroAvisos.innerHTML = "Avisos Mais Recentes"
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

    for (let aviso of avisos) {
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

        let idAvisoResp = aviso.idAviso

        botoesRespostas(respostasContainer, div, idAvisoResp)

        criarModal(idAvisoResp, aviso.apelido)
    }

}

function exibirPosts(posts) {
    let div = document.querySelector('.posts')
    div.innerHTML = ""
    const h4 = document.createElement('h4')
    h4.textContent = "Posts"
    div.appendChild(h4)

    for (let post of posts) {

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

function montarPost(divPost, post, formatacaoDiv, formatacaoBalao, div, tipo) {
    if (tipo == "post") {
        divAviso = document.createElement('div')
    }
    else {
        divAviso = divPost
    }

    divAviso.innerHTML = ""
    divAviso.className = formatacaoDiv

    let postFoto = document.createElement('img')
    postFoto.src = "/front/images/user_icon.png"
    postFoto.id = "forum-icon"

    let divFoto = document.createElement('div')
    divFoto.className = "col-1"
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
        imgAviso.id = "imagemForum"
        imgAviso.src = `/front${post.imagemPost}`
        divBalao.appendChild(imgAviso)
    }

    divAviso.appendChild(divFoto)
    divAviso.appendChild(divBalao)
    div.appendChild(divAviso)
}

function botoesRespostas(respostasContainer, div, idPost) {
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

    let responder = document.createElement('button')
    responder.className = "color-secondary justify-content-start btn border border-0"
    responder.innerHTML = "Responder"
    responder.setAttribute('data-bs-toggle', 'modal')
    responder.setAttribute('data-bs-target', `#modalResposta${idPost}`)
    responder.style = "background-color: transparent;"
    responder.disabled = true
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    if (idTipoLogin) {
        responder.disabled = false
    }
    else {
        responder.disabled = true
    }

    botoes.appendChild(responder)
    botoes.appendChild(mostrarRespostas)
    botoes.appendChild(esconderRespostas)

    div.appendChild(botoes)
}

function criarModal(idPost, apelido) {
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
    let labelImagem = document.createElement('label')
    labelImagem.className = "col-form-label"
    labelImagem.textContent = "Insira uma imagem:"
    labelImagem.setAttribute("for", `imagemResposta${idPost}`)
    let p = document.createElement('p')
    p.textContent = "(Não obrigatório)"
    p.style = "font-weight: lighter; font-style: italic; font-size: medium;"
    labelImagem.appendChild(p)
    let inputImagem = document.createElement('input')
    inputImagem.setAttribute("type", "file")
    inputImagem.name = "imagem"
    inputImagem.className = "form-control"
    inputImagem.id = `imagemResposta${idPost}`  
    inputImagem.setAttribute("accept", "image/*")  
    div4.appendChild(labelImagem)
    div4.appendChild(inputImagem)
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

async function enviarPost() {
    let idTipoPost = document.querySelector('#selecionarTipoPost').value
    let idUsuario = localStorage.getItem("idLogin")
    let textArea = document.querySelector('#mensagemPost')
    let resposta = textArea.value

    const fileInput = document.getElementById('imagemInput')

    const tempoPassado = Date.now()
    let data = new Date(tempoPassado)
    let hora = data.getHours().toString().padStart(2, '0')
    let minuto = data.getMinutes().toString().padStart(2, '0')
    let horarioAtual = `${hora}:${minuto}`
    let dataAtual = data.toLocaleDateString()

    if (!idUsuario || !resposta) {
        alert("Por favor, verifique os dados antes de enviar.")
        return;
    }

    try {
        const postsEndPoint = '/posts';
        const URLcompletaPosts = `${protocolo}${baseURL}${postsEndPoint}`
        const respostaPost = await axios.post(URLcompletaPosts, {
            postagem: resposta,
            idLogin: idUsuario,
            idTipoPostagem: idTipoPost,
            data: dataAtual,
            horario: horarioAtual
        })

        const idPostCriado = respostaPost.data.idPost[0] // Extraindo o ID corretamente
        console.log("ID do post criado:", idPostCriado)

        if(fileInput.files.length !== 0){
            // Enviar a imagem usando FormData
            const formData = new FormData();
            formData.append('imagem', fileInput.files[0])
            formData.append('idPost', idPostCriado) 
            const uploadEndpoint = '/uploadForum'
            const URLcompletaUpload = `${protocolo}${baseURL}${uploadEndpoint}`
            await axios.post(URLcompletaUpload, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }
        prepararForum()
        textArea.value = ""
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
}

async function enviarResposta(idTipoPost, idPost, idModal) {
    let idUsuario = localStorage.getItem("idLogin")
    let textArea = document.querySelector('#mensagemPost')
    let resposta = textArea.value
    let idTipoPostagem = idTipoPost
    let idPostResp = idPost
      
    const formData = new FormData()
    const fileInput = document.getElementById(`imagemResposta${idPost}`)
        
    if (fileInput.files.length === 0) {
        alert("Por favor, selecione uma imagem.")
        return
    }
    
    formData.append('imagem', fileInput.files[0])

    const tempoPassado = Date.now()
    let data = new Date(tempoPassado)
    let hora = data.getHours().toString().padStart(2, '0')
    let minuto = data.getMinutes().toString().padStart(2, '0')
    let horarioAtual = `${hora}:${minuto}`
    dataAtual = data.toLocaleDateString()

    const respostasEndpoint = '/respostas'
    const URLcompletaResposta = `${protocolo}${baseURL}${respostasEndpoint}`
    try {
        let respostaPost = await axios.post(URLcompletaResposta, {postagem: resposta, idLogin: idUsuario, idTipoPostagem: idTipoPostagem, idPostagemResp: idPostResp, data: dataAtual, horario: horarioAtual})
        prepararForum()
        textArea.value = ""
        const idPostCriado = respostaPost.data.idPost

        // Se há uma imagem, envia a imagem em seguida
        if(fileInput.files.length !== 0){
            // Enviar a imagem usando FormData
            const formData = new FormData();
            formData.append('imagem', fileInput.files[0])
            formData.append('idPost', idPostCriado) 
            const uploadEndpoint = '/uploadForum'
            const URLcompletaUpload = `${protocolo}${baseURL}${uploadEndpoint}`
            await axios.post(URLcompletaUpload, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }
        prepararForum()
        textArea.value = "" 
    } catch (error) {
        console.error(error.response?.data || error.message)
    }

}

// Códigos para visualizar a página de Desafios 
async function prepararPaginaDesafios() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    const logout = document.querySelector('#logoutButton')
    const login = document.querySelector('.login-link')
    const adicionarDesafio = document.querySelector('#adicionarDesafioButton')
    // const apagarDesafio = document.querySelector('#apagarDesafioButton')
    const verEstatisticas = document.querySelector('#verEstatisticasButton')
    if (idTipoLogin) {
        logout.classList.remove('d-none')
        login.setAttribute("href", 'configuracoes.html')
        if(idTipoLogin == 1){
            adicionarDesafio.classList.remove('d-none')
            // apagarDesafio.classList.remove('d-none')
            verEstatisticas.classList.remove('d-none')
        }
        else{
            adicionarDesafio.classList.add('d-none')
            // apagarDesafio.classList.add('d-none')
            verEstatisticas.classList.add('d-none')
        }
    }
    else {
        logout.classList.add('d-none')
        login.setAttribute("href", 'login.html')
        adicionarDesafio.classList.add('d-none')
        // apagarDesafio.classList.add('d-none')
        verEstatisticas.classList.add('d-none')
    }
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
        for (let desafio of topicoDesafio.desafio) {
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
            for (let alternativa of alternativasEmbaralhadas) {
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
                    if (resposta == desafio.respostaCorreta) {
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
    const response = await axios.post(URLcompletaDesafios, { idQuestao: questao, assinalada: assinalada, quantidade: quantidade })
    console.log(response)
}


// Códigos para as páginas login e cadastro
async function prepararPaginaLogin() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
}

function exibeAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.remove(...classesToAdd)
        alert.classList.add(...classesToRemove)
    }, timeout)
}

function esconderModal(seletor, timeout, acao) {
    // Seleciona o elemento do modal
    const modalElement = document.querySelector(seletor)

    // Verifica se o modal existe e inicializa se necessário
    let modal = bootstrap.Modal.getInstance(modalElement)
    if (!modal) {
        modal = new bootstrap.Modal(modalElement)
    }

    // Define a ação (mostrar ou esconder)
    if (acao === 'esconder') {
        setTimeout(() => {
            modal.hide()
        }, timeout || 0) // Aplica timeout se fornecido
    } else if (acao === 'mostrar') {
        setTimeout(() => {
            modal.show()
        }, timeout || 0) // Aplica timeout se fornecido
    }
}

function validaEntradasCadastro() {
    // Obtém os valores dos campos
    const apelido = document.querySelector('#apelidoInput').value.trim()
    const email = document.querySelector('#emailCadastroInput').value.trim()
    const senha1 = document.querySelector('#senhaCadastroInput').value.trim()
    const senha2 = document.querySelector('#senhaCadastroInput2').value.trim()

    // Verifica se todos os campos estão preenchidos
    if (!apelido || !email || !senha1 || !senha2) {
        exibeAlerta('.alert-cadastro', "Preencha todos os campos!", ['show', 'alert-danger'], ['d-none'], 4000)
        return
    }
    // Verifica se as senhas coincidem
    if (senha1 !== senha2) {
        exibeAlerta('.alert-cadastro', "Digite a mesma senha nos dois campos!", ['show', 'alert-danger'], ['d-none'], 4000)
        return
    }
    // Exibe o modal de termos e condições
    esconderModal('#modalTermos', 0, 'mostrar')
}

async function cadastrarUsuario() {
    // Seleciona o checkbox e a mensagem de feedback
    const checkbox = document.getElementById('termosCheck')
    let div = document.querySelector('.termosFeedback')
    // Pega os valores dos campos de input
    let emailInput = document.querySelector('#emailCadastroInput')
    let senhaInput = document.querySelector('#senhaCadastroInput')
    let senhaInput2 = document.querySelector('#senhaCadastroInput2')
    let apelidoInput = document.querySelector('#apelidoInput')
    let email = emailInput.value
    let senha = senhaInput.value
    let apelido = apelidoInput.value
    // Determinando o idTipoLogin (1 é Voluntário e 2 é Comum)
    let idTipoLogin = 2;

    // Verifica se o checkbox está marcado
    if (!checkbox.checked) {
        checkbox.classList.add('is-invalid')
        div.className = "invalid-feedback"
        div.innerHTML = "Você deve concordar com os Termos antes de continuar"
    } else {
        // Esconde o modal
        checkbox.classList.remove('is-invalid')
        esconderModal('#modalTermos', 10, 'esconder')
        try {
            console.log('Entrei no try')
            // Cadastra o usuário
            let cadastroUsuarioEndPoint = '/cadastro'
            let URLcompleta = `${protocolo}${baseURL}${cadastroUsuarioEndPoint}`
            await axios.post(URLcompleta, { apelido: apelido, email: email, senha: senha, idTipoLogin: idTipoLogin })
            apelidoInput.value = ""
            emailInput.value = ""
            senhaInput.value = ""
            senhaInput2.value = ""
            exibeAlerta('.alert-cadastro', "Usuário cadastrado com sucesso!", ['show', 'alert-success'], ['d-none'], 4000)
            // Redireciona para a página de login
            window.location.href = "/front/login.html"
        } 
        catch(e) {
            exibeAlerta('.alert-cadastro', "Não foi possível cadastrar usuário. Tente mais tarde...", ['show', 'alert-danger'], ['d-none'], 4000)
        }
    }
}

async function fazerLogin() {
    // Pega os valores dos campos de input
    let emailInput = document.querySelector('#emailLoginInput')
    let senhaInput = document.querySelector('#senhaLoginInput')
    let emailInserido = emailInput.value
    let senhaInserida = senhaInput.value
    if (emailInserido && senhaInserida) {
        try {
            const loginEndPoint = '/login'
            const URLcompleta = `${protocolo}${baseURL}${loginEndPoint}`
            const response = await axios.post(URLcompleta, { email: emailInserido, senha: senhaInserida })

            emailInput.value = ""
            senhaInput.value = ""

            const { idLogin, idTipoLogin } = response.data

            exibeAlerta('.alert-login', "Usuário logado com sucesso", ['show', 'alert-success'], ['d-none'], 4000)

            localStorage.setItem("idLogin", idLogin)
            localStorage.setItem("idTipoLogin", idTipoLogin)
            window.location.href = "/front/index.html"
        }catch(e) {
            exibeAlerta('.alert-login', "Falha na autenticação! Confira se você preencheu os campos corretamente!", ['show', 'alert-danger'], ['d-none'], 4000)
        }
    }
    else {
        exibeAlerta('.alert-login', "Preencha todos os campos!", ['show', 'alert-danger'], ['d-none'], 2000)
    }
}

async function prepararPaginaMensagensContato() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
    const mensagemEndpoint = '/mensagens'
    const URLcompleta = `${protocolo}${baseURL}${mensagemEndpoint}`
    const mensagens = (await axios.get(URLcompleta)).data
    console.log(mensagens)
    exibirMesagens(mensagens)
}

function exibirMesagens(mensagens) {
    console.log(mensagens)
    let divMensagens = document.querySelector('#mensagens')
    for (let mensagem of mensagens) {

        let divBorda = document.createElement('div')
        divBorda.className = "border border-3 rounded-2 my-3 p-4 col-md-8"
        divBorda.style = "border-color: #002687 !important; margin: auto;"

        let nome = document.createElement('p')
        nome.textContent = `Nome Completo: ${mensagem.nomeCompleto}`

        let email = document.createElement('p')
        email.textContent = `E-mail: ${mensagem.email}`

        let duvida = document.createElement('p')
        duvida.textContent = `Mensagem: ${mensagem.duvida}`
       
        divBorda.appendChild(nome)
        divBorda.appendChild(email)
        divBorda.appendChild(duvida)
        divMensagens.appendChild(divBorda)
    }
}

function mostrarSenha(idInput, idButton, idInput2) {
    const senhaInput = document.getElementById(idInput)
    const button = document.getElementById(idButton)

    if (idInput2) {
        const senhaInput2 = document.getElementById(idInput2)
        if (senhaInput2.type == "password") {
            senhaInput2.type = "text"
        }
        else {
            senhaInput2.type = "password"
        }
    }

    if (senhaInput.type == "password") {
        senhaInput.type = "text"
        button.textContent = "Esconder Senha"
    } else {
        senhaInput.type = "password"
        button.textContent = "Mostrar Senha"
    }
}

// Funções para carregar a página Configurações
async function prepararPaginaConfiguracoes() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
    const id = localStorage.getItem("idLogin")
    console.log(id)

    const configuracoesEndpoint = '/configuracoes'
    const URLcompletaConfiguracoes = `${protocolo}${baseURL}${configuracoesEndpoint}`
    const infos = (await axios.post(URLcompletaConfiguracoes, {id: id})).data
    exibirLogin(infos)
}

function exibirLogin(infos){
    console.log("exibindo infos")
    let apelido = document.querySelector('#editApelido')
    let email = document.querySelector('#editEmail')
    email.value = infos[0]
    apelido.value = infos[1]
}

async function salvarConfiguracoes(){
    const id = localStorage.getItem("idLogin")
    console.log(id)
    let apelido = (document.querySelector('#editApelido')).value
    let email = (document.querySelector('#editEmail')).value
    let senha = (document.querySelector('#editSenha')).value

    if(!senha){
        const configuracoesEndpoint = '/editConfiguracoes'
        const URLcompletaConfiguracoes = `${protocolo}${baseURL}${configuracoesEndpoint}`
        const novoLogin = (await axios.post(URLcompletaConfiguracoes, {id: id, apelido: apelido, email: email})).data
        console.log(novoLogin)
    }else{
        salvarNovaSenha(senha)
    }
}

async function salvarNovaSenha(senha) {
    const id = localStorage.getItem("idLogin")
    console.log(senha)
    const configuracoesEndpoint = '/editSenha'
    const URLcompletaConfiguracoes = `${protocolo}${baseURL}${configuracoesEndpoint}`
    const novaSenha = (await axios.post(URLcompletaConfiguracoes, {id: id, senha: senha})).data
    console.log(novaSenha)
}

function habilitarCampo(id) {
    const field = document.getElementById(id);
    const button = document.getElementById('edit' + id.charAt(0).toUpperCase() + id.slice(1) + 'Button');
    
    field.disabled = false;
}

function modoDaTela(modo) {
    if(!localStorage.getItem('tema')){
        localStorage.setItem('tema', modo)
    }
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
        localStorage.removeItem('tema')
        localStorage.setItem('tema', 'escuro')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
        localStorage.removeItem('tema')
        localStorage.setItem('tema', 'claro')
    }
}

async function adicionarDesafio() {
    // Pega os valores dos campos de input
    let enunciado = document.querySelector('#perguntaTextarea')
    let respostacorreta = document.querySelector('#respostacorretaTextarea')
    let resposta1 = document.querySelector('#respostaincorreta1Textarea')
    let resposta2 = document.querySelector('#respostaincorreta2Textarea')
    let resposta3 = document.querySelector('#respostaincorreta3Textarea')
    let resposta4 = document.querySelector('#respostaincorreta4Textarea')
    let resolucao = document.querySelector('#resolucaoTextarea')
    let select = document.querySelector('#topicoDesafio')
    select = select.value 
    console.log (select)
    enunciado = enunciado.value
    respostacorreta = respostacorreta.value
    resposta1 = resposta1.value
    resposta2 = resposta2.value
    resposta3 = resposta3.value
    resposta4 = resposta4.value
    resolucao = resolucao.value
    if (enunciado && respostacorreta && resposta1 && resposta2 && resposta3) {
        try {
            const desafiosEndPoint = '/desafioNovo'
            const URLcompleta = `${protocolo}${baseURL}${desafiosEndPoint}`
            const response = await axios.post(URLcompleta, {enunciado: enunciado, respostacorreta: respostacorreta, resposta1: resposta1, resposta2: resposta2, resposta3: resposta3, resposta4: resposta4, resolucao: resolucao, select: select})

            enunciado.value = ""
            respostacorreta.value = ""
            resposta1.value = ""
            resposta2.value = ""
            resposta3.value = ""
            resposta4.value = ""
            resolucao.value = ""

            exibeAlerta('.alert-desafios', "Questão enviada com sucesso!", ['show', 'alert-success'], ['d-none'], 4000)
        }catch(e) {
            exibeAlerta('.alert-desafios', "Falha ao enviar o desafio", ['show', 'alert-danger'], ['d-none'], 4000)
        }
    }
    else {
        exibeAlerta('.alert-desafios', "Preencha todos os campos!", ['show', 'alert-danger'], ['d-none'], 2000)
    }
}

async function removerTopicoDesafio() {
    const select = document.querySelector('#topicoApagarDesafio')
    const topico = select.value
    if(topico){
        try {
            const removerEndpoint = '/removerTopico'
            const URLcompleta = `${protocolo}${baseURL}${removerEndpoint}`
            await axios.post(URLcompleta, {idTopico: topico})

            exibirTopicoDesafios('#topicoApagarDesafio')

            exibeAlerta('.alert-remover-desafios', "Tópico removido com sucesso!", ['show', 'alert-success'], ['d-none'], 4000)
        }catch(e) {
            exibeAlerta('.alert-remover-desafios', "Para remover um tópico é importante que não há nenhuma questão relacionada a ele!", ['show', 'alert-danger'], ['d-none'], 4000)
        }
    }
    else {
        exibeAlerta('.alert-remover-desafios', "Selecione um tópico", ['show', 'alert-danger'], ['d-none'], 2000)
    }
}


async function exibirTopicoDesafios(seletor){
    let select = document.querySelector(seletor)
    select.innerHTML = ""
    const desafiosEndpoint = '/topico'
    const URLcompleta = `${protocolo}${baseURL}${desafiosEndpoint}`
    const desafios = (await axios.get(URLcompleta)).data
    for(let desafio of desafios){
        const option = document.createElement('option')
        option.innerHTML = desafio.topicoDesafios
        option.value = desafio.idtopicoDesafios
        select.appendChild(option)
        if(seletor == "#topicoApagarDesafio"){
            option.addEventListener("mouseover", async function () {
                let select2 = document.querySelector('#topicoApagarQuestao')
                select2.innerHTML = ""
                const questoesEndpoint = '/questoes'
                const URLcompletaQuestoes = `${protocolo}${baseURL}${questoesEndpoint}`
                const questoes = (await axios.get(URLcompletaQuestoes)).data
                for(let questao of questoes){
                    const optionQuestao = document.createElement('option')
                    optionQuestao.innerHTML = questao.enunciado
                    optionQuestao.value = questao.idDesafio
                    select2.appendChild(optionQuestao)
                    optionQuestao.addEventListener("click", async function () {

                    })
                }
            })
        }
    }
}

function mostrarCampo(seletor, classesToAdd, classesToRemove) {
    let elemento = document.querySelector(seletor)
    if(classesToAdd){
        elemento.classList.add(... classesToAdd)
    }
    if(classesToRemove){
        console.log(classesToRemove)
        console.log(elemento)
        elemento.classList.remove(... classesToRemove)
    }
     
}

async function adicionarTopico() {
    let topicoInserido = (document.querySelector('#topicoInput'))
    let topico = topicoInserido.value
        if (topico){
        try{
            const topicoEndpoint = '/topico'
            const URLtopico = `${protocolo}${baseURL}${topicoEndpoint}`
            const response = await axios.post(URLtopico, {topico: topico})
            console.log(response)
            mostrarCampo('.inputclass', ['d-none'], null)
            exibirTopicoDesafios('#topicoAdicionarDesafio')
        }
        catch(e) {
            console.log(e)
        }
    } else {
        exibeAlerta('.alert-topico', 'Preencha o campo!', ['show','alert-danger'], ['d-none'], 4000)
        console.log("Preencha todos os campos!")
    }

}

async function prepararPaginaEstatisticas() {
    const modo = localStorage.getItem('tema')
    if (modo == 'escuro') {
        document.body.classList.add('night-mode')
    } else if(modo == 'claro'){
        document.body.classList.remove('night-mode')
    }
    const idTipoLogin = localStorage.getItem("idTipoLogin")
    const logout = document.querySelector('#logoutButton')
    const login = document.querySelector('.login-link')
    if (idTipoLogin) {
        logout.classList.remove('d-none')
        login.setAttribute("href", 'configuracoes.html')
    }
    else {
        logout.classList.add('d-none')
        login.setAttribute("href", 'login.html')
    }
    const desafiosEndpoint = '/desafios'
    const URLcompletaDesafios = `${protocolo}${baseURL}${desafiosEndpoint}`
    const desafios = (await axios.get(URLcompletaDesafios)).data
    exibirEstatisticas(desafios)
}

function exibirEstatisticas(topicosDesafio){
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
        for (let desafio of topicoDesafio.desafio) {
            const divQuestao = document.createElement('div')
            divQuestao.className = "my-2 p-4 border-bottom border-3"
            divQuestao.style = "border-color: #002687 !important;"

            const enunciado = document.createElement('p')
            enunciado.innerHTML = `${i}.  ${desafio.questao}`

            const escolha = document.createElement('p')
            escolha.style = "font-weight: bold;"
            escolha.innerHTML = "Porcentagem das respostas assinaladas:"

            const qtdeRespCorreta = desafio.porcentagemRespCorreta
            const qntdRespIncorreta1 = desafio.porcentagemRespIncorretas[0]
            const qntdRespIncorreta2 = desafio.porcentagemRespIncorretas[1]
            const qntdRespIncorreta3 = desafio.porcentagemRespIncorretas[2]
            const qntdRespIncorreta4 = desafio.porcentagemRespIncorretas[3]
            const qtdeTotal = qtdeRespCorreta + qntdRespIncorreta1 + qntdRespIncorreta2 + qntdRespIncorreta3 + qntdRespIncorreta4
            const porcentagemRespCorreta = qtdeRespCorreta / qtdeTotal * 100
            const porcentagemRespIncorreta1 = qntdRespIncorreta1 / qtdeTotal * 100
            const porcentagemRespIncorreta2 = qntdRespIncorreta2 / qtdeTotal * 100
            const porcentagemRespIncorreta3 = qntdRespIncorreta3 / qtdeTotal * 100
            const porcentagemRespIncorreta4 = qntdRespIncorreta4 / qtdeTotal * 100

            const divPorcentagens = document.createElement('div')

            const p1 = document.createElement('p')
            p1.textContent = `Resposta correta(${desafio.alternativas[0]}): ${porcentagemRespCorreta}`
            divPorcentagens.appendChild(p1)
            const p2 = document.createElement('p')
            p2.textContent = `${desafio.alternativas[1]}: ${porcentagemRespIncorreta1}`
            divPorcentagens.appendChild(p2)
            const p3 = document.createElement('p')
            p3.textContent = `${desafio.alternativas[2]}: ${porcentagemRespIncorreta2}`
            divPorcentagens.appendChild(p3)
            const p4 = document.createElement('p')
            p4.textContent = `${desafio.alternativas[3]}: ${porcentagemRespIncorreta3}`
            divPorcentagens.appendChild(p4)
            if(desafio.alternativas[4]){
                const p5 = document.createElement('p')
                p5.textContent = `${desafio.alternativas[4]}: ${porcentagemRespIncorreta4}`
                divPorcentagens.appendChild(p5)
            }

            const divResolucao = document.createElement('div')
            const resolucao = document.createElement('p')
            resolucao.innerHTML = desafio.resolucao
            divResolucao.appendChild(resolucao)

            divQuestao.appendChild(enunciado)
            divQuestao.appendChild(divPorcentagens)
            divQuestao.appendChild(divResolucao)

            details.appendChild(divQuestao)

            i++
        }

        div.appendChild(details)

    }
}
