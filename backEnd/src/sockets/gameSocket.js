import User from "../models/User.js";
import Word from "../models/Word.js";
const rooms = new Map();

function gerarCodigoSala() {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let codigo = "";

  for (let i = 0; i < 6; i++) {
    codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
  }

  return codigo;
}



function gerarCodigoUnico() {
  let codigo = gerarCodigoSala();

  while (rooms.has(codigo)) {
    codigo = gerarCodigoSala();
  }

  return codigo;
}

async function escolherPalavraAleatoria(excludeWord = null) {
  const query = excludeWord ? { mainWord: { $ne: excludeWord } } : {}
  const count = await Word.countDocuments(query)
  const indice = Math.floor(Math.random() * count)
  const word = await Word.findOne(query).skip(indice)

  return {
    mainWord: word.mainWord,
    validWords: word.validWords
  }
}

// ─── SINGLEPLAYER ─────────────────────────────────────────────────────────────
const singleSessions = new Map() // socketId → { state, intervalId }

const SINGLE_INITIAL_TIME = 10
const SINGLE_TIME_BONUS   = 5

async function createSingleState() {
  const { mainWord, validWords } = await escolherPalavraAleatoria()
  return {
    mainWord,
    validWords,
    foundWords:        [],
    score:             0,
    time:              SINGLE_INITIAL_TIME,
    isExpired:         false,
    correctWordsTotal: 0,
    wrongWordsTotal:   0,
    startTime:         Date.now(),
  }
}

async function advanceSingleWord(state) {
  const { mainWord, validWords } = await escolherPalavraAleatoria(state.mainWord)
  return { ...state, mainWord, validWords, foundWords: [] }
}

function checkSingleWord(state, input) {
  const palabra = input.toUpperCase().trim()

  if (!palabra) return { result: "empty", newState: state }

  if (!state.validWords.includes(palabra)) {
    return {
      result: "invalid",
      newState: { ...state, wrongWordsTotal: state.wrongWordsTotal + 1 },
    }
  }

  if (state.foundWords.includes(palabra)) {
    return { result: "duplicate", newState: state }
  }

  const foundWords = [...state.foundWords, palabra]
  const allFound   = foundWords.length === state.validWords.length

  return {
    result: allFound ? "complete" : "ok",
    newState: {
      ...state,
      foundWords,
      score:             state.score + 1,
      time:              state.time + SINGLE_TIME_BONUS,
      correctWordsTotal: state.correctWordsTotal + 1,
    },
  }
}

function startSingleTimer(io, socket) {
  return setInterval(() => {
    const session = singleSessions.get(socket.id)
    if (!session) return

    session.state.time -= 1
    socket.emit("game:tick", { time: session.state.time })

    if (session.state.time <= 0) {
      session.state.isExpired = true
      clearInterval(session.intervalId)
      session.intervalId = null

      const totalTime = Math.round((Date.now() - session.state.startTime) / 1000)

      socket.emit("game:over", {
        score:        session.state.score,
        correctWords: session.state.correctWordsTotal,
        wrongWords:   session.state.wrongWordsTotal,
        totalTime,
      })
    }
  }, 1000)
}
// ─────────────────────────────────────────────────────────────────────────────


async function atribuirNovaPalavra(player) {
  const palavra = await escolherPalavraAleatoria()
  player.mainWord = palavra.mainWord
  player.validWords = palavra.validWords
  player.foundWords = []
}

async function criarJogador(socket, userId, username) {
  const player = {
    socketId: socket.id,
    userId,
    username: username || "Jogador",
    score: 0,
    correctWords: 0,
    wrongWords: 0,
    mainWord: "",
    validWords: [],
    foundWords: []
  }

  await atribuirNovaPalavra(player)
  return player
}

function prepararSalaParaCliente(room) {
  return {
    roomCode: room.roomCode,
    status: room.status,
    time: room.time,
    players: room.players.map((player) => ({
      userId: player.userId,
      username: player.username,
      score: player.score,
      correctWords: player.correctWords,
      wrongWords: player.wrongWords,
      mainWord: player.mainWord,
      totalWords: player.validWords.length,
      foundWords: player.foundWords
    })),
    playerCount: room.players.length,
    maxPlayers: 2,
    readyToStart: room.players.length === 2
  };
}

function emitirSala(io, room) {
  io.to(room.roomCode).emit("roomUpdated", prepararSalaParaCliente(room));
}

function emitirEstadoJogo(io, room) {
  io.to(room.roomCode).emit("gameState", prepararSalaParaCliente(room));
}

async function iniciarJogo(io, room) {
  if (room.status !== "waiting") return

  room.status = "playing"
  room.time = 60
  room.statsSaved = false

  const jogadores = await Promise.all(
    room.players.map(async (player) => {
      const jogador = {
        ...player,
        score: 0,
        correctWords: 0,
        wrongWords: 0,
        foundWords: []
      }
      await atribuirNovaPalavra(jogador)
      return jogador
    })
  )

  room.players = jogadores

  emitirSala(io, room)
  emitirEstadoJogo(io, room)

  room.intervalId = setInterval(() => {
    room.time -= 1
    if (room.time <= 0) {
      room.time = 0
      terminarJogo(io, room)
      return
    }
    emitirEstadoJogo(io, room)
  }, 1000)
}

async function mudarPalavraDoJogador(player) {
  await atribuirNovaPalavra(player)
}

async function guardarEstatisticas(room) {
  if (room.statsSaved) {
    return;
  }

  room.statsSaved = true;

  for (const player of room.players) {
    try {
      await User.findByIdAndUpdate(player.userId, {
        $inc: {
          "stats.today.score": player.score,
          "stats.today.gamesPlayed": 1,
          "stats.today.correctWords": player.correctWords,
          "stats.today.wrongWords": player.wrongWords,
          "stats.today.totalTime": 60,

          "stats.weekly.score": player.score,
          "stats.weekly.gamesPlayed": 1,
          "stats.weekly.correctWords": player.correctWords,
          "stats.weekly.wrongWords": player.wrongWords,
          "stats.weekly.totalTime": 60,

          "stats.monthly.score": player.score,
          "stats.monthly.gamesPlayed": 1,
          "stats.monthly.correctWords": player.correctWords,
          "stats.monthly.wrongWords": player.wrongWords,
          "stats.monthly.totalTime": 60,

          "stats.total.score": player.score,
          "stats.total.gamesPlayed": 1,
          "stats.total.correctWords": player.correctWords,
          "stats.total.wrongWords": player.wrongWords,
          "stats.total.totalTime": 60
        },
        $max: {
          personalRecord: player.score
        }
      });
    } catch (error) {
      console.error("Erro ao guardar estatísticas:", error.message);
    }
  }
}

async function terminarJogo(io, room) {
  if (room.status === "finished") {
    return;
  }

  room.status = "finished";

  if (room.intervalId) {
    clearInterval(room.intervalId);
    room.intervalId = null;
  }

  const jogador1 = room.players[0];
  const jogador2 = room.players[1];

  let vencedor = null;

  if (jogador1 && jogador2) {
    if (jogador1.score > jogador2.score) {
      vencedor = jogador1;
    } else if (jogador2.score > jogador1.score) {
      vencedor = jogador2;
    } else {
      vencedor = null;
    }
  }

  await guardarEstatisticas(room);

  io.to(room.roomCode).emit("gameOver", {
    roomCode: room.roomCode,
    players: room.players.map((player) => ({
      userId: player.userId,
      username: player.username,
      score: player.score,
      correctWords: player.correctWords,
      wrongWords: player.wrongWords,
      mainWord: player.mainWord,
      totalWords: player.validWords.length,
      foundWords: player.foundWords
    })),
    winner: vencedor
      ? {
          userId: vencedor.userId,
          username: vencedor.username
        }
      : null
  });

  emitirSala(io, room);
  emitirEstadoJogo(io, room);
}

function sairDaSala(socket, io, roomCode) {
  const codigoLimpo = roomCode?.trim().toUpperCase();

  if (!codigoLimpo) {
    return;
  }

  const room = rooms.get(codigoLimpo);

  if (!room) {
    return;
  }

  room.players = room.players.filter(
    (player) => player.socketId !== socket.id
  );

  socket.leave(codigoLimpo);

  if (room.players.length === 0) {
    if (room.intervalId) {
      clearInterval(room.intervalId);
    }

    rooms.delete(codigoLimpo);
    console.log(`Sala removida: ${codigoLimpo}`);
    return;
  }

  emitirSala(io, room);
  emitirEstadoJogo(io, room);
}

function configureGameSocket(io) {
  io.on("connection", (socket) => {
    console.log("Jogador conectado:", socket.id);

    socket.on("createRoom", async ({ userId, username }) => {
      if (!userId) {
        socket.emit("roomError", { message: "Utilizador inválido" })
        return
      }

      const roomCode = gerarCodigoUnico()

      const room = {
        roomCode,
        status: "waiting",
        time: 60,
        players: [await criarJogador(socket, userId, username)],
        intervalId: null,
        statsSaved: false,
        createdAt: new Date()
      }

      rooms.set(roomCode, room)
      socket.join(roomCode)
      socket.emit("roomCreated", prepararSalaParaCliente(room))
      emitirSala(io, room)
      console.log(`Sala criada: ${roomCode}`)
    })

    socket.on("joinRoom", async ({ roomCode, userId, username }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase()

      if (!codigoLimpo) {
        socket.emit("roomError", { message: "Código da sala obrigatório" })
        return
      }

      if (!userId) {
        socket.emit("roomError", { message: "Utilizador inválido" })
        return
      }

      const room = rooms.get(codigoLimpo)

      if (!room) {
        socket.emit("roomError", { message: "Sala não encontrada" })
        return
      }

      const jogadorExistente = room.players.find((player) => player.userId === userId)

      if (jogadorExistente) {
        jogadorExistente.socketId = socket.id
        socket.join(codigoLimpo)
        socket.emit("roomUpdated", prepararSalaParaCliente(room))
        if (room.status === "playing" || room.status === "finished") {
          socket.emit("gameState", prepararSalaParaCliente(room))
        }
        return
      }

      if (room.players.length >= 2) {
        socket.emit("roomError", { message: "A sala já está cheia" })
        return
      }

      if (room.status !== "waiting") {
        socket.emit("roomError", { message: "O jogo já começou" })
        return
      }

      room.players.push(await criarJogador(socket, userId, username))
      socket.join(codigoLimpo)
      emitirSala(io, room)
      console.log(`Jogador entrou na sala: ${codigoLimpo}`)

      if (room.players.length === 2) {
        iniciarJogo(io, room)
      }
    });

    socket.on("getRoom", async ({ roomCode, userId, username }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase()

      if (!codigoLimpo) {
        socket.emit("roomError", { message: "Código da sala obrigatório" })
        return
      }

      const room = rooms.get(codigoLimpo)

      if (!room) {
        socket.emit("roomError", { message: "Sala não encontrada" })
        return
      }

      if (userId) {
        const jogadorExistente = room.players.find((player) => player.userId === userId)

        if (jogadorExistente) {
          jogadorExistente.socketId = socket.id
          socket.join(codigoLimpo)
        } else if (room.status === "waiting" && room.players.length < 2) {
          room.players.push(await criarJogador(socket, userId, username))
          socket.join(codigoLimpo)

          if (room.players.length === 2) {
            iniciarJogo(io, room)
            return
          }
        } else {
          socket.emit("roomError", { message: "Não podes entrar nesta sala" })
          return
        }
      }

      socket.emit("roomUpdated", prepararSalaParaCliente(room))
      if (room.status === "playing" || room.status === "finished") {
        socket.emit("gameState", prepararSalaParaCliente(room))
      }
    });

    socket.on("submitWord", async ({ roomCode, word }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase()
      const palavra = word?.trim().toUpperCase()

      const room = rooms.get(codigoLimpo)
      if (!room || room.status !== "playing") return

      const player = room.players.find((jogador) => jogador.socketId === socket.id)
      if (!player) return

      if (room.time <= 0) {
        socket.emit("wordResult", { status: "expired", message: "O tempo acabou" })
        return
      }

      if (!palavra) {
        socket.emit("wordResult", { status: "empty", message: "Escreve uma palavra" })
        return
      }

      if (!player.validWords.includes(palavra)) {
        player.wrongWords += 1
        socket.emit("wordResult", { status: "invalid", message: "Palavra inválida" })
        emitirEstadoJogo(io, room)
        return
      }

      if (player.foundWords.includes(palavra)) {
        socket.emit("wordResult", { status: "duplicate", message: "Palavra repetida" })
        return
      }

      player.foundWords.push(palavra)
      player.correctWords += 1
      player.score += 1

      socket.emit("wordResult", { status: "ok", message: "Palavra correta" })

      if (player.foundWords.length === player.validWords.length) {
        await mudarPalavraDoJogador(player)
        emitirEstadoJogo(io, room)
        return
      }

      emitirEstadoJogo(io, room)
    })

    socket.on("skipWord", async ({ roomCode }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase()
      const room = rooms.get(codigoLimpo)

      if (!room || room.status !== "playing") return

      const player = room.players.find((jogador) => jogador.socketId === socket.id)
      if (!player) return

      await mudarPalavraDoJogador(player)
      emitirEstadoJogo(io, room)
    })

// ─── SINGLEPLAYER ───────────────────────────────────────────────────────
    socket.on("game:start", async () => {
      const existing = singleSessions.get(socket.id)
      if (existing?.intervalId) clearInterval(existing.intervalId)

      const state      = await createSingleState()
      const intervalId = startSingleTimer(io, socket)
      singleSessions.set(socket.id, { state, intervalId })

      socket.emit("game:state", {
        mainWord:   state.mainWord,
        validWords: state.validWords,
        foundWords: state.foundWords,
        score:      state.score,
        time:       state.time,
      })
    })

    socket.on("game:check", ({ input }) => {
      const session = singleSessions.get(socket.id)
      if (!session || session.state.isExpired) return

      const { result, newState } = checkSingleWord(session.state, input)
      session.state = newState

      socket.emit("game:check:result", {
        result,
        foundWords: newState.foundWords,
        score:      newState.score,
        time:       newState.time,
      })

      if (result === "complete") {
        setTimeout(async () => {
          const sess = singleSessions.get(socket.id)
          if (!sess || sess.state.isExpired) return
          sess.state = await advanceSingleWord(sess.state)
          socket.emit("game:state", {
            mainWord:   sess.state.mainWord,
            validWords: sess.state.validWords,
            foundWords: sess.state.foundWords,
            score:      sess.state.score,
            time:       sess.state.time,
          })
        }, 1000)
      }
    })

    socket.on("game:next", async () => {
      const session = singleSessions.get(socket.id)
      if (!session || session.state.isExpired) return
      session.state = await advanceSingleWord(session.state)
      socket.emit("game:state", {
        mainWord:   session.state.mainWord,
        validWords: session.state.validWords,
        foundWords: session.state.foundWords,
        score:      session.state.score,
        time:       session.state.time,
      })
    })
    // ────────────────────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      // Limpar sessão singleplayer
      const singleSession = singleSessions.get(socket.id)
      if (singleSession?.intervalId) clearInterval(singleSession.intervalId)
      singleSessions.delete(socket.id)

      console.log("Jogador desconectado:", socket.id);

      for (const roomCode of rooms.keys()) {
        sairDaSala(socket, io, roomCode);
      }
    });
  });
}

export default configureGameSocket;