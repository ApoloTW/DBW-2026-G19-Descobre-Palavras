import '../styles/play.css'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import socket from "../socket"

function EscolheModoJogo() {
    return (
    <div className="mainTitlePlay">
        <h1>Escolhe o Teu Modo de Jogo</h1>
    </div>
    )
}

function SubTitlePlay({ nomeUsuario }) {
    return (
    <div className="textPlay">
        <p>Como queres jogar hoje, {nomeUsuario}?</p>
    </div>
    )
}

function SelectGameMode({ usuario }) {
    const navigate = useNavigate()

    const [mostrarOpcoesMulti, setMostrarOpcoesMulti] = useState(false)
    const [codigoEntrada, setCodigoEntrada] = useState("")

    const codigoAEntrar = useRef("")

    useEffect(() => {
        function receberSalaCriada(room) {
            navigate(`/multiplayer?room=${room.roomCode}`)
        }

        function atualizarSala(room) {
            if (codigoAEntrar.current === room.roomCode) {
                codigoAEntrar.current = ""
                navigate(`/multiplayer?room=${room.roomCode}`)
            }
        }

        function mostrarErro(error) {
            codigoAEntrar.current = ""
            alert(error.message || "Erro na sala")
        }

        socket.on("roomCreated", receberSalaCriada)
        socket.on("roomUpdated", atualizarSala)
        socket.on("roomError", mostrarErro)

        return () => {
            socket.off("roomCreated", receberSalaCriada)
            socket.off("roomUpdated", atualizarSala)
            socket.off("roomError", mostrarErro)
        }
    }, [navigate])

    function conectarSocket() {
        if (!socket.connected) {
            socket.connect()
        }
    }

    function criarSala() {
        if (!usuario) {
            alert("Tens de iniciar sessão para criar uma sala")
            return
        }

        conectarSocket()

        socket.emit("createRoom", {
            userId: usuario.id,
            username: usuario.username
        })
    }

    function entrarEmSala() {
        if (!usuario) {
            alert("Tens de iniciar sessão para entrar numa sala")
            return
        }

        const codigoLimpo = codigoEntrada.trim().toUpperCase()

        if (!codigoLimpo) {
            alert("Escreve o código da sala")
            return
        }

        conectarSocket()

        codigoAEntrar.current = codigoLimpo

        socket.emit("joinRoom", {
            roomCode: codigoLimpo,
            userId: usuario.id,
            username: usuario.username
        })
    }

    return (
        <div className="boxInfoRowPlay">
            <button type="button" className="boxInfoPlay" onClick={() => navigate("/singleplayer")}>
            <span className="iconTituloPlay">👤</span>
            <h3 className="boxTitlePlay">Modo Individual</h3>

            <p className="textBoxPlay">Joga sozinho e melhora o teu recorde pessoal.
            <br />Encontra todas as palavras antes que o tempo acabe.</p>

            <ul className="textBoxSmallPlay">
                <li>Tempo inicial: 10 segundos</li>
                <li>+5 segundos por cada acerto</li>
                <li>Melhora a tua pontuação máxima</li>
            </ul>
            </button>

        <div className="boxInfoPlay" onClick={() => setMostrarOpcoesMulti(true)}>
            <span className="iconTituloPlay">👥</span>
            <h3 className="boxTitlePlay">Multijogador</h3>

            {!mostrarOpcoesMulti ? (
            <>
                <p className="textBoxPlay">Compete contra outro jogador em tempo real.
                <br />Quem encontrar mais palavras em 1 minuto ganha.</p>

            <ul className="textBoxSmallPlay">
                <li>1 minuto de duração</li>
                <li>Compete contra outro jogador</li>
                <li>Ganha quem encontrar mais palavras</li>
            </ul>
            </>
        ) : (
            <div onClick={(e) => e.stopPropagation()}>
                <p className="textBoxPlay">Cria uma sala ou entra com o código enviado por um amigo.</p>

                <div className="opcionSalaBox">
                    <div className="opcionSalaInsideBox">
                        <p className="textBoxPlay">Gera um código para partilhar com um amigo.</p>
                        <button type="button" className="salaButton" onClick={criarSala}>Criar sala</button>
                    </div>

                    <div className="opcionSalaInsideBox">
                        <p className="textBoxPlay">Ou entra numa sala existente:</p>
                        <div className="salaBoxSmall">
                            <input
                                type="text"
                                value={codigoEntrada}
                                onChange={(e) => setCodigoEntrada(e.target.value)}
                                placeholder="Código da sala"
                                className="codigoSalaInput"
                            />
                        </div>
                        <button type="button" className="salaButton" onClick={entrarEmSala}>Entrar na sala</button>
                    </div>
                </div>
            </div>
        )}
        </div>

    </div>
  )
}

function Play({ usuario }) {
    let usuarioFinal = usuario

    if (!usuarioFinal) {
        const userGuardado = localStorage.getItem("user")

        if (userGuardado) {
            usuarioFinal = JSON.parse(userGuardado)
        }
    }

    const nomeUsuario = usuarioFinal?.username || "Jogador"

    return (
        <div>
            <EscolheModoJogo />
            <SubTitlePlay nomeUsuario={nomeUsuario} />
            <SelectGameMode usuario={usuarioFinal} />
        </div>
    )
}

export default Play