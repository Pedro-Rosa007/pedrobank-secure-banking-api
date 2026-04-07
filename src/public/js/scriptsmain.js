const email_do_usuario = localStorage.getItem("email_usuario");


function mostrarSucesso(mensagem) {
  alert(mensagem);
}

function mostrarErro(mensagem) {
  alert(mensagem);
}


async function EnviarDadosMain(){
    if (!email_do_usuario) {
        return;
    }

    const dados = {
        email: email_do_usuario,
    };


    const response = await fetch("http://127.0.0.1:8000/main", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
  });

  const resultado = await response.json();


  if (resultado){

    
    document.getElementById("usuario").innerText = resultado.username
    document.getElementById("cpf").innerText = resultado.cpf
    document.getElementById("nome").innerText = resultado.nome
    document.getElementById("email").innerText = resultado.email

  }

  else{

    console.log("Erro!")
   
  }

}








async function SaldoConta(){


  const dados = {
    email: email_do_usuario,
  };

  const response = await fetch("http://127.0.0.1:8000/mainsaldo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
  });

  const resultado = await response.json();

  if (resultado.saldo !== undefined){
    document.getElementById("saldo_da_conta").value = resultado.saldo;


      const saldoFormatado = resultado.saldo.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    });
    
    document.getElementById("saldo_da_conta").value = saldoFormatado;
  }
}




async function Operations(){


  let input_saque = parseFloat(document.getElementById("valor-saque").value) || 0;
  let input_deposito = parseFloat(document.getElementById("valor-deposito").value) || 0;

  const dados = {
    email: email_do_usuario,
    saque: input_saque,
    deposito: input_deposito
  };

  const response = await fetch("http://127.0.0.1:8000/mainoperacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
  });

  const resultado = await response.json();

  if (resultado.status){
    mostrarSucesso("Operação Realizada!");
    document.getElementById("valor-saque").value = "";
    document.getElementById("valor-deposito").value = "";
    SaldoConta();
  }
  if (!resultado.status){
    mostrarErro("Erro na operação!");
  }


}











SaldoConta();










EnviarDadosMain();