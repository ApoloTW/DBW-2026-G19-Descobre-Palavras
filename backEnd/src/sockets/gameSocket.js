import User from "../models/User.js";

const rooms = new Map();

const bancoPalavras = {
  ARMARIO: ["ARMA", "RIO", "MAR", "MARIO"],
  PLANETA: ["PLAN", "ANTE", "LANA", "NETA", "PALA", "TELA"],
  CASTILLO: ["TILO", "LISO", "CAST", "SAIL", "COLA", "CALLO"]
};

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

function escolherPalavraAleatoria() {
  const palavras = Object.keys(bancoPalavras);
  const indice = Math.floor(Math.random() * palavras.length);
  const mainWord = palavras[indice];

  return {
    mainWord,
    validWords: bancoPalavras[mainWord]
  };
}

function criarJogador(socket, userId, username) {
  return {
    socketId: socket.id,
    userId,
    username: username || "Jogador",
    score: 0,
    correctWords: 0,
    wrongWords: 0,
    foundWords: []
  };
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
      foundWords: player.foundWords
    })),
    playerCount: room.players.length,
    maxPlayers: 2,
    readyToStart: room.players.length === 2,
    mainWord: room.mainWord,
    totalWords: room.validWords.length
  };
}

function emitirSala(io, room) {
  io.to(room.roomCode).emit("roomUpdated", prepararSalaParaCliente(room));
}

function emitirEstadoJogo(io, room) {
  io.to(room.roomCode).emit("gameState", prepararSalaParaCliente(room));
}

function iniciarJogo(io, room) {
  if (room.status !== "waiting") {
    return;
  }

  const palavra = escolherPalavraAleatoria();

  room.mainWord = palavra.mainWord;
  room.validWords = palavra.validWords;
  room.status = "playing";
  room.time = 60;
  room.statsSaved = false;

  room.players = room.players.map((player) => ({
    ...player,
    score: 0,
    correctWords: 0,
    wrongWords: 0,
    foundWords: []
  }));

  emitirSala(io, room);
  emitirEstadoJogo(io, room);

  room.intervalId = setInterval(() => {
    room.time -= 1;

    if (room.time <= 0) {
      room.time = 0;
      terminarJogo(io, room);
      return;
    }

    emitirEstadoJogo(io, room);
  }, 1000);
}

function mudarPalavra(io, room) {
  const palavra = escolherPalavraAleatoria();

  room.mainWord = palavra.mainWord;
  room.validWords = palavra.validWords;

  room.players.forEach((player) => {
    player.foundWords = [];
  });

  emitirEstadoJogo(io, room);
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

    socket.on("createRoom", ({ userId, username }) => {
      if (!userId) {
        socket.emit("roomError", {
          message: "Utilizador inválido"
        });
        return;
      }

      const roomCode = gerarCodigoUnico();

      const room = {
        roomCode,
        status: "waiting",
        time: 60,
        players: [
          criarJogador(socket, userId, username)
        ],
        mainWord: "",
        validWords: [],
        intervalId: null,
        statsSaved: false,
        createdAt: new Date()
      };

      rooms.set(roomCode, room);

      socket.join(roomCode);

      socket.emit("roomCreated", prepararSalaParaCliente(room));
      emitirSala(io, room);

      console.log(`Sala criada: ${roomCode}`);
    });

    socket.on("joinRoom", ({ roomCode, userId, username }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase();

      if (!codigoLimpo) {
        socket.emit("roomError", {
          message: "Código da sala obrigatório"
        });
        return;
      }

      if (!userId) {
        socket.emit("roomError", {
          message: "Utilizador inválido"
        });
        return;
      }

      const room = rooms.get(codigoLimpo);

      if (!room) {
        socket.emit("roomError", {
          message: "Sala não encontrada"
        });
        return;
      }

      const jogadorExistente = room.players.find(
        (player) => player.userId === userId
      );

      if (jogadorExistente) {
        jogadorExistente.socketId = socket.id;
        socket.join(codigoLimpo);

        socket.emit("roomUpdated", prepararSalaParaCliente(room));

        if (room.status === "playing" || room.status === "finished") {
          socket.emit("gameState", prepararSalaParaCliente(room));
        }

        return;
      }

      if (room.players.length >= 2) {
        socket.emit("roomError", {
          message: "A sala já está cheia"
        });
        return;
      }

      if (room.status !== "waiting") {
        socket.emit("roomError", {
          message: "O jogo já começou"
        });
        return;
      }

      room.players.push(criarJogador(socket, userId, username));

      socket.join(codigoLimpo);

      emitirSala(io, room);

      console.log(`Jogador entrou na sala: ${codigoLimpo}`);

      if (room.players.length === 2) {
        iniciarJogo(io, room);
      }
    });

    socket.on("getRoom", ({ roomCode, userId, username }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase();

      if (!codigoLimpo) {
        socket.emit("roomError", {
          message: "Código da sala obrigatório"
        });
        return;
      }

      const room = rooms.get(codigoLimpo);

      if (!room) {
        socket.emit("roomError", {
          message: "Sala não encontrada"
        });
        return;
      }

      if (userId) {
        const jogadorExistente = room.players.find(
          (player) => player.userId === userId
        );

        if (jogadorExistente) {
          jogadorExistente.socketId = socket.id;
          socket.join(codigoLimpo);
        } else if (room.status === "waiting" && room.players.length < 2) {
          room.players.push(criarJogador(socket, userId, username));
          socket.join(codigoLimpo);

          if (room.players.length === 2) {
            iniciarJogo(io, room);
            return;
          }
        } else {
          socket.emit("roomError", {
            message: "Não podes entrar nesta sala"
          });
          return;
        }
      }

      socket.emit("roomUpdated", prepararSalaParaCliente(room));

      if (room.status === "playing" || room.status === "finished") {
        socket.emit("gameState", prepararSalaParaCliente(room));
      }
    });

    socket.on("submitWord", ({ roomCode, word }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase();
      const palavra = word?.trim().toUpperCase();

      const room = rooms.get(codigoLimpo);

      if (!room || room.status !== "playing") {
        return;
      }

      const player = room.players.find(
        (jogador) => jogador.socketId === socket.id
      );

      if (!player) {
        return;
      }

      if (room.time <= 0) {
        socket.emit("wordResult", {
          status: "expired",
          message: "O tempo acabou"
        });
        return;
      }

      if (!palavra) {
        socket.emit("wordResult", {
          status: "empty",
          message: "Escreve uma palavra"
        });
        return;
      }

      if (!room.validWords.includes(palavra)) {
        player.wrongWords += 1;

        socket.emit("wordResult", {
          status: "invalid",
          message: "Palavra inválida"
        });

        emitirEstadoJogo(io, room);
        return;
      }

      if (player.foundWords.includes(palavra)) {
        socket.emit("wordResult", {
          status: "duplicate",
          message: "Palavra repetida"
        });
        return;
      }

      player.foundWords.push(palavra);
      player.correctWords += 1;
      player.score += 1;

      socket.emit("wordResult", {
        status: "ok",
        message: "Palavra correta"
      });

      if (player.foundWords.length === room.validWords.length) {
        mudarPalavra(io, room);
        return;
      }

      emitirEstadoJogo(io, room);
    });

    socket.on("skipWord", ({ roomCode }) => {
      const codigoLimpo = roomCode?.trim().toUpperCase();
      const room = rooms.get(codigoLimpo);

      if (!room || room.status !== "playing") {
        return;
      }

      mudarPalavra(io, room);
    });

    socket.on("leaveRoom", ({ roomCode }) => {
      sairDaSala(socket, io, roomCode);
    });

    socket.on("disconnect", () => {
      console.log("Jogador desconectado:", socket.id);

      for (const roomCode of rooms.keys()) {
        sairDaSala(socket, io, roomCode);
      }
    });
  });
}

export default configureGameSocket;