import '../styles/register.css'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react';

function CriarConta() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  return(
    <div className="loginBox">
      <h2 className="loginTitle">Criar Conta</h2>

      <p className="textLoginBox">Nome de Utilizador</p>
        <div className="loginBoxSmall">
        <span className="inputIcon">👤</span>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      <button className="loginButton" onClick={() => navigate("/home")}>Criar Conta</button>

      <p className="textNaoTensConta">Já tens conta?? <Link to="/login">Inicia sessão</Link></p>

    </div>
  )
}

function Register() {
  return (
    <div>
      <CriarConta/>
    </div>
  )  
}

export default Register