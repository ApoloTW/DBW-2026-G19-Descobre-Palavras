import '../styles/register.css'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react';

function CriarConta({ setUsuario }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function criarConta() {
    if (!username || !email || !password) {
      alert("Preenche todos os campos")
      return
    }

    setUsuario({
      username: username,
      email: email
    })

    navigate("/play")
  }

  return(
    <div className="loginBox">
      <h2 className="loginTitle">Criar Conta</h2>

      <p className="textLoginBox">Nome de Utilizador</p>
        <div className="loginBoxSmall">
        <span className="inputIcon">👤</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="loginInput"
            placeholder="O teu nome"
          />
        </div>

      <p className="textLoginBox">Email</p>
        <div className="loginBoxSmall">
        <span className="inputIcon">📩</span>
          <input
            type="text"
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

      <button className="loginButton" onClick={criarConta}>Criar Conta</button>

      <p className="textNaoTensConta">Já tens conta?? <Link to="/login">Inicia sessão</Link></p>

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