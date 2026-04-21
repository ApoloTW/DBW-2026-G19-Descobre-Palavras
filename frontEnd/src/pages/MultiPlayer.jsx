import '../styles/multiplayer.css'
import { Link } from "react-router-dom"
import { useState } from 'react';

import { useScore } from '../hooks/useScore';
import { useTemporizador } from '../hooks/useTemporizador';
import { useWordGame } from '../hooks/useWordGame';
import { WordDisplay } from '../components/WordDisplay';

const bancoPalavras = {
  "ARMARIO": ["ARMA", "RIO", "MAR", "MARIO"],
  "PLANETA": ["PLAN", "ANTE", "LANA", "NETA", "PALA", "TELA"],
  "CASTILLO": ["TILO", "LISO", "CAST", "SAIL", "COLA", "CALLO"],
};

// ── Panel de cada jugador ──────────────────────────────────────────
function PlayerPanel({ name, score, wordsFound, isLocalPlayer }) {
  return (
    <div className={`player-panel ${isLocalPlayer ? 'local' : 'rival'}`}>
      <div className="player-header">
        <span className="player-name">👤 {name}</span>
        <span className="trophy">🏆</span>
      </div>
      <p className="player-score">{score} pts</p>
      <p className="player-words">{wordsFound} palavras encontradas</p>
    </div>
  );
}

// ── Timer central ──────────────────────────────────────────────────
function Timer({ time }) {
  return (
    <div className="timer-central">
      🕐 {time}s
    </div>
  );
}

// ── Input de respuesta ─────────────────────────────────────────────
function InputSection({ input, setInput, onCheck }) {
  const handleKey = e => e.key === "Enter" && onCheck();

  return (
    <div className="input-row">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Escreve uma palavra..."
      />
      <button onClick={onCheck}>Verificar</button>
    </div>
  );
}

// ── Juego principal ────────────────────────────────────────────────
function Multijogador() {
  const { mainWord, validWords, input, setInput, foundWords, setFoundWords, nextWord } = useWordGame(bancoPalavras);
  const { score, addPoint, resetScore } = useScore();
  const { time, isExpired } = useTemporizador(60);

  // Datos del rival — de momento estáticos, luego vendrán del servidor
  const rival = {
    name: "Rival_293",
    score: 37,
    wordsFound: 1,
  };

  const checkWord = () => {
    const palabra = input.toUpperCase().trim();
    if (!validWords.includes(palabra)) return "invalid";
    if (foundWords.includes(palabra)) return "duplicate";

    const nuevas = [...foundWords, palabra];
    setFoundWords(nuevas);
    addPoint();
    setInput("");

    if (nuevas.length === validWords.length) {
      setTimeout(nextWord, 1000);
    }

    return "ok";
  };

  if (isExpired) {
    return (
      <div className="game-container">
        <div className="card">
          <h2>Fim do Jogo!</h2>
          <p>A tua pontuação: {score}</p>
          <p>Pontuação do rival: {rival.score}</p>
          <h3>{score > rival.score ? "🏆 Ganhaste!" : "😔 Perdeste..."}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">

      {/* Cabecera con link de vuelta */}
      <div className="top-bar">
        <Link to="/">🏠 Voltar</Link>
        <h1>Multijogador</h1>
      </div>

      {/* Paneles de jugadores */}
      <div className="players-row">
        <PlayerPanel
          name="Tu"
          score={score}
          wordsFound={foundWords.length}
          isLocalPlayer={true}
        />
        <PlayerPanel
          name={rival.name}
          score={rival.score}
          wordsFound={rival.wordsFound}
          isLocalPlayer={false}
        />
      </div>

      {/* Timer compartido */}
      <Timer time={time} />

      {/* Palabra principal */}
      <div className="card">
        <p>Palavra Principal:</p>
        <WordDisplay word={mainWord} />
        <p>{foundWords.length} de {validWords.length} palavras encontradas</p>
        <button className="btn-siguiente" onClick={nextWord}>⏭ Saltar Palavra</button>
      </div>

      {/* Input abajo */}
      <InputSection
        input={input}
        setInput={setInput}
        onCheck={checkWord}
      />

    </div>
  );
}

function MultiPlayer() {
  return <Multijogador />;
}

export default MultiPlayer;