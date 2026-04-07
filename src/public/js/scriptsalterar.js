async function NovaSenha(){

    const nova_senha = document.getElementById("entry-email").value;
    const email = localStorage.getItem("emailTemporario");

    const dados = {
        email: email,
        senha: nova_senha
    };

    const response = await fetch("http://127.0.0.1:8000/novasenha", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

    const result = await response.json();

    if (result.status){
        alert("Senha alterada com sucesso!");
        window.location.href = "index.html";
    }
}





