import '../styles/ranking.css'
import { Link } from "react-router-dom"
import { useState } from 'react';

function Rankings() {
  return (
      <div className="mainTitleRank">
        <h1>🏆 Rankings</h1>
      </div>
  )
}

function SubTextRank() {
  return (
    <div className="textRank">
      <p>Os melhores jogadores da comunidade</p>
    </div>
  )
}

function BoxFinalText() {
  return (
    <div className="boxInfoFinalText">
      <p className="textBoxRank">Os rankings são atualizados a cada hora. Continua a jogar para melhorar a tua posição!</p>
    </div>
  )
}

function Ranking() {
  return (
    <div>
      <Rankings/>
      <SubTextRank/>
      <BoxFinalText/>
    </div>
  )
}

export default Ranking