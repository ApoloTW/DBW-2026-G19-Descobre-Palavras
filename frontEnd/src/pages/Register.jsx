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
            type="text"
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

      <button className="registerButton" onClick={criarConta}>Criar Conta</button>

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