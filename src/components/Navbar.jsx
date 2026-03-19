import { Link } from "react-router-dom"
import "../styles/navbar.css"
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        Descobre Palavras
      </div>
      <div className="links">
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/about">Sobre Nós</Link>
      </div>
    </nav>
  )
}

export default Navbar