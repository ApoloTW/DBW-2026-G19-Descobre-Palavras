import "../styles/navbar.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";

function Navbar({ usuario, setUsuario }) {
  function cerrarSesion() {
    setUsuario(null)
  }
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <div className="logo">
        Descobre Palavras
      </div>

      <div className="links">
        <Link to="/">🏠︎ Início</Link>

        {usuario ? (<>
        <Link to="/perfil">⛭ Perfil</Link>
        <Link to="/ranking">✪ Ranking</Link>
        <button onClick={cerrarSesion}>➜] Sair</button></>
        ) : ( <>
        <Link to="/login">◉ Login</Link>
        <Link to="/about">ⓘ Sobre Nós</Link></>
        )}
      </div>
    </nav>
  )
}

export default Navbar