import '../styles/play.css'
import { Link, useNavigate } from "react-router-dom"

function EscolheModoJogo() {
    return (
        <div className="mainTitlePlay">
            <h1>Escolhe o Teu Modo de Jogo</h1>
        </div>
    )
}

function SubTitlePlay({ usuario }) {
    return (
        <div className="textPlay">
            <p>Como queres jogar hoje, {usuario}?</p>
        </div>
    )
}

function SelectGameMode() {
    const navigate = useNavigate();
    return (
        <div className="boxInfoRowPlay">

            <button className="boxInfoPlay" onClick={() => navigate("/singleplayer")}>
                <span className="iconTituloPlay">👤</span>
                <h3 className="boxTitlePlay">Modo Individual</h3>
                <p className="textBoxPlay">Joga sozinho e melhora o teu recorde pessoal.<br/>Encontra todas as palavras antes que o tempo acabe.</p>
                <ul className="textBoxSmallPlay">
                    <li>Tempo inicial: 10 segundos</li>
                    <li>+5 segundos pro cada acerto</li>
                    <li>Melhora a tua pontuação máxima</li>
                </ul>
            </button>

            <button className="boxInfoPlay" onClick={() => navigate("/multiplayer")}>
                <span className="iconTituloPlay">👥</span>
                <h3 className="boxTitlePlay">Multijogador</h3>
                <p className="textBoxPlay">Compete contra outro jogador em tempo real. <br/>Quem encontrar mais palavras em 1 minuto ganha.</p>
                <ul className="textBoxSmallPlay">
                    <li>1 minuto de duração</li>
                    <li>Compete contra outro jogador</li>
                    <li>Ganha quem encontrar mais palavras</li>
                </ul>
            </button>

        </div>
    )
}


function Play() {
    const usuario = localStorage.getItem("usuario") || "Jogador";

    return (
        <div>
            <EscolheModoJogo/>
            <SubTitlePlay usuario={usuario} />
            <SelectGameMode/>
        </div>
    )  
}

export default Play