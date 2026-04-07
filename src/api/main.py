from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
import random
import mysql.connector
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dicionário para armazenar códigos de recuperação
codigos_recuperacao = {}

# Dicionário para armazenar códigos de recuperação
codigos_recuperacao = {}








class Login(BaseModel):
    email: str
    senha: str




@app.post("/login")
def login(dados: Login):
    
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="Pedrosystem"
    )
    
    cursor = conn.cursor()
    
    entrada_senha = dados.senha
    entrada_email = dados.email
    
    
    cursor.execute("SELECT email, senha, user_name FROM users_acess WHERE email = %s",(dados.email,))
    resultado = cursor.fetchone()
    
    if not resultado:
        return {"status": False}
    
    email_banco = resultado[0]
    senha_banco = resultado[1]
    user = resultado[2]
    
    cursor.close()
    
    
    try:
        senha_verificada = bcrypt.checkpw(entrada_senha.strip().encode('utf-8'), senha_banco.encode('utf-8'))
    except ValueError:

        senha_verificada = entrada_senha.strip() == senha_banco
    
    if email_banco == entrada_email and senha_verificada:
        return {"status": True, "usuario": user}
    else:
        return {"status": False}










class Main(BaseModel):
    email: str





@app.post("/main")
def main(dados: Main):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="Pedrosystem"
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT user_name, cpf, nome FROM users_acess WHERE email = %s",(dados.email,))
    resultado = cursor.fetchone()
    
    username = resultado[0]
    cpf = resultado[1]
    nome = resultado[2]
    
    cursor.close()
    
    if resultado :
        return {"username": username, "email": dados.email, "cpf": cpf, "nome": nome}
    else:
        return {"username": None, "email": None, "cpf": None, "nome": None}
    
    
    
  
    
    
class Registro(BaseModel):
    nome: str
    username: str
    email: str
    cpf: str
    senha: str
    
    
    
    

def gerar_hash_senha(senha: str) -> str:
    senha_limpa = senha.strip()
    senha_limitada = senha_limpa[:72]
    return bcrypt.hashpw(senha_limitada.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')






@app.post("/register")
def register(dados: Registro):
    
    
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="Pedrosystem"
        )
        
        cursor = conn.cursor()

      
        cursor.execute(
            "SELECT email FROM users_acess WHERE email = %s",
            (dados.email.strip(),)
        )
        resultado = cursor.fetchone()
        

        if resultado:
            cursor.close()
            conn.close()
            return {
                "status": False,
                "error": "Email já cadastrado"
            }

        
        senha_hash = gerar_hash_senha(dados.senha.strip())

    
        cursor.execute("""
            INSERT INTO users_acess 
            (email, senha, user_name, nome, cpf) 
            VALUES (%s, %s, %s, %s, %s)
        """, (
            dados.email.strip(),
            senha_hash,
            dados.username.strip(),
            dados.nome.strip(),
            dados.cpf.strip()
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return {
            "status": True,
            "email": dados.email
        }

    except Exception as e:
        print(f"ERRO NO REGISTRO: {str(e)}")
        return {"status": False, "error": str(e)}
    
    
    
    
    
    
    
    
class Edit(BaseModel):
    email: str
    
    
    
@app.post("/edit")
def editar(dados: Edit):
    
    conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="Pedrosystem"
        )
        
    cursor = conn.cursor()

      
    cursor.execute(
            "SELECT email, cpf, user_name, nome FROM users_acess WHERE email = %s",
            (dados.email.strip(),)
        )
    resultado = cursor.fetchone()

    if resultado:
        email, cpf, username, nome = resultado
        return {"email": email, "cpf": cpf, "username": username, "nome": nome}
    else:
        return {"error": "Usuário não encontrado"}
    
    

class Sendedit(BaseModel):
    email_antigo: str  
    email: str
    nome: str
    username: str
    cpf: str
    senha: str = ""  

@app.post("/sendedit")
def sendedit(dados: Sendedit):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="Pedrosystem"
        )
        cursor = conn.cursor()

        if dados.senha:
            senha_hash = gerar_hash_senha(dados.senha.strip())
            cursor.execute(
                "UPDATE users_acess SET nome=%s, user_name=%s, email=%s, cpf=%s, senha=%s WHERE email=%s",
                (dados.nome.strip(), dados.username.strip(), dados.email.strip(), dados.cpf.strip(), senha_hash, dados.email_antigo.strip())
            )
        else:
            cursor.execute(
                "UPDATE users_acess SET nome=%s, user_name=%s, email=%s, cpf=%s WHERE email=%s",
                (dados.nome.strip(), dados.username.strip(), dados.email.strip(), dados.cpf.strip(), dados.email_antigo.strip())
            )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"status": True, "message": "Dados atualizados com sucesso"}
    except Exception as e:
        print(f"ERRO NO SENDEDIT: {str(e)}")
        return {"status": False, "error": str(e)}
    
    
    
    
    
    
    
class Mainsaldo(BaseModel):
    email: str
    
@app.post("/mainsaldo")
def saldo(dados: Mainsaldo):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="Pedrosystem"
    )
    cursor = conn.cursor()
    
    cursor.execute("SELECT saldo FROM users_acess WHERE email = %s", (dados.email,))
    resultado = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if resultado:
        saldo = resultado[0]
        return {"saldo": saldo}
    else:
        return {"erro": "Usuário não encontrado"}
     
     
     
     
     
     
     
     
     
class Mainsoperacao(BaseModel):
    email: str
    saque: float = 0.00
    deposito: float = 0.00
    
    
@app.post("/mainoperacao")
def operacao(dados: Mainsoperacao):
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="Pedrosystem"
        )
        cursor = conn.cursor()
        
       
        cursor.execute("SELECT saldo FROM users_acess WHERE email = %s", (dados.email,))
        resultado = cursor.fetchone()
        
        if not resultado:
            return {"status": False, "error": "Usuário não encontrado"}
        
        saldo = resultado[0]
        
        
        if dados.deposito == 0.00 and dados.saque > 0:
            if saldo < dados.saque:
                cursor.close()
                conn.close()
                return {"status": False, "error": "Saldo insuficiente"}
            
            saldo_atual = saldo - dados.saque
            cursor.execute("UPDATE users_acess SET saldo = %s WHERE email = %s", (saldo_atual, dados.email,))
            conn.commit()
            cursor.close()
            conn.close()
            return {"status": True}
        
        
        elif dados.saque == 0.00 and dados.deposito > 0:
            saldo_atual = saldo + dados.deposito
            cursor.execute("UPDATE users_acess SET saldo = %s WHERE email = %s", (saldo_atual, dados.email,))
            conn.commit()
            cursor.close()
            conn.close()
            return {"status": True}
        else:
            cursor.close()
            conn.close()
            return {"status": False, "error": "Operação inválida"}
            
    except Exception as e:
        print(f"ERRO NO MAINOPERACAO: {str(e)}")
        return {"status": False, "error": str(e)}
    
    
    
def gerar_codigo_recuperacao():
    lista = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    codigo = random.sample(lista, 6)
    return codigo  
    
    
    
    
class Esquecimail(BaseModel):
    email: str
    
@app.post("/esqueciemail")
def esqueci_email(dados: Esquecimail):
    
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="Pedrosystem"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM users_acess WHERE email = %s", (dados.email,))
    resultado = cursor.fetchone()
    conn.close()
    cursor.close()

    
    if not resultado:
        return {"status": False}
    
    # Gerar código e armazenar
    codigo = gerar_codigo_recuperacao()
    codigo_str = ''.join(codigo)
    codigos_recuperacao[dados.email] = codigo_str
    email = resultado[0]
    
    
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    from Secretos.Passkey import email_root, senha_passkey
    email_remetente = email_root
    senha = senha_passkey
    
    email_destinatario = email
    
    
    msg = MIMEMultipart()
    msg["From"] = email_remetente
    msg["To"] = email_destinatario
    msg["Subject"] = "CÓDIGO DE RECUPERAÇÃO DE SENHA"
    
    corpo = f"SEU CÓDIGO DE RECUPERAÇÃO DE EMAIL: {codigo_str}"
    msg.attach(MIMEText(corpo, "plain"))
    
    try:
        # Conexão com servidor SMTP
        servidor = smtplib.SMTP(smtp_server, smtp_port)
        servidor.starttls()  
        servidor.login(email_remetente, senha)
    
        # Envio
        servidor.send_message(msg)
        return {"status": True}
    
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return {"status": False, "error": str(e)}
    
    finally:
        servidor.quit()    
    
    
    
class Esquecicode(BaseModel):
    email: str
    codigo: str
    
@app.post("/esquecicodigo")
def verificar_codigo_recuperacao(dados: Esquecicode):
    
    codigo_correto = codigos_recuperacao.get(dados.email)
    
    if codigo_correto and dados.codigo == codigo_correto:
        del codigos_recuperacao[dados.email]
        return {"status": True}
    else:
        return {"status": False}    
        

class Novasenha(BaseModel):
    email: str
    senha: str
    
@app.post("/novasenha")
def newpassword(dados: Novasenha):
    
    
    
    
    nova_senha = gerar_hash_senha(dados.senha.strip())
    
    
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="Pedrosystem"
    )
    cursor = conn.cursor()
    cursor.execute("UPDATE users_acess SET senha = %s WHERE email = %s", (nova_senha, dados.email.strip()))
    conn.commit()
    conn.close()
    cursor.close()
    
    return {"status": True}
    
    
    