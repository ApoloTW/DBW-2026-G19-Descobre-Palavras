import '../styles/ranking.css'
import { useEffect, useState } from 'react'

const API_URL = "http://localhost:3000/api/users"

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
    <div className="buttonInfoTime">
      <button
        className={active === "semanal" ? "boxInfoTime active" : "boxInfoTime"}
        onClick={() => setActive("semanal")}
      >
        <p className="titleInfoTime">📅 Ranking Semanal</p>
      </button>

      <button
        className={active === "mensal" ? "boxInfoTime active" : "boxInfoTime"}
        onClick={() => setActive("mensal")}
      >
        <p className="titleInfoTime">📅 Ranking Mensal</p>
      </button>
    </div>
  )
}

function formatarTempo(segundos) {
  if (!segundos || segundos <= 0) {
    return "00:00"
  }

  const minutos = Math.floor(segundos / 60)
  const segundosRestantes = segundos % 60

  return `${minutos}:${String(segundosRestantes).padStart(2, "0")}`
}

function RankingList({ ranking, loading }) {
  if (loading) {
    return (
      <div className="boxInfoFinalText">
        <p className="textBoxFinalText">A carregar ranking...</p>
      </div>
    )
  }

  if (ranking.length === 0) {
    return (
      <div className="boxInfoFinalText">
        <p className="textBoxFinalText">Ainda não existem jogadores no ranking.</p>
      </div>
    )
  }

  return (
    <>
      {ranking.map((player, index) => (
        <div
          key={player.id}
          className={`boxInfoRank ${
            index === 0 ? "first" :
            index === 1 ? "second" :
            index === 2 ? "third" : ""
          }`}
        >
          <div className="boxInfoRankLeft">
            <div className="textBoxNumberRank">
              {index + 1}
            </div>

            <div className="columnInfo">
              <p className="textBoxUserName">{player.username}</p>
              <p className="textBoxDate">
                {index + 1}º lugar
              </p>
            </div>
          </div>

          <div className="boxInfoRankRight">
            <div className="columnInfo">
              <span className="textBoxStatsInfo">Palavras</span>
              <span className="textBoxStats">{player.correctWords}</span>
            </div>

            <div className="columnInfo">
              <span className="textBoxStatsInfo">Tempo</span>
              <span className="textBoxStats">
                {formatarTempo(player.totalTime)}
              </span>
            </div>

            <div className="columnInfo">
              <span className="textBoxStatsInfo">Pontos</span>
              <span className="textBoxStats">{player.score}</span>
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
      <p className="textBoxFinalText">
        Os rankings são atualizados com base nas estatísticas guardadas na base de dados.
      </p>
    </div>
  )
}

function Ranking() {
  const [active, setActive] = useState("semanal")
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function carregarRanking() {
      try {
        setLoading(true)

        const resposta = await fetch(`${API_URL}/ranking?period=${active}`)
        const dados = await resposta.json()

        if (!resposta.ok) {
          alert(dados.message || "Erro ao carregar ranking")
          return
        }

        setRanking(dados.ranking)

      } catch (error) {
        console.error(error)
        alert("Erro ao ligar ao servidor")
      } finally {
        setLoading(false)
      }
    }

    carregarRanking()
  }, [active])

  return (
    <div>
      <Rankings />
      <SubTextRank />
      <RankTime active={active} setActive={setActive} />
      <RankingList ranking={ranking} loading={loading} />
      <BoxFinalText />
    </div>
  )
}

export default Ranking