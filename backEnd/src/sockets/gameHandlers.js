const { createGameState, advanceWord, checkWord, tickTimer } = require("../game/gameLogic")

// Sesiones en memoria: socketId → { state, timerInterval }
const sessions = new Map()

// ─── Timer por sesión ─────────────────────────────────────────────────────────
// Equivalente al useEffect + setInterval del useTemporizador,
// pero corriendo en el servidor para que el cliente no pueda hacer trampa.

function startTimer(socket) {
  const interval = setInterval(() => {
    const session = sessions.get(socket.id)
    if (!session) return clearInterval(interval)

    const newState = tickTimer(session.state)
    session.state  = newState

    // Equivalente al "time" que el front mostraba en tiempo real
    socket.emit("game:tick", { time: newState.time })

    if (newState.isExpired) {
      clearInterval(interval)
      session.timerInterval = null

      const totalTime = Math.round((Date.now() - newState.startTime) / 1000)

      // Equivalente al bloque game.isExpired del Jogo component
      socket.emit("game:over", {
        score:        newState.score,
        correctWords: newState.correctWordsTotal,
        wrongWords:   newState.wrongWordsTotal,
        totalTime,
      })
    }
  }, 1000)

  return interval
}

// ─── Registro de handlers ─────────────────────────────────────────────────────

function registerGameHandlers(io, socket) {

  // Equivalente a resetGame() — el cliente pide empezar o reiniciar
  socket.on("game:start", () => {
    const existing = sessions.get(socket.id)
    if (existing?.timerInterval) clearInterval(existing.timerInterval)

    const state        = createGameState()
    const timerInterval = startTimer(socket)
    sessions.set(socket.id, { state, timerInterval })

    // Manda el estado inicial al cliente (mainWord, validWords, etc.)
    socket.emit("game:state", publicState(state))
  })

  // Equivalente a checkWord() del useGame
  socket.on("game:check", ({ input }) => {
    const session = sessions.get(socket.id)
    if (!session || session.state.isExpired) return

    const { result, newState } = checkWord(session.state, input)
    session.state = newState

    socket.emit("game:check:result", {
      result,
      foundWords: newState.foundWords,
      score:      newState.score,
      time:       newState.time,
    })

    // Equivalente al setTimeout(nextWord, 1000) cuando se encuentran todas
    if (result === "complete") {
      setTimeout(() => {
        const sess = sessions.get(socket.id)
        if (!sess || sess.state.isExpired) return
        sess.state = advanceWord(sess.state)
        socket.emit("game:state", publicState(sess.state))
      }, 1000)
    }
  })

  // Equivalente al botón "Próxima Palavra" — avance manual
  socket.on("game:next", () => {
    const session = sessions.get(socket.id)
    if (!session || session.state.isExpired) return
    session.state = advanceWord(session.state)
    socket.emit("game:state", publicState(session.state))
  })

  // Limpieza al desconectar
  socket.on("disconnect", () => {
    const session = sessions.get(socket.id)
    if (session?.timerInterval) clearInterval(session.timerInterval)
    sessions.delete(socket.id)
  })
}

// Solo los campos que el front necesita (nunca exponer validWords completo
// si en el futuro quieres evitar trampas; por ahora lo mandamos igual)
function publicState(state) {
  return {
    mainWord:   state.mainWord,
    validWords: state.validWords,
    foundWords: state.foundWords,
    score:      state.score,
    time:       state.time,
  }
}

module.exports = { registerGameHandlers }
