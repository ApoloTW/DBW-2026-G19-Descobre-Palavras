import '../styles/home.css'
import { Link } from "react-router-dom"

function Titulo() {
  return (
    <div className="titulo">
       <h1>Descobre as Palavras</h1>
    </div>
  )
}

function TextoASeguir() {
  return (
    <div className="titulo">
       <h2>Desafia a tua mente encontrando palavras ocultas</h2>
    </div>
  )
}

function Explicacao() {
  return (
    <div className="titulo">
       <p>ARMARIO contém ARMA e RIO. Quantas palavras consegues encontrar?</p>
    </div>
  )
}

function ButtonJogar() {
  return (
    <div className="texto">
      <Link to="/" className="caja">
        <p>Inicie sessão para jogar</p>
      </Link>
    </div>
  )
}

function Home() {
  return (
    <div>
      <Titulo />
      <TextoASeguir />
      <Explicacao />
      <ButtonJogar />
    </div>
  )  
}

export default Home