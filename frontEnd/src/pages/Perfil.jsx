import '../styles/perfil.css'
import { useState } from 'react'

import avatar1 from '../assets/avatars/avatar1.png'
import avatar2 from '../assets/avatars/avatar2.png'
import avatar3 from '../assets/avatars/avatar3.png'
import avatar4 from '../assets/avatars/avatar4.png'
import avatar5 from '../assets/avatars/avatar5.png'
import avatar6 from '../assets/avatars/avatar6.png'

const API_URL = "http://localhost:3000/api/users"

const avatares = [
  { id: "avatar1", image: avatar1 },
  { id: "avatar2", image: avatar2 },
  { id: "avatar3", image: avatar3 },
  { id: "avatar4", image: avatar4 },
  { id: "avatar5", image: avatar5 },
  { id: "avatar6", image: avatar6 },
]

const fundos = [
  { id: "fundoAzul", nome: "Azul Escuro", preview: "previewAzul" },
  { id: "fundoVermelho", nome: "Vermelho Escuro", preview: "previewVermelho" },
  { id: "fundoPurpura", nome: "Púrpura", preview: "previewPurpura" },
  { id: "fundoVerde", nome: "Verde Escuro", preview: "previewVerde" }
]

function MeuPerfil() {
  return (
    <div className="mainTitleProfile">
      <h1>O Meu Perfil</h1>
    </div>
  )
}

async function atualizarPerfil(dadosParaAtualizar, setUsuario) {
  const token = localStorage.getItem("token")

  const resposta = await fetch(`${API_URL}/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dadosParaAtualizar)
  })

  const dados = await resposta.json()

  if (!resposta.ok) {
    alert(dados.message || "Erro ao atualizar perfil")
    return null
  }

  localStorage.setItem("user", JSON.stringify(dados.user))
  setUsuario(dados.user)

  return dados.user
}

function Avatar({ usuario, setUsuario }) {
  const avatarAtual = usuario?.avatar || "avatar1"

  async function selecionarAvatar(avatarId) {
    await atualizarPerfil({ avatar: avatarId }, setUsuario)
  }

  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">🖼️ Avatar</h1>

      <div className="fundoGrid">
        {avatares.map((avatar) => (
          <div
            key={avatar.id}
            className={`avatarItem ${
              avatarAtual === avatar.id ? "selecionado" : ""
            }`}
            onClick={() => selecionarAvatar(avatar.id)}
          >
            <img
              src={avatar.image}
              alt={`Avatar ${avatar.id}`}
              className="avatarImage"
            />

            {avatarAtual === avatar.id && (
              <div className="checkAvatar">✓</div>
            )}
          </div>
        ))}
      </div>

      <p className="textBoxProfile">Escolhe o teu Avatar</p>
    </div>
  )
}

function calcularMedia(score, gamesPlayed) {
  if (!gamesPlayed || gamesPlayed === 0) {
    return 0
  }

  return Math.round(score / gamesPlayed)
}

function Estatisticas({ usuario }) {
  const today = usuario?.stats?.today || {}
  const monthly = usuario?.stats?.monthly || {}

  const todayCorrectWords = today.correctWords || 0
  const todayGamesPlayed = today.gamesPlayed || 0
  const todayScore = today.score || 0

  const monthlyCorrectWords = monthly.correctWords || 0
  const monthlyGamesPlayed = monthly.gamesPlayed || 0
  const monthlyScore = monthly.score || 0

  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">📈 Estatísticas</h1>

      <div className="boxInfoRowProfile">
        <div className="boxInfoSmallProfile">
          <h1 className="boxTitleProfile boxTitleInnerProfile">📅 Hoje</h1>

          <p className="textBoxStatsProfile">Palavras encontradas</p>
          <p className="boxTitleStatsProfile">{todayCorrectWords}</p>

          <p className="textBoxStatsProfile">Partidas jogadas</p>
          <p className="boxTitleStatsProfile">{todayGamesPlayed}</p>

          <p className="textBoxStatsProfile">Pontuação média</p>
          <p className="boxTitleStatsProfile">
            {calcularMedia(todayScore, todayGamesPlayed)}
          </p>
        </div>

        <div className="boxInfoSmallProfile">
          <h1 className="boxTitleProfile boxTitleInnerProfile">📅 Este Mês</h1>

          <p className="textBoxStatsProfile">Palavras encontradas</p>
          <p className="boxTitleStatsProfile">{monthlyCorrectWords}</p>

          <p className="textBoxStatsProfile">Partidas jogadas</p>
          <p className="boxTitleStatsProfile">{monthlyGamesPlayed}</p>

          <p className="textBoxStatsProfile">Pontuação média</p>
          <p className="boxTitleStatsProfile">
            {calcularMedia(monthlyScore, monthlyGamesPlayed)}
          </p>
        </div>
      </div>
    </div>
  )
}

function NomeUtilizador({ usuario, setUsuario }) {
  const [editando, setEditando] = useState(false)
  const [novoNome, setNovoNome] = useState("")

  const nomeAtual = usuario?.username || "Sem nome"

  function iniciarEdicao() {
    setNovoNome(nomeAtual)
    setEditando(true)
  }

  async function guardarNome() {
    if (!novoNome.trim()) {
      alert("O nome de utilizador não pode estar vazio")
      return
    }

    const userAtualizado = await atualizarPerfil(
      { username: novoNome },
      setUsuario
    )

    if (userAtualizado) {
      setEditando(false)
    }
  }

  function cancelarEdicao() {
    setNovoNome(nomeAtual)
    setEditando(false)
  }

  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">Nome de Utilizador</h1>

      {!editando ? (
        <div>
          <p className="nameUserProfile">{nomeAtual}</p>

          <button
            type="button"
            className="editNameButton"
            onClick={iniciarEdicao}
          >
            Alterar nome
          </button>
        </div>
      ) : (
        <div className="editNameArea">
          <input
            type="text"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            className="inputNomeProfile"
            placeholder="Novo nome"
          />

          <div className="editButtonsRow">
            <button
              type="button"
              className="saveButton"
              onClick={guardarNome}
            >
              Guardar
            </button>

            <button
              type="button"
              className="cancelButton"
              onClick={cancelarEdicao}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FundoJogo({ usuario, setUsuario }) {
  const fundoAtual = usuario?.background || "fundoAzul"

  async function selecionarFundo(fundoId) {
    await atualizarPerfil({ background: fundoId }, setUsuario)
  }

  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">Fundo de Jogo</h1>

      <div className="fundoGrid">
        {fundos.map((fundo) => (
          <div
            key={fundo.id}
            className={`fundoCard ${fundo.preview} ${
              fundoAtual === fundo.id ? "ativo" : ""
            }`}
            onClick={() => selecionarFundo(fundo.id)}
          >
            {fundoAtual === fundo.id && (
              <div className="checkFundo">✓</div>
            )}

            <p className="nomeFundo">{fundo.nome}</p>
          </div>
        ))}
      </div>

      <p className="textBoxProfile">
        Pré-visualização atual - Este fundo será aplicado durante as tuas partidas
      </p>
    </div>
  )
}

function RecordePessoal({ usuario }) {
  const personalRecord = usuario?.personalRecord || 0

  return (
    <div className="boxInfoProfile boxRecordProfile">
      <h1 className="boxTitleProfile">🏆 Recorde Pessoal</h1>
      <p className="boxTitlePoints">{personalRecord}</p>
      <p className="textBoxProfile">pontos</p>
    </div>
  )
}

function Perfil({ usuario, setUsuario }) {
  return (
    <div className="perfilPage">
      <MeuPerfil />

      <div className="perfilGrid">
        <div className="perfilColunaEsquerda">
          <Avatar usuario={usuario} setUsuario={setUsuario} />
          <NomeUtilizador usuario={usuario} setUsuario={setUsuario} />
          <RecordePessoal usuario={usuario} />
        </div>

        <div className="perfilColunaDireita">
          <Estatisticas usuario={usuario} />
          <FundoJogo usuario={usuario} setUsuario={setUsuario} />
        </div>
      </div>
    </div>
  )
}

export default Perfil