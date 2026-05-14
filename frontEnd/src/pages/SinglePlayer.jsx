import '../styles/singleplayer.css'
import { useEffect, useRef } from "react"

import { useSocketGame } from '../hooks/useSocketGame'
import { WordDisplay } from '../components/WordDisplay'

const API_URL = "http://localhost:3000/api/users"

async function guardarEstatisticas(partida, setUsuario) {
  const token = localStorage.getItem("token")
  if (!token) return

  const resposta = await fetch(`${API_URL}/stats`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(partida),
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    alert(dados.message || "Erro ao guardar estatísticas")
    return
  }

  localStorage.setItem("user", JSON.stringify(dados.user))
  if (setUsuario) setUsuario(dados.user)
}

function InputSection({ input, setInput, onCheck }) {
  const manejarTecla = (e) => {
    if (e.key === "Enter") onCheck()
  }

  return (
    <div className="input-row">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={manejarTecla}
        placeholder="Tenta encontrar palavras..."
      />
      <button onClick={onCheck}>Verificar</button>
    </div>
  )
}

function FoundWords({ words, total }) {
  return (
    <>
      <p>{words.length} de {total} palavras encontradas</p>
      <div>
        {words.map((palabra, indice) => (
          <span key={indice} className="found-word">{palabra}</span>
        ))}
      </div>
    </>
  )
}

function Controles({ alAvanzar }) {
  return (
    <div className="controles-row">
      <button className="btn-siguiente" onClick={alAvanzar}>
        Próxima Palavra →
      </button>
    </div>
  )
}

function Jogo({ setUsuario }) {
  const game = useSocketGame()
  const estatisticasGuardadas = useRef(false)

  useEffect(() => {
    game.startGame()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!game.isExpired || !game.gameOver) return
    if (estatisticasGuardadas.current) return

    estatisticasGuardadas.current = true

    guardarEstatisticas(
      {
        score:        game.gameOver.score,
        gamesPlayed:  1,
        correctWords: game.gameOver.correctWords,
        wrongWords:   game.gameOver.wrongWords,
        totalTime:    game.gameOver.totalTime,
      },
      setUsuario
    )
  }, [game.isExpired, game.gameOver, setUsuario])

  function jogarDeNovo() {
    estatisticasGuardadas.current = false
    game.startGame()
  }

  if (game.isExpired && game.gameOver) {
    return (
      <div className="game-container">
        <div className="card">
          <h2>Game Over</h2>
          <p>Pontuação final: {game.gameOver.score}</p>
          <p>Palavras encontradas: {game.gameOver.correctWords}</p>
          <p>Respostas erradas: {game.gameOver.wrongWords}</p>
          <p>Tempo jogado: {game.gameOver.totalTime}s</p>
          <button onClick={jogarDeNovo}>Jogar de novo</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <h2>Encontra todas as palavras</h2>

      <div className="card">
        <p>Palavra Principal:</p>

        <WordDisplay word={game.mainWord} />

        <InputSection
          input={game.input}
          setInput={game.setInput}
          onCheck={game.checkWord}
        />

        <Controles alAvanzar={game.nextWord} />

        <FoundWords
          words={game.foundWords}
          total={game.validWords.length}
        />

        <p>Pontuação: {game.score}</p>
        <p>Tempo: {game.time}s</p>
      </div>
    </div>
  )
}

function SinglePlayer({ setUsuario }) {
  return (
    <div>
      <Jogo setUsuario={setUsuario} />
    </div>
  )
}

export default SinglePlayer