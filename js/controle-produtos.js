const URL = 'http://localhost:3400/produtos';
let modoEdicao = false;

let listaProdutos = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaProdutos = document.querySelector('table>tbody');
let modalProduto = new bootstrap.Modal(document.getElementById("modal-produto"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    valor: document.getElementById('valor'),
    estoque: document.getElementById('quantidadeEstoque'),
    observacao: document.getElementById('observacao'),
    dataCadastro: document.getElementById('dataCadastro'),
}

function obterProdutoDoModal() {
    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        quantidadeEstoque: formModal.estoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value) ? new Date(formModal.dataCadastro.value).toISOString() : new Date().toISOString()
    })
}

function limparModalProduto() {
    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.valor.value = "";
    formModal.estoque.value = "";
    formModal.observacao.value = "";
    formModal.dataCadastro.value = "";
}

function atualizarModalProduto(produto) {
    formModal.id.value = produto.id;
    formModal.nome.value = produto.nome;
    formModal.valor.value = produto.valor;
    formModal.estoque.value = produto.quantidadeEstoque;
    formModal.observacao.value = produto.observacao;
    formModal.dataCadastro.value = produto.dataCadastro.substring(0,10);
}

function obterProdutos() {

    fetch(URL, {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(response => {
            listaProdutos = response;
            popularTabela(response);
        })
        .catch()
}

function editarProduto(id) {
    modoEdicao = true;
    tituloModal.textContent = "Editar produto"
    let produto = listaProdutos.find(produto => produto.id == id);
    atualizarModalProduto(produto);
    modalProduto.show();
}

function excluirProduto(id) {
    let produto = listaProdutos.find(p => p.id == id);
    Swal.fire({
        title: 'Deseja realmente excluir o produto ' + produto.nome,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#43A047',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      }).then((result) => {
        if (result.isConfirmed) {
            excluirProdutoBackEnd(produto);
        }
      })
}

function criarLinhaNaTabela(produto) {
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdEstoque.textContent = produto.quantidadeEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();

    tdAcoes.innerHTML = `<button onclick="editarProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-2">Editar</button>
                         <button onclick="excluirProduto(${produto.id})" class="btn btn-outline-primary btn-sm mr-2">Excluir</button>`


    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaProdutos.appendChild(tr);
}

function popularTabela(produtos) {
    tabelaProdutos.textContent = "";
    produtos.forEach(produto => {
        criarLinhaNaTabela(produto);
    });
}

btnAdicionar.addEventListener('click', () => {
    modoEdicao = false;
    tituloModal.textContent = "Adicionar produto";
    limparModalProduto();
    modalProduto.show();
})

btnSalvar.addEventListener('click', () => {
    let produto = obterProdutoDoModal();

    if (!produto.nome || !produto.valor) {
        Swal.fire({
            icon: 'error',
            text: 'Nome e Valor são obrigatórios!',
        })
        return;
    }

    (modoEdicao) ? atualizarProdutoBackEnd(produto) : adicionarProdutoBackEnd(produto);
})

btnCancelar.addEventListener('click', () => {
    modalProduto.hide();
})

function adicionarProdutoBackEnd(produto) {
    produto.dataCadastro = new Date().toISOString();
    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(response => {
            let novoProduto = new Produto(response);
            listaProdutos.push(novoProduto);
            popularTabela(listaProdutos);
            modalProduto.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Produto adicionado com sucesso!',
                showConfirmButton: false,
                timer: 2000
              })
        })
        .catch(error => {
            console.log(error)
        })
}

function atualizarProdutoBackEnd(produto) {
    fetch(`${URL}/${produto.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(produto)
    })
        .then(response => response.json())
        .then(() => {
            atualizarProdutoNaLista(produto, false);
            modalProduto.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Produto editado com sucesso!',
                showConfirmButton: false,
                timer: 2000
              })
        })
        .catch(error => {
            console.log(error)
        })
}

function excluirProdutoBackEnd(produto) {
    fetch(`${URL}/${produto.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        }
    })
        .then(() => {
            atualizarProdutoNaLista(produto, true);
            modalProduto.hide();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Produto excluido com sucesso!',
                showConfirmButton: false,
                timer: 2000
              })
        })
        .catch(error => {
            console.log(error)
        })
}

function atualizarProdutoNaLista(produto, removerProduto) {
    let indice = listaProdutos.findIndex((p) => p.id == produto.id);
    (removerProduto) ? listaProdutos.splice(indice, 1) : listaProdutos.splice(indice, 1, produto);
    popularTabela(listaProdutos);
}

obterProdutos();