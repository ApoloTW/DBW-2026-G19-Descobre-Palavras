import '../styles/perfil.css'
import { useState } from 'react';

function MeuPerfil() {
  return (
    <div className="mainTitleProfile">
      <h1>O Meu Perfil</h1>
    </div>
  )
}

function Avatar() {
  /*
  const avatars = [
    { id: 1, image: "/avatars/avatar1.png", unlocked: true, selected: true },
    { id: 2, image: "/avatars/avatar2.png", unlocked: true, selected: false },
    { id: 3, image: "/avatars/avatar3.png", unlocked: true, selected: false },
    { id: 4, image: "/avatars/avatar4.png", unlocked: false, selected: false },
    { id: 5, image: "/avatars/avatar5.png", unlocked: false, selected: false },
  ];
  */
  
  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">🖼️ Avatar</h1>

      <p className="textBoxProfile">Desbloqueia avatares ao ganhar conquistas</p>
    </div>
  )
}

/* Falta a informação que vai ser obtida pela base de dados por agora esta colocada hard-code a 0 */

function Estatisticas() {
  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">📈 Estatísticas</h1>

      <div className="boxInfoRowProfile">
        <div className="boxInfoSmallProfile">
          <h1 className="boxTitleProfile boxTitleInnerProfile">📅 Hoje</h1>

          <p className="textBoxStatsProfile">Palavras encontradas</p>
          <p className="boxTitleStatsProfile">1</p>

          <p className="textBoxStatsProfile">Partidas jogadas</p>
          <p className="boxTitleStatsProfile">0</p>

          <p className="textBoxStatsProfile">Pontuação média</p>
          <p className="boxTitleStatsProfile">0</p>
        </div>

        <div className="boxInfoSmallProfile">
          <h1 className="boxTitleProfile boxTitleInnerProfile">📅 Este Mês</h1>

          <p className="textBoxStatsProfile">Palavras encontradas</p>
          <p className="boxTitleStatsProfile">1</p>

          <p className="textBoxStatsProfile">Partidas jogadas</p>
          <p className="boxTitleStatsProfile">0</p>

          <p className="textBoxStatsProfile">Pontuação média</p>
          <p className="boxTitleStatsProfile">0</p>
        </div>
      </div>
    </div>
  )
}

function NomeUtilizador({ usuario }) {
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  const nomeAtual = usuario?.username || usuario?.nome || "Sem nome";

  const iniciarEdicao = () => {
    setNovoNome(nomeAtual);
    setEditando(true);
  };

  const guardarNome = () => {
    console.log("Nuevo nombre:", novoNome);

    /* más adelante la llamada al backend o actualizar el usuario real */

    setEditando(false);
  };

  const cancelarEdicao = () => {
    setNovoNome(nomeAtual);
    setEditando(false);
  };

  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">Nome de Utilizador</h1>

      {!editando ? (
        <div>
          <p className="nameUserProfile">{nomeAtual}</p>

          <button type="button" className="editNameButton" onClick={iniciarEdicao}>
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
            <button type="button" className="saveButton" onClick={guardarNome}>
              Guardar
            </button>

            <button type="button" className="cancelButton" onClick={cancelarEdicao}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function FundoJogo({ setFundoAtual }) {
  const fundos = [
    { id: 1, nome: "Azul Escuro", preview: "previewAzul", classe: "fundoAzul" },
    { id: 2, nome: "Vermelho Escuro", preview: "previewVermelho", classe: "fundoVermelho" },
    { id: 3, nome: "Púrpura", preview: "previewPurpura", classe: "fundoPurpura" },
    { id: 4, nome: "Verde Escuro", preview: "previewVerde", classe: "fundoVerde" }
  ];

  const [fundoSelecionado, setFundoSelecionado] = useState(fundos[0]);

  return (
    <div className="boxInfoProfile">
      <h1 className="boxTitleProfile">Fundo de Jogo</h1>

      <div className="fundoGrid">
        {fundos.map((fundo) => (
          <div
            key={fundo.id}
            className={`fundoCard ${fundo.preview} ${
              fundoSelecionado.id === fundo.id ? "ativo" : ""
            }`}
            onClick={() => {
              setFundoSelecionado(fundo);
              setFundoAtual(fundo.classe);
            }}
          >
            {fundoSelecionado.id === fundo.id && (
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

/* Falta a informação que vai ser obtida pela base de dados por agora esta colocada hard-code a 0 */

function RecordePessoal() {
  return (
    <div className="boxInfoProfile boxRecordProfile">
      <h1 className="boxTitleProfile">🏆 Recorde Pessoal</h1>
      <p className="boxTitlePoints">0</p>
      <p className="textBoxProfile">pontos</p>
    </div>
  )
}


function ChangeToGreen() {
  document.documentElement.style.setProperty(
    '--bg-gradient',
    'radial-gradient(circle at center, #16a34a 0%, #14532d 40%, #052e16 100%)',
  );
  document.documentElement.style.setProperty('--card-bg', '#5c9d1f');
  document.documentElement.style.setProperty('--accent', '#5c9d1f');
  document.documentElement.style.setProperty('--button-bg', '#5c9d1f');
  document.documentElement.style.setProperty('--button-primary', '#5c9d1f');
  document.documentElement.style.setProperty('--button-primary-hover', '#14532d');
}



function Verde() {
  return (
    <button onClick={ChangeToGreen}>
      Tema Verde
    </button>
  )
}


function Perfil({ usuario, setFundoAtual }) {
  return (
    <div className="perfilPage">
      <MeuPerfil />

      <div className="perfilGrid">
        <div className="perfilColunaEsquerda">
          <Avatar />
          <NomeUtilizador usuario={usuario}/>
          <RecordePessoal />
        </div>

        <div className="perfilColunaDireita">
          <Estatisticas />
          <FundoJogo setFundoAtual={setFundoAtual} />
          <Verde />
        </div>
      </div>
    </div>
  )
}

export default Perfil