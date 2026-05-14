import '../styles/singleplayer.css'
import { useEffect, useRef, useState } from "react"

import { useScore } from '../hooks/useScore'
import { useTemporizador } from '../hooks/useTemporizador'
import { useWordGame } from '../hooks/useWordGame'
import { WordDisplay } from '../components/WordDisplay'

const API_URL = "http://localhost:3000/api/users"

const bancoPalavras = {
  "ARMARIO": ["ARMA", "RIO", "MAR", "MARIO"],
  "PLANETA": ["PLAN", "ANTE", "LANA", "NETA", "PALA", "TELA"],
  "CASTILLO": ["TILO", "LISO", "CAST", "SAIL", "COLA", "CALLO"],
}

async function guardarEstatisticas(partida, setUsuario) {
  const token = localStorage.getItem("token")

  if (!token) {
    return
  }

  const resposta = await fetch(`${API_URL}/stats`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(partida)
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    alert(dados.message || "Erro ao guardar estatísticas")
    return
  }

  localStorage.setItem("user", JSON.stringify(dados.user))

  if (setUsuario) {
    setUsuario(dados.user)
  }
}

function useGame() {
  const {
    mainWord,
    validWords,
    input,
    setInput,
    foundWords,
    setFoundWords,
    nextWord
  } = useWordGame(bancoPalavras)

  const { score, addPoint, resetScore } = useScore()
  const { time, addTime, isExpired, resetTime, setActive } = useTemporizador(10)

  const [correctWordsTotal, setCorrectWordsTotal] = useState(0)
  const [wrongWordsTotal, setWrongWordsTotal] = useState(0)

  const startTimeRef = useRef(Date.now())

  const resetGame = () => {
    resetScore()
    resetTime()
    setActive(true)
    nextWord()

    setCorrectWordsTotal(0)
    setWrongWordsTotal(0)
    startTimeRef.current = Date.now()
  }

  const checkWord = () => {
    const palabra = input.toUpperCase().trim()

    if (!palabra) {
      return "empty"
    }

    if (!validWords.includes(palabra)) {
      setWrongWordsTotal((valorAtual) => valorAtual + 1)
      setInput("")
      return "invalid"
    }

    if (foundWords.includes(palabra)) {
      setInput("")
      return "duplicate"
    }

    const nuevas = [...foundWords, palabra]
    setFoundWords(nuevas)

    setCorrectWordsTotal((valorAtual) => valorAtual + 1)

    addPoint()
    addTime(5)

    setInput("")

    if (nuevas.length === validWords.length) {
      setTimeout(nextWord, 1000)
    }

    return "ok"
  }

  const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000)

  return {
    mainWord,
    validWords,
    input,
    setInput,
    foundWords,
    checkWord,
    nextWord,
    score,
    time,
    isExpired,
    resetGame,
    correctWordsTotal,
    wrongWordsTotal,
    totalTime
  }
}

function InputSection({ input, setInput, onCheck }) {
  const manejarTecla = (e) => {
    if (e.key === "Enter") {
      onCheck()
    }
  }

  return (
    <div className="input-row">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={manejarTecla}
        placeholder="Tenta encontrar palavras..."
      />

      <button onClick={onCheck}>
        Verificar
      </button>
    </div>
  )
}

function FoundWords({ words, total }) {
  return (
    <>
      <p>{words.length} de {total} palavras encontradas</p>

      <div>
        {words.map((palabra, indice) => (
          <span key={indice} className="found-word">
            {palabra}
          </span>
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
  const game = useGame()
  const estatisticasGuardadas = useRef(false)

  useEffect(() => {
    async function guardarFinalDaPartida() {
      if (!game.isExpired) {
        return
      }

      if (estatisticasGuardadas.current) {
        return
      }

      estatisticasGuardadas.current = true

      await guardarEstatisticas({
        score: game.score,
        gamesPlayed: 1,
        correctWords: game.correctWordsTotal,
        wrongWords: game.wrongWordsTotal,
        totalTime: game.totalTime
      }, setUsuario)
    }

    guardarFinalDaPartida()
  }, [
    game.isExpired,
    game.score,
    game.correctWordsTotal,
    game.wrongWordsTotal,
    game.totalTime,
    setUsuario
  ])

  function jogarDeNovo() {
    estatisticasGuardadas.current = false
    game.resetGame()
  }

  if (game.isExpired) {
    return (
      <div className="game-container">
        <div className="card">
          <h2>Game Over</h2>

          <p>Pontuação final: {game.score}</p>
          <p>Palavras encontradas: {game.correctWordsTotal}</p>
          <p>Respostas erradas: {game.wrongWordsTotal}</p>
          <p>Tempo jogado: {game.totalTime}s</p>

          <button onClick={jogarDeNovo}>
            Jogar de novo
          </button>
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