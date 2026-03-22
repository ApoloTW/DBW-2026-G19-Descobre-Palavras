import { Link } from "react-router-dom"
import { useState } from 'react';


function ChangeToGreen() {
    document.documentElement.style.setProperty(
      '--bg-gradient',
      'radial-gradient(circle at center, #16a34a 0%, #14532d 40%, #052e16 100%)',
    );
    document.documentElement.style.setProperty(
      '--card-bg',
      '#5c9d1f'
    );

    document.documentElement.style.setProperty(
    '--accent',
    '#5c9d1f'
    );

    document.documentElement.style.setProperty(
      '--button-bg',
      '#5c9d1f'
    );

    document.documentElement.style.setProperty(
      '--button-primary',
      '#5c9d1f'
    );

    document.documentElement.style.setProperty(
      '--button-primary-hover',
      '#14532d'
    );
}

function Verde() {
  return (
    <button onClick={ChangeToGreen}>
      Tema Verde
    </button>
  )
}

function Perfil() {
    return (
        <Verde />
    )
}