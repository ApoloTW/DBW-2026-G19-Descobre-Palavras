// src/hooks/useSocketGame.js
import { useCallback, useEffect, useState } from "react"
import socket from "../socket"

export function useSocketGame() {
  const [mainWord,   setMainWord]   = useState("")
  const [validWords, setValidWords] = useState([])
  const [foundWords, setFoundWords] = useState([])
  const [score,      setScore]      = useState(0)
  const [time,       setTime]       = useState(0)
  const [isExpired,  setIsExpired]  = useState(false)
  const [gameOver,   setGameOver]   = useState(null)
  const [input,      setInput]      = useState("")

  const applyState = useCallback((state) => {
    setMainWord(state.mainWord)
    setValidWords(state.validWords)
    setFoundWords(state.foundWords)
    setScore(state.score)
    setTime(state.time)
  }, [])

  useEffect(() => {
    socket.on("game:state", applyState)
    socket.on("game:tick", ({ time }) => setTime(time))
    socket.on("game:check:result", ({ result, foundWords, score, time }) => {
      setFoundWords(foundWords)
      setScore(score)
      setTime(time)
      setInput("")
    })
    socket.on("game:over", (stats) => {
      setIsExpired(true)
      setGameOver(stats)
    })

    return () => {
      socket.off("game:state")
      socket.off("game:tick")
      socket.off("game:check:result")
      socket.off("game:over")
    }
  }, [applyState])

  const startGame = useCallback(() => {
    setIsExpired(false)
    setGameOver(null)
    setFoundWords([])
    setScore(0)
    setInput("")

    if (!socket.connected) {
      socket.connect()
    }

    socket.emit("game:start")
  }, [])

  const checkWord = useCallback(() => {
    if (!input.trim()) return
    socket.emit("game:check", { input })
  }, [input])

  const nextWord = useCallback(() => {
    socket.emit("game:next")
  }, [])

  return {
    mainWord, validWords, foundWords,
    score, time, isExpired, gameOver,
    input, setInput,
    startGame, checkWord, nextWord,
  }
}