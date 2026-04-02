import { Link } from "react-router-dom"
import "../styles/navbar.css"
import { useEffect, useState } from "react";

function Navbar() {
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
        <Link to="/login">◉ Login</Link>
        <Link to="/about">ⓘ Sobre Nós</Link>
      </div>
    </nav>
  )
}

export default Navbar