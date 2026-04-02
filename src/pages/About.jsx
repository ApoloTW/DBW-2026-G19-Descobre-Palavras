import '../styles/about.css'

// Componentes de About
function SobreNos() {
  return (
    <div className="mainTitle">
      <h1>Sobre Nós</h1>
    </div>
  )
}

function SegundoTitulo() {
  return (
    <p className="text">
      Descobre quem somos e o que nos inspira
    </p>
  )
}

function ANossaMissao() {
  return (
    <div className="boxInfo">
      <h2 className="boxTitle">🎯 A Nossa Missão</h2>
      <p className="textBox">Criar um espaço onde as palavras ganham vida e a aprendizagem se torna divertida. Acreditamos que cada palavra esconde segredos fascinantes, e o nosso objetivo é ajudar-te a descobri-los de uma maneira divertida e desafiante.</p>
    </div>
  )
}

function OQueFazemos() {
  return (
    <div className="boxInfo">
      <h2 className="boxTitle">⚡ O Que Fazemos?</h2>
      <p className="textBox">Desenvolvemos jogos de palavras que desafiam a tua mente e expandem o teu vocabulário. O nosso jogo principal baseia-se no conceito simples mas poderoso de encontrar palavras ocultas dentro de outras palavras maiores.</p>

        <div className="boxInfoRow">

          <div className="boxInfoSmall">
            <h3 className="boxTitleSmall">👤 Modo Individual</h3>
            <p className="textBoxSmall">Melhora o teu recorde pessoal e desafia os teus próprios limites</p>
          </div>

          <div className="boxInfoSmall">
            <h3 className="boxTitleSmall">👥 Multijogador</h3>
            <p className="textBoxSmall">Compete contra jogadores de todo o mundo em tempo real</p>
          </div>

        </div>
    </div>
  )
}

function ANossaComunidade() {
  return (
    <div className="boxInfo">
      <h2 className="boxTitle">🫂 A Nossa Comunidade</h2>
      <p className="textBox">Somos uma comunidade crescente de amantes das palavras, desde principiantes curiosos até especialistas linguísticos. Todos são bem-vindos a juntar-se à nossa comunidade e partilhar a sua paixão pelas palavras.</p>
    </div>
  )
}

function OsNossosValores() {
  return (
    <div className="boxInfo">
      <h2 className="boxTitle">❤️ Os Nossos Valores</h2>

      <div className="boxInfoRow">
        <div className="boxInfoTrans">
          <span className="iconTitulo">🎯</span>
          <h3>Excelência</h3>
          <p className="textBoxSmallTrans">Esforçamo-nos para criar a melhor experiência de jogo possível</p>
        </div>

        <div className="boxInfoTrans">
          <span className="iconTitulo">🌟</span>
          <h3>Inovação</h3>
          <p className="textBoxSmallTrans">Procuramos constantemente novas formas de tornar a aprendizagem divertida</p>
        </div>

        <div className="boxInfoTrans">
          <span className="iconTitulo">🤝</span>
          <h3>Comunidade</h3>
          <p className="textBoxSmallTrans">Valorizamos cada membro da nossa comunidade de jogadores</p>
        </div>
      </div>
      
    </div>
  )
}

// Combinamos todo en About
function About() {
  return (
    <div>
      <SobreNos/>
      <SegundoTitulo />
      <ANossaMissao/>
      <OQueFazemos/>
      <ANossaComunidade/>
      <OsNossosValores/>
    </div>
  )
}

export default About