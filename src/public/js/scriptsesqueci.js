window.emailTemporario = "";

async function ValidarEmail(){

    let email_input = document.getElementById("entry-email").value;
    
    const dados = {
        email: email_input
    };

    const response = await fetch ("http://127.0.0.1:8000/esqueciemail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await response.json();


    if (!resultado.status){
        alert("Usuário não cadastrado!")
        document.getElementById("entry-email").value = "";
    }
    
    if (resultado.status){
        localStorage.setItem("emailTemporario", email_input);

        alert("Código de recuperação enviado por Email!")
    }
}



async function ValidarCodigo(){

    let code_input = document.getElementById("entry-codigo").value;
    
    const dados = {
        email: localStorage.getItem("emailTemporario"),
        codigo: code_input
    };

    const response = await fetch ("http://127.0.0.1:8000/esquecicodigo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    const resultado = await response.json();


    if (!resultado.status){
        alert("Código incorreto!")
        document.getElementById("entry-codigo").value = "";
    }
    
    if (resultado.status){
        alert("Código verificado com sucesso!");
        window.location.href = "alterarsenha.html"
    }
}