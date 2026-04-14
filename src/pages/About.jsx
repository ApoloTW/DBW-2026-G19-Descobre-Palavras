import { Link } from "react-router-dom"
import { useState } from 'react';
import '../styles/about.css'

function TrocarVerde() {
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
    <button onClick={TrocarVerde}>
      Tema Verde
    </button>
  )
}

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

// Combinamos todo en About
function About() {
  return (
    <div>
      <Verde />          {/* botón para cambiar tema */}
      <Titulo />
      <SegundoTitulo />
    </div>
  )
}

export default About