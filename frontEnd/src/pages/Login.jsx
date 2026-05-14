import '../styles/login.css'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'

const API_URL = "http://localhost:3000/api/auth"

function IniciarSessao({ setUsuario }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  async function conta() {
    if (!email || !password) {
      alert("Preenche o email e a palavra-passe")
      return
    }

    if (!email.includes("@")) {
      alert("Email inválido")
      return
    }

    try {
      const resposta = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        console.log(dados)
        alert(dados.message + ": " + (dados.error || ""))
        return
      }

      localStorage.setItem("token", dados.token)
      localStorage.setItem("user", JSON.stringify(dados.user))

      setUsuario(dados.user)

      navigate("/play")

    } catch (erro) {
      console.error(erro)
      alert("Erro ao ligar ao servidor")
    }
  }

  return (
    <div className="loginBox">
      <h2 className="loginTitle">Iniciar Sessão</h2>

      <p className="textLoginBox">Email</p>
      <div className="loginBoxSmall">
        <span className="inputIcon">📩</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="loginInput"
          placeholder="teu@gmail.com"
        />
      </div>

      <p className="textLoginBox">Palavra-passe</p>
      <div className="loginBoxSmall">
        <span className="inputIcon">🔒</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="loginInput"
          placeholder="••••••••"
        />
      </div>

      <button className="loginButton" onClick={conta}>
        Iniciar Sessão
      </button>

      <p className="textNaoTensConta">
        Não tens conta? <Link to="/register">Regista-te</Link>
      </p>
    </div>
  )
}

function Login({ setUsuario }) {
  return (
    <div>
      <IniciarSessao setUsuario={setUsuario} />
    </div>
  )
}

export default Login