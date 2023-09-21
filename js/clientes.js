const URL = 'http://localhost:3400/clientes';
let tabelaClientes = document.querySelector('table>tbody');

function obterClientes() {

    fetch(URL, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
        popularTabela(response);
    })
    .catch()
}

function editarCliente(id) {
    alert(id);
}

function excluirCliente(id) {
    alert(id);
}

function criarLinhaNaTabela(cliente){
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

function popularTabela (clientes){
    clientes.forEach(cliente => {
        criarLinhaNaTabela(cliente);
    });
}

obterClientes();