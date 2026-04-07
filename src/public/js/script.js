let nome_de_usuario;
let entrada_email;
let entrada_senha;

const modal = document.getElementById("errorModal");
const closeBtn = document.getElementById("closeBtn");
const closeX = document.querySelector(".close");
const errorMessage = document.getElementById("errorMessage");

function mostrarErro(msg) {
  errorMessage.textContent = msg;
  modal.classList.add("show");
}

closeBtn.onclick = () => modal.classList.remove("show");


closeX.onclick = () => modal.classList.remove("show");


window.onclick = (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
};



function ValoresEntradas(){
entrada_email = document.getElementById("entry_email").value;
entrada_senha = document.getElementById("entry_senha").value;
}

function LimparEntradas(){
    entrada_email = document.getElementById("entry_email").value = "";
    entrada_senha = document.getElementById("entry_senha").value = "";
}




async function EnviarDadosLogin(){
    try {
        ValoresEntradas();
        
        if (!entrada_email || !entrada_senha) {
            mostrarErro("❌ Preencha email e senha");
            return;
        }

        const dados = {
            email: entrada_email.trim(),
            senha: entrada_senha.trim()
        };


        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        

        if (!response.ok) {
            mostrarErro("❌ Login inválido");
            LimparEntradas();
            return;
        }

        const resultado = await response.json();
    

        if (resultado.status){
            localStorage.setItem("email_usuario", entrada_email);
            LimparEntradas();
            window.location.href = "mainprincipal.html";
            
        }
        else{
            mostrarErro("❌ Login inválido");
            LimparEntradas();
        }
    } catch (error) {
        mostrarErro("❌ Erro de conexão. Servidor não respondeu!");
        LimparEntradas();
    }
}

document.getElementById("botao_entrar")
  .addEventListener("click", EnviarDadosLogin);













