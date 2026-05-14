import '../styles/register.css'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'

const API_URL = "http://localhost:3000/api/auth"

function CriarConta({ setUsuario }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function criarConta() {
    if (!username || !email || !password) {
      alert("Preenche todos os campos")
      return
    }

    if (!email.includes("@")) {
      alert("Email inválido")
      return
    }

    if (password.length < 6) {
      alert("A palavra-passe deve ter pelo menos 6 caracteres")
      return
    }

    try {
      const resposta = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        alert(dados.message || "Erro ao criar conta")
        return
      }

      localStorage.setItem("token", dados.token)
      localStorage.setItem("user", JSON.stringify(dados.user))

      setUsuario(dados.user)

      navigate("/play")

    } catch (error) {
      console.error(error)
      alert("Erro ao ligar ao servidor")
    }
  }

  return (
    <div className="registerBox">
      <h2 className="registerTitle">Criar Conta</h2>

      <p className="textRegisterBox">Nome de Utilizador</p>
      <div className="registerBoxSmall">
        <span className="inputIcon">👤</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="registerInput"
          placeholder="O teu nome"
        />
      </div>

      <p className="textRegisterBox">Email</p>
      <div className="registerBoxSmall">
        <span className="inputIcon">📩</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="registerInput"
          placeholder="teu@gmail.com"
        />
      </div>

      <p className="textRegisterBox">Palavra-passe</p>
      <div className="registerBoxSmall">
        <span className="inputIcon">🔒</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="registerInput"
          placeholder="••••••••"
        />
      </div>

      <button className="registerButton" onClick={criarConta}>
        Criar Conta
      </button>

      <p className="textNaoTensConta">
        Já tens conta? <Link to="/login">Inicia sessão</Link>
      </p>
    </div>
  )
}

function Register({ setUsuario }) {
  return (
    <div>
      <CriarConta setUsuario={setUsuario} />
    </div>
  )
}

export default Register