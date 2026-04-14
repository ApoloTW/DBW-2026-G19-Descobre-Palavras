import '../styles/singleplayer.css'
import { Link } from "react-router-dom"
import { useState } from 'react';

function ModoIndividual() {
    return (
        <div>
          <h2>Modo Individual</h2>
        </div>
    )
}


function useGame() {
  const bancoPalavras = {
    "ARMARIO": ["ARMA", "RIO", "MAR", "MARIO"],
    "PLANETA": ["PLAN", "ANTE", "LANA", "NETA", "PALA", "TELA"],
    "CASTILLO": ["TILO", "LISO", "CAST", "SAIL", "COLA", "CALLO"],
  };

  const listaLlaves = Object.keys(bancoPalavras);
  const [indicePalabra, setIndicePalabra] = useState(0);

  const mainWord = listaLlaves[indicePalabra];
  const validWords = bancoPalavras[mainWord];

  const [input, setInput] = useState("");
  const [foundWords, setFoundWords] = useState([]);

  // Función para avanzar
  const proximaPalabra = () => {
    const siguienteIndice = (indicePalabra + 1) % listaLlaves.length;
    setIndicePalabra(siguienteIndice);
    setFoundWords([]);
    setInput("");
  };

  const checkWord = () => {
    const palabraLimpia = input.toUpperCase().trim();

    if (!validWords.includes(palabraLimpia)) return "invalid";
    if (foundWords.includes(palabraLimpia)) return "duplicate";

    const nuevasEncontradas = [...foundWords, palabraLimpia];
    setFoundWords(nuevasEncontradas);
    setInput("");

    if (nuevasEncontradas.length === validWords.length) {
      setTimeout(proximaPalabra, 1000);
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
    proximaPalabra
  };
}

function WordDisplay({ word }) {
  return (
    <div className="letters">
      {word.split("").map((letra, indice) => (
      <div key={indice} className="letter-box">
        {letra}
      </div>
    ))}
    </div>
  );
}

function InputSection({ input, setInput, onCheck }) {
  const manejarTecla = (evento) => {
    // Verificamos si la tecla presionada es "Enter"
    if (evento.key === "Enter") {
      onCheck();
    }
  };
  
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
        <Controles alAvanzar={game.proximaPalabra} />

        <FoundWords
          words={game.foundWords}
          total={game.validWords.length}
        />
      </div>
    </div>
  );
}


function SinglePlayer() {
  return (
    <div>
      <ModoIndividual/>
      <Jogo />
    </div>
  )
}

export default SinglePlayer