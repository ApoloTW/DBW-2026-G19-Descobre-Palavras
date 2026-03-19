import '../styles/about.css'

function Titulo() {
  return (
    <div className="titulo">
      <h1>Sobre Nós</h1>
    </div>
  )
}

function SegundoTitulo() {
  return (
    <div className="segundoTitulo">
      <h2>Descobre quem somos e o que nos inspira</h2>
    </div>
  )
}

function About() {
  return (
    <div>
      <Titulo />
      <SegundoTitulo />
    </div>
  )
}

export default About