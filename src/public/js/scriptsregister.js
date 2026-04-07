
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



let nome_input = "";
let username_input = "";
let email_input = "";
let cpf_input = "";
let senha_input = "";
let endpoint1 = true;


function Data(){
  nome_input = document.getElementById("input-nome").value;
  username_input = document.getElementById("input-username").value;
  email_input = document.getElementById("input-email").value;
  cpf_input = document.getElementById("input-cpf").value;
  senha_input = document.getElementById("input-senha").value;
}


function LimparEntradas(){

    let nome_input = document.getElementById("input-nome").value = "";
    let username_input = document.getElementById("input-username").value  = "";
    let email_input = document.getElementById("input-email").value = "";
    let cpf_input = document.getElementById("input-cpf").value = "";
    let senha_input = document.getElementById("input-senha").value = "";

}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function EnviarDadosRegistro(){

        const dados ={
            nome: nome_input.trim(),
            username: username_input.trim(),
            email: email_input.trim(),
            cpf: cpf_input.trim(),
            senha: senha_input.trim()
        };

        const resultado = await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resposta = await resultado.json();

        if (resposta.status){
          mostrarSucesso("Cadastro realizado!");
          LimparEntradas();
          await delay(2000);
          window.location.href = "index.html";
        }

        else if (!resposta.status){
          mostrarErro(resposta.error || "Erro! Cadastro inválido!");
          LimparEntradas();
        }

        else{
          mostrarErro("Erro! Cadastro inválido!");
          LimparEntradas();
        }
      
    }

  

  
function Validation(){
  Data();

  if (cpf_input.length !== 11 || nome_input === "" || username_input === "" || email_input === "" || cpf_input === "" || senha_input === ""){
    endpoint1 = false;
    LimparEntradas();
    mostrarErro("Insira dados válidos");
  }
  else{
    endpoint1 = true;
    EnviarDadosRegistro();
  }
}









