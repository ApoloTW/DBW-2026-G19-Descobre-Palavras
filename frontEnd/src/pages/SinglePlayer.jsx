import '../styles/singleplayer.css'
import { useState } from "react";

import { useScore } from '../hooks/useScore';
import { useTemporizador } from '../hooks/useTemporizador';
import { useWordGame } from '../hooks/useWordGame';
import { WordDisplay } from '../components/WordDisplay';

const bancoPalavras = {
    "ARMARIO": ["ARMA", "RIO", "MAR", "MARIO"],
    "PLANETA": ["PLAN", "ANTE", "LANA", "NETA", "PALA", "TELA"],
    "CASTILLO": ["TILO", "LISO", "CAST", "SAIL", "COLA", "CALLO"],
  };

function useGame() {
  const {
    mainWord,
    validWords,
    input,
    setInput,
    foundWords,
    setFoundWords,
    nextWord
  } = useWordGame(bancoPalavras);

  const { score, addPoint, resetScore } = useScore();
  const { time, addTime, isExpired, resetTime, setActive } = useTemporizador(10);
  
  const resetGame = () => {
    resetScore();
    resetTime();
    setActive(true);
    nextWord();
  };

  const checkWord = () => {
    const palabra = input.toUpperCase().trim();

    if (!validWords.includes(palabra)) return "invalid";
    if (foundWords.includes(palabra)) return "duplicate";

    const nuevas = [...foundWords, palabra];
    setFoundWords(nuevas);

    addPoint();
    addTime(5);

    setInput("");

    if (nuevas.length === validWords.length) {
      setTimeout(nextWord, 1000);
    }

    return "ok";
  };

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
  resetGame };
}

function InputSection({ input, setInput, onCheck }) {
  const manejarTecla = e => e.key === "Enter" && onCheck();

  
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
  );
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
  );
}

function Controles({ alAvanzar }) {
  return (
    <div className="controles-row">
      <button className="btn-siguiente" onClick={alAvanzar}>
        Próxima Palavra →
      </button>
    </div>
  );
}

function Jogo() {
  const game = useGame();
  
  if (game.isExpired) {
    return (
      <div className="game-container">
        <div className="card">
          <h2>Game Over</h2>
          <p>Puntuação final: {game.score}</p>
          <button onClick={game.resetGame}>
            Jogar de novo
          </button>
        </div>
      </div>
    );
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

        {/* Botón para saltar manualmente */}
        <Controles alAvanzar={game.nextWord} />

        <FoundWords
          words={game.foundWords}
          total={game.validWords.length}
        />
		
		<p>Puntuación: {game.score}</p>
		<p>Tempo: {game.time}s</p>

      </div>
    </div>
  );
}



function SinglePlayer() {
  return (
    <div>
      <Jogo />
    </div>
  )
}

export default SinglePlayer