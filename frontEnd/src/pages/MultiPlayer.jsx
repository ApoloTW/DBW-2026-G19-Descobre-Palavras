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

function PlayerPanel({ name, score, wordsFound, isLocalPlayer }) {
  return (
    <div className={`painel-jogador ${isLocalPlayer ? 'local' : 'rival'}`}>
      <div className="cabecalho-jogador">
        <span className="player-name">👤 {name}</span>
        <span className="trophy">🏆</span>
      </div>
      <p className="pontuacao-jogador">{score} pts</p>
      <p className="palavras-jogador">{wordsFound} palavras encontradas</p>
    </div>
  );
}

function Timer({ time }) {
  return (
    <div className="temporizador-central">
      🕐 {time}s
    </div>
  );
}

function InputSection({ input, setInput, onCheck }) {
  const handleKey = e => e.key === "Enter" && onCheck();

  return (
    <div className="linha-entrada">
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

function Multijogador() {
  const { mainWord, validWords, input, setInput, foundWords, setFoundWords, nextWord } = useWordGame(bancoPalavras);
  const { score, addPoint, resetScore } = useScore();
  const { time, isExpired } = useTemporizador(60);

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
      <div className="contentor-jogo">
        <div className="cartao">
          <h2>Fim do Jogo!</h2>
          <p>A tua pontuação: {score}</p>
          <p>Pontuação do rival: {rival.score}</p>
          <h3>{score > rival.score ? "🏆 Ganhaste!" : "😔 Perdeste..."}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="contentor-jogo">

      <div className="barra-topo">
        <Link to="/">🏠 Voltar</Link>
        <h1>Multijogador</h1>
      </div>

      <div className="fila-jogadores">
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

      <Timer time={time} />

      <div className="cartao">
        <p>Palavra Principal:</p>
        <WordDisplay word={mainWord} />
        <p>{foundWords.length} de {validWords.length} palavras encontradas</p>
        <button className="btn-avancar" onClick={nextWord}>⏭ Saltar Palavra</button>
      </div>

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