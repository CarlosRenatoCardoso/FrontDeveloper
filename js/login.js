let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');

const emailBanco = "admin@admin";
const senhaBanco = "123";

btnEntrar.addEventListener('click',()=>{
    window.open('cadastro-usuario.html','_self')
});