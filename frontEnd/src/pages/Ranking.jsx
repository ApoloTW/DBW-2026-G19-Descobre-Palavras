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

function RankTime({ active, setActive }) {
  return (
    <div className="buttonInfoTime" >
      <button className={active === "semanal" ? "boxInfoTime active" : "boxInfoTime"} onClick={() => setActive("semanal")}>
        <p className="titleInfoTime">📅 Ranking Semanal</p>
      </button>

      <button className={active === "mensal" ? "boxInfoTime active" : "boxInfoTime"} onClick={() => setActive("mensal")}>
        <p className="titleInfoTime">📅 Ranking Mensal</p>
      </button>
    </div>
  )
}

/* Faltaria adicionar uma variavel depois na parte do backend onde so é para mostrar os 10 melhores e uma ultima caixa que mostra a posição do utilizador e se o utilizador estiver no top 10 nao mostrar a caixa*/

function RankingList({ active }) {
  const statsWeek = [
    {id: 1, userName: "Test1" },
    {id: 2, userName: "Test2" },
    {id: 3, userName: "Test3" },
    {id: 4, userName: "Test4" },
    {id: 5, userName: "Test5" },
  ];

  const statsMonth = [
    {id: 1, userName: "Test1M" },
    {id: 2, userName: "Test2M" },
    {id: 3, userName: "Test3M" },
    {id: 4, userName: "Test4M" },
    {id: 5, userName: "Test5M" },
  ];

  const currentStats = active === "semanal" ? statsWeek : statsMonth;

  return (
    <>
      {currentStats.map((player, index) => (
    
        <div
          key={player.id}
          className={`boxInfoRank ${
            index === 0 ? "first" :
            index === 1 ? "second" :
            index === 2 ? "third" : ""
          }`}
        >
          <div className="boxInfoRankLeft">
            <div className="textBoxNumberRank">{index + 1}</div>
        
            <div className="columnInfo">
              <p className="textBoxUserName">{player.userName}</p>
              <p className="textBoxDate">15/04/25</p>
            </div>
          </div>

          <div className="boxInfoRankRight">
            <div className="columnInfo">
              <span className="textBoxStatsInfo">Palavras</span>
              <span className="textBoxStats">100</span>
            </div>

            <div className="columnInfo">
              <span className="textBoxStatsInfo">Tempo</span>
              <span className="textBoxStats">33:44</span>
            </div>

            <div className="columnInfo">
              <span className="textBoxStatsInfo">Pontos</span>
              <span className="textBoxStats">100</span>
            </div>

          </div>
        </div>
      ))}
    </>
  )
}

function BoxFinalText() {
  return (
    <div className="boxInfoFinalText">
      <p className="textBoxFinalText">Os rankings são atualizados a cada hora. Continua a jogar para melhorar a tua posição!</p>
    </div>
  )
}

function Ranking() {
  const [active, setActive] = useState("semanal");
  
  return (
    <div>
      <Rankings/>
      <SubTextRank/>
      <RankTime active={active} setActive={setActive}/>
      <RankingList active={active}/>
      <BoxFinalText/>
    </div>
  )
}

export default Ranking