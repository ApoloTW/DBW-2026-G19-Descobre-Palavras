import '../styles/home.css'
import { useState } from "react";

export function WordDisplay({ word }) {
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