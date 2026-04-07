
const email_do_usuario = localStorage.getItem("email_usuario");
let email = "";
let username = "";
let cpf = "";
let nome = "";



const successModal = document.getElementById("successModal");
const errorModal = document.getElementById("errorModal");

const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const closeErrorBtn = document.getElementById("closeErrorBtn");

const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

const closeButtons = document.querySelectorAll(".modal .close");


function mostrarSucesso(msg) {
  successMessage.textContent = msg;
  successModal.classList.add("show");
}

function mostrarErro(msg) {
  errorMessage.textContent = msg;
  errorModal.classList.add("show");
}

function fecharSucesso() {
  successModal.classList.remove("show");
}

function fecharErro() {
  errorModal.classList.remove("show");
}


closeSuccessBtn.onclick = fecharSucesso;
closeErrorBtn.onclick = fecharErro;


closeButtons.forEach(btn => {
  btn.onclick = function() {
    this.closest(".modal").classList.remove("show");
  };
});


window.onclick = (e) => {
  if (e.target === successModal) {
    fecharSucesso();
  }
  if (e.target === errorModal) {
    fecharErro();
  }
};



async function DadosEntradas(){

    const dados = {
        email: email_do_usuario
    };

    const response = await fetch ("http://127.0.0.1:8000/edit",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"

        },
        body: JSON.stringify(dados)
    });

    const result = await response.json();

    if(result.error){
        alert(result.error);
    }
    else {
        document.getElementById("input-nome").value = result.nome;
        document.getElementById("input-email").value = result.email;
        document.getElementById("input-username").value = result.username;
        document.getElementById("input-cpf").value = result.cpf;
    }          



}

DadosEntradas();


function LimparEntradas(){
    document.getElementById("input-nome").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-username").value = "";
    document.getElementById("input-cpf").value = "";
    document.getElementById("input-senha").value = "";
}


async function AlteracaoDados(){

    let nome = document.getElementById("input-nome").value;
    let email = document.getElementById("input-email").value;
    let username = document.getElementById("input-username").value;
    let cpf = document.getElementById("input-cpf").value;
    let senha = document.getElementById("input-senha").value;

    if (senha === ""){
        mostrarSucesso("Senha atual mantida!")
    }

    const dados = {
        email_antigo: email_do_usuario,
        email: email.trim(),
        nome: nome.trim(),
        username: username.trim(),
        cpf: cpf.trim(),
        senha: senha.trim()
    };

    console.log("Dados enviados:", dados);

    try {
        const response = await fetch("http://127.0.0.1:8000/sendedit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        console.log("Resultado:", result);

        if (result.status){
            mostrarSucesso("Usuário Alterado!");
            setTimeout(() => {
                window.location.href = "mainprincipal.html";
            }, 1500);
        }
        else {
            mostrarErro(result.error || "Alteração Inválida");
        }
    } catch (erro) {
        console.error("Erro ao alterar:", erro);
        mostrarErro("Erro ao conectar com servidor!");
    }
}