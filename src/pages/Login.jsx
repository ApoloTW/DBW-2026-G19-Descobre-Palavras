import '../styles/login.css'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react';

function IniciarSeassao({ setUsuario }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function cuenta() {
    if (!email || !password) {
      alert("Preenche o email e a palavra-passe")
      return
    }

    setUsuario({
      nombre: email,
      email: email
    })

    navigate("/play")
  }

  return(
    <div className="loginBox">
      <h2 className="loginTitle">Iniciar Sessão</h2>

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

      <button className="loginButton" onClick={cuenta}>Iniciar Sessão</button>

      <p className="textNaoTensConta">Não tens conta? <Link to="/register">Regista-te</Link></p>

    </div>
  )
}

function Login({ setUsuario }) {
  return (
    <div>
      <IniciarSeassao setUsuario={setUsuario} />
    </div>
  )
}

export default Login