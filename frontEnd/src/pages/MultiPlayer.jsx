import '../styles/multiplayer.css'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import socket from "../socket"
import { WordDisplay } from "../components/WordDisplay"

function obterUsuario(usuario) {
  if (usuario) {
    return usuario
  }

  const userGuardado = localStorage.getItem("user")

  if (!userGuardado) {
    return null
  }

  return JSON.parse(userGuardado)
}

function PlayerPanel({ name, score = 0, wordsFound = 0, isLocalPlayer }) {
  return (
    <div className={`painel-jogador ${isLocalPlayer ? 'local' : 'rival'}`}>
      <div className="cabecalho-jogador">
        <span className="player-name">👤 {name}</span>
        <span className="trophy">🏆</span>
      </div>

      <p className="pontuacao-jogador">{score} pts</p>
      <p className="palavras-jogador">{wordsFound} palavras encontradas</p>
    </div>
  )
}

function Timer({ time }) {
  return (
    <div className="temporizador-central">
      🕐 {time}s
    </div>
  )
}

function InputSection({ input, setInput, onCheck }) {
  function handleKey(e) {
    if (e.key === "Enter") {
      onCheck()
    }
  }

  return (
    <div className="linha-entrada">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Escreve uma palavra..."
      />

      <button type="button" onClick={onCheck}>
        Verificar
      </button>
    </div>
  )
}

function SalaEspera({ room, roomCode, usuario }) {
  const jogadores = room?.players || []

  const jogador1 = jogadores[0]
  const jogador2 = jogadores[1]

  return (
    <>
      <div className="cartao">
        <h2>Sala Multijogador</h2>

        <p>Código da sala:</p>
        <h1>{roomCode}</h1>

        <p>Envia este código ao teu amigo para ele entrar na sala.</p>

        <p>
          Jogadores na sala: {room.playerCount}/{room.maxPlayers}
        </p>
      </div>

      <div className="fila-jogadores">
        {jogador1 ? (
          <PlayerPanel
            name={jogador1.username}
            score={jogador1.score}
            wordsFound={jogador1.correctWords}
            isLocalPlayer={jogador1.userId === usuario.id}
          />
        ) : (
          <PlayerPanel
            name="Aguardando jogador..."
            isLocalPlayer={false}
          />
        )}

        {jogador2 ? (
          <PlayerPanel
            name={jogador2.username}
            score={jogador2.score}
            wordsFound={jogador2.correctWords}
            isLocalPlayer={jogador2.userId === usuario.id}
          />
        ) : (
          <PlayerPanel
            name="Aguardando jogador..."
            isLocalPlayer={false}
          />
        )}
      </div>

      <div className="cartao">
        <h2>Aguardando outro jogador...</h2>
        <p>O jogo começa automaticamente quando houver 2 jogadores.</p>
      </div>
    </>
  )
}

function JogoAtivo({
  room,
  roomCode,
  usuario,
  input,
  setInput,
  enviarPalavra,
  saltarPalavra,
  mensagemPalavra
}) {
  const jogadores = room.players || []

  const jogadorLocal = jogadores.find(
    (player) => player.userId === usuario.id
  )

  const jogador1 = jogadores[0]
  const jogador2 = jogadores[1]

  const palavrasEncontradas = jogadorLocal?.foundWords || []
  const palavraPrincipal = jogadorLocal?.mainWord || ""
  const totalPalavras = jogadorLocal?.totalWords || 0

  return (
    <>
      <div className="fila-jogadores">
        {jogador1 && (
          <PlayerPanel
            name={jogador1.username}
            score={jogador1.score}
            wordsFound={jogador1.correctWords}
            isLocalPlayer={jogador1.userId === usuario.id}
          />
        )}

        {jogador2 && (
          <PlayerPanel
            name={jogador2.username}
            score={jogador2.score}
            wordsFound={jogador2.correctWords}
            isLocalPlayer={jogador2.userId === usuario.id}
          />
        )}
      </div>

      <Timer time={room.time} />

      <div className="cartao">
        <p>Palavra Principal:</p>

        <WordDisplay word={palavraPrincipal} />

        <p>
          {palavrasEncontradas.length} de {totalPalavras} palavras encontradas
        </p>

        <button
          type="button"
          className="btn-avancar"
          onClick={saltarPalavra}
        >
          ⏭ Saltar Palavra
        </button>
      </div>

      <InputSection
        input={input}
        setInput={setInput}
        onCheck={enviarPalavra}
      />

      {mensagemPalavra && (
        <div className="cartao">
          <p>{mensagemPalavra}</p>
        </div>
      )}

      <div className="cartao">
        <h3>As Tuas Palavras Encontradas:</h3>

        {palavrasEncontradas.length === 0 ? (
          <p>Ainda não encontraste nenhuma palavra...</p>
        ) : (
          <div>
            {palavrasEncontradas.map((palavra) => (
              <span key={palavra} className="found-word">
                {palavra}
              </span>
            ))}
          </div>
        )}
      </div>

      <p style={{ textAlign: "center" }}>
        Sala: {roomCode}
      </p>
    </>
  )
}

function ResultadoFinal({ resultado, usuario }) {
  if (!resultado) {
    return (
      <div className="cartao">
        <h2>A calcular resultado...</h2>
      </div>
    )
  }

  const vencedor = resultado.winner
  const jogadores = resultado.players || []

  const jogadorLocal = jogadores.find(
    (player) => player.userId === usuario.id
  )

  const ganhou = vencedor?.userId === usuario.id

  return (
    <div className="cartao">
      <h2>Fim do Jogo!</h2>

      {jogadorLocal && (
        <>
          <p>A tua pontuação: {jogadorLocal.score}</p>
          <p>Palavras encontradas: {jogadorLocal.correctWords}</p>
          <p>Palavras erradas: {jogadorLocal.wrongWords}</p>
        </>
      )}

      {vencedor ? (
        <h3>
          {ganhou
            ? "🏆 Ganhaste!"
            : `😔 Perdeste... Vencedor: ${vencedor.username}`}
        </h3>
      ) : (
        <h3>Empate</h3>
      )}
    </div>
  )
}

function Multijogador({ usuario }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const usuarioFinal = obterUsuario(usuario)
  const roomCode = searchParams.get("room")?.toUpperCase() || ""

  const [room, setRoom] = useState(null)
  const [erroSocket, setErroSocket] = useState("")
  const [input, setInput] = useState("")
  const [mensagemPalavra, setMensagemPalavra] = useState("")
  const [resultado, setResultado] = useState(null)

  const erroInicial = !roomCode
    ? "Código da sala não encontrado"
    : !usuarioFinal
      ? "Tens de iniciar sessão para jogar em multijogador"
      : ""

  const erro = erroInicial || erroSocket

  useEffect(() => {
    if (erroInicial) {
      return
    }

    function atualizarSala(roomAtualizada) {
      if (roomAtualizada.roomCode === roomCode) {
        setRoom(roomAtualizada)
        setErroSocket("")
      }
    }

    function atualizarJogo(roomAtualizada) {
      if (roomAtualizada.roomCode === roomCode) {
        setRoom(roomAtualizada)
        setErroSocket("")
      }
    }

    function mostrarResultado(finalData) {
      if (finalData.roomCode === roomCode) {
        setResultado(finalData)
      }
    }

    function mostrarResultadoPalavra(resultadoPalavra) {
      setMensagemPalavra(resultadoPalavra.message || "")
    }

    function mostrarErro(error) {
      setErroSocket(error.message || "Erro na sala")
    }

    socket.on("roomUpdated", atualizarSala)
    socket.on("gameState", atualizarJogo)
    socket.on("gameOver", mostrarResultado)
    socket.on("wordResult", mostrarResultadoPalavra)
    socket.on("roomError", mostrarErro)

    if (!socket.connected) {
      socket.connect()
    }

    socket.emit("getRoom", {
      roomCode,
      userId: usuarioFinal.id,
      username: usuarioFinal.username
    })

    return () => {
      socket.off("roomUpdated", atualizarSala)
      socket.off("gameState", atualizarJogo)
      socket.off("gameOver", mostrarResultado)
      socket.off("wordResult", mostrarResultadoPalavra)
      socket.off("roomError", mostrarErro)
    }
  }, [roomCode, erroInicial, usuarioFinal?.id, usuarioFinal?.username])

  function enviarPalavra() {
    const palavra = input.trim()

    if (!palavra) {
      return
    }

    socket.emit("submitWord", {
      roomCode,
      word: palavra
    })

    setInput("")
  }

  function saltarPalavra() {
    socket.emit("skipWord", {
      roomCode
    })
  }

  function sairDaSala() {
    if (roomCode && socket.connected) {
      socket.emit("leaveRoom", {
        roomCode
      })
    }

    navigate("/play")
  }

  if (erro) {
    return (
      <div className="contentor-jogo">
        <div className="barra-topo">
          <button type="button" onClick={() => navigate("/play")}>
            🏠 Voltar
          </button>

          <h1>Multijogador</h1>
        </div>

        <div className="cartao">
          <h2>Erro</h2>
          <p>{erro}</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="contentor-jogo">
        <div className="barra-topo">
          <button type="button" onClick={() => navigate("/play")}>
            🏠 Voltar
          </button>

          <h1>Multijogador</h1>
        </div>

        <div className="cartao">
          <h2>A carregar sala...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="contentor-jogo">
      <div className="barra-topo">
        <button type="button" onClick={sairDaSala}>
          🏠 Sair da sala
        </button>

        <h1>Multijogador</h1>
      </div>

      {room.status === "waiting" && (
        <SalaEspera
          room={room}
          roomCode={roomCode}
          usuario={usuarioFinal}
        />
      )}

      {room.status === "playing" && (
        <JogoAtivo
          room={room}
          roomCode={roomCode}
          usuario={usuarioFinal}
          input={input}
          setInput={setInput}
          enviarPalavra={enviarPalavra}
          saltarPalavra={saltarPalavra}
          mensagemPalavra={mensagemPalavra}
        />
      )}

      {room.status === "finished" && (
        <ResultadoFinal
          resultado={resultado}
          usuario={usuarioFinal}
        />
      )}
    </div>
  )
}

function MultiPlayer({ usuario }) {
  return (
    <Multijogador usuario={usuario} />
  )
}

export default MultiPlayer