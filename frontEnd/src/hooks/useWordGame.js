import '../styles/home.css'
import { useState, useEffect } from "react";

export function useWordGame(bancoPalavras) {
  const listaLlaves = Object.keys(bancoPalavras);
  const [indicePalabra, setIndicePalabra] = useState(0);

  const mainWord = listaLlaves[indicePalabra];
  const validWords = bancoPalavras[mainWord];

  const [input, setInput] = useState("");
  const [foundWords, setFoundWords] = useState([]);

  const nextWord = () => {
    setIndicePalabra(i => (i + 1) % listaLlaves.length);
    setFoundWords([]);
    setInput("");
  };

  return {
    mainWord,
    validWords,
    input,
    setInput,
    foundWords,
    setFoundWords,
    nextWord
  };
}