let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');

btnEntrar.addEventListener('click', () => {
    let userEmail = email.value;
    let userSenha = senha.value;

    if (!userEmail || !userSenha) {
        Swal.fire({
            icon: 'error',
            text: 'O campo de e-mail e senha são obrigatórios',
        })
        return;
    }

    autenticar(userEmail, userSenha);
});

function autenticar(email, senha) {
    const urlBase = `http://localhost:3400`;

    fetch(`${urlBase}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    })
        .then(response => response = response.json())
        .then(response => {

            if (!!response.mensagem) {
                alert(response.mensagem);
                return;

            } else {

                salvarToken(response.token);
                salvarUsuario(response.usuario);

                // alert("Usuario autenticado com sucesso!");

                Swal.fire({
                    icon: 'success',
                    title: 'Usuario autenticado com sucesso!',
                    showConfirmButton: false,
                    timer: 2500
                  })
                  setTimeout(() => {
                    window.open('controle-cliente.html', '_self')
                  },2500)

            }
        });
}