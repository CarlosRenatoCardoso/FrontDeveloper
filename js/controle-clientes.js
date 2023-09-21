const URL = 'http://localhost:3400/clientes';
let modoEdicao = false;

let listaClientes = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaClientes = document.querySelector('table>tbody');
let modalCliente = new bootstrap.Modal(document.getElementById("modal-cliente"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    cpf: document.getElementById('cpf'),
    telefone: document.getElementById('telefone'),
    dataCadastro: document.getElementById('dataCadastro'),
}

btnAdicionar.addEventListener('click', () => {
    modoEdicao = false;
    tituloModal.textContent = "Adicionar cliente";
    limparModalCliente();
    modalCliente.show();
})

btnSalvar.addEventListener('click', () => {
    let cliente = obterClienteDoModal();

    if (!cliente.nome || !cliente.email) {
        alert("Nome e E-mail são obrigatórios")
        return;
    }

    adicionarClienteBackEnd(cliente)
})

function obterClienteDoModal() {
    return new Cliente({
        id: formModal.id.value,
        nome: formModal.nome.value,
        email: formModal.email.value,
        cpfOuCnpj: formModal.cpf.value,
        telefone: formModal.telefone.value,
        // dataCadastro: formModal.dataCadastro.value,
    })
}

btnCancelar.addEventListener('click', () => {
    modalCliente.hide();
})

function obterClientes() {

    fetch(URL, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(response => {
            listaClientes = response;
            popularTabela(response);
        })
        .catch()
}

function editarCliente(id) {
    modoEdicao = true;
    tituloModal.textContent = "Editar cliente"
    let cliente = listaClientes.find(cliente => cliente.id == id);
    atualizarModalCliente(cliente);
    modalCliente.show();
}

function atualizarModalCliente(cliente) {
    formModal.id.value = cliente.id;
    formModal.nome.value = cliente.nome;
    formModal.email.value = cliente.email;
    formModal.cpf.value = cliente.cpfOuCnpj;
    formModal.telefone.value = cliente.telefone;
    formModal.dataCadastro.value = cliente.dataCadastro.substring(0,10);
}

function limparModalCliente() {
    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.email.value = "";
    formModal.cpf.value = "";
    formModal.telefone.value = "";
    formModal.dataCadastro.value = "";
}

function excluirCliente(id) {
    alert(id);
}

function criarLinhaNaTabela(cliente) {
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdCPF = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdTelefone = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = cliente.id;
    tdNome.textContent = cliente.nome;
    tdCPF.textContent = cliente.cpfOuCnpj;
    tdEmail.textContent = cliente.email;
    tdTelefone.textContent = cliente.telefone;
    tdDataCadastro.textContent = cliente.dataCadastro;

    tdAcoes.innerHTML = `<button onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-2">Editar</button>
                         <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-2">Excluir</button>`


    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdCPF);
    tr.appendChild(tdEmail);
    tr.appendChild(tdTelefone);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaClientes.appendChild(tr);
}

function popularTabela(clientes) {
    tabelaClientes.textContent = "";
    clientes.forEach(cliente => {
        criarLinhaNaTabela(cliente);
    });
}

function adicionarClienteBackEnd(cliente) {
    cliente.dataCadastro = new Date().toISOString();
    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "token"
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(response => {
        let novoCliente = new Cliente(response);
        listaClientes.push(novoCliente);
        popularTabela(listaClientes);
        modalCliente.hide();
    })
    .catch(error => {
        console.log(error)
    })
}

obterClientes();