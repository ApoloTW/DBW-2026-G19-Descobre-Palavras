import '../styles/singleplayer.css'
import { Link } from "react-router-dom"
import { useState } from 'react';

function ModoIndividual() {
    return (
        <div>
          <h1>Modo Individual</h1>
        </div>
    )
}

function SinglePlayer() {
  return (
    <div>
      <ModoIndividual/>
    </div>
  )
}

export default SinglePlayer