import '../styles/home.css'
import { Link } from "react-router-dom"
import { useState } from 'react';

function Titulo() {
  return (
    <div className="titulo">
       <h1>Descobre as Palavras</h1>
    </div>
  )
}

function TextoASeguir() {
  return (
    <div className="titulo">
       <h2>Desafia a tua mente encontrando palavras ocultas</h2>
    </div>
  )
}

function Explicacao() {
  return (
    <div className="titulo">
       <p>ARMARIO contém ARMA e RIO. Quantas palavras consegues encontrar?</p>
    </div>
  )
}

function ButtonJogar({ usuario }) {
    if (usuario) {
      return (
        <div className="texto">
          <Link to="/play" className="caja">
          <p>▷ Jogar Agora!</p>
          </Link>
        </div>
      )
    } else {
      return (
        <div className="texto">
          <Link to="/login" className="caja">
          <p>Inicia sessão para jogar</p>
          </Link>
        </div>
      )
    }
}

function useGame() {
  const mainWord = "ARMARIO";
  const validWords = ["ARMA", "RIO", "MAR", "MARIO"];

  const [input, setInput] = useState("");
  const [foundWords, setFoundWords] = useState([]);

  const checkWord = () => {
    const word = input.toUpperCase();

    if (!validWords.includes(word)) return "invalid";
    if (foundWords.includes(word)) return "duplicate";

    setFoundWords([...foundWords, word]);
    setInput("");
    return "ok";
  };

  return {
    mainWord,
    validWords,
    input,
    setInput,
    foundWords,
    checkWord
  };
}

function WordDisplay({ word }) {
  return (
    <div className="letters">
      {word.split("").map((l, i) => (
        <div key={i} className="letter-box">
          {l}
        </div>
      ))}
    </div>
  );
}

function InputSection({ input, setInput, onCheck }) {
  return (
    <div className="input-row">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
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
        {words.map((w, i) => (
          <span key={i} className="found-word">
            {w}
          </span>
        ))}
      </div>
    </>
  );
}

function Jogo() {
  const game = useGame();

  return (
    <div className="game-container">
      <h2>Experimenta o Jogo</h2>

      <div className="card">
        <p>Palavra Principal:</p>

        <WordDisplay word={game.mainWord} />

        <InputSection
          input={game.input}
          setInput={game.setInput}
          onCheck={game.checkWord}
        />

        <FoundWords
          words={game.foundWords}
          total={game.validWords.length}
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="icon">{icon}</div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function Features() {
  return (
    <div className="features-container">

      <FeatureCard
        icon="⏱️"
        title="Modo Contrarrelógio"
        text="Encontra palavras antes que o tempo acabe. Cada acerto adiciona segundos!"
      />

      <FeatureCard
        icon="👥"
        title="Multijogador"
        text="Compete contra outros jogadores em tempo real."
      />

      <FeatureCard
        icon="🏆"
        title="Rankings"
        text="Compete pelo primeiro lugar nos rankings semanais e mensais"
      />

    </div>
  );
}

function TextoFinal({titulo, texto}) {
  return (
    <div className="finalText">
      <h3>{titulo}</h3>
      <p>{texto}</p>
      <div className="caixaCriarConta">
        <Link to="/login" className="conteudoCaixaCriarConta">
          <p>Inicie sessão para jogar</p>
        </Link>
      </div>
    </div>
  )
}

function CaixaFinal({ usuario }) {
  return (
    <>
      {!usuario && (
      <div className="caixaFinal">
        <TextoFinal 
          titulo="Pronto para o desafio?" 
          texto="Cria a tua conta e começa a jogar agora" 
        />
      </div>
      )}
    </>
  );
}

function Home({ usuario }) {
  return (
    <div>
      <Titulo />
      <TextoASeguir />
      <Explicacao />
      <ButtonJogar usuario={usuario} />
      <Jogo />
      <Features />
      <CaixaFinal usuario={usuario} />
    </div>
  )  
}

export default Home