import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import About from "./pages/About"

import Play from "./pages/Play"
import SinglePlayer from "./pages/SinglePlayer"
import MultiPlayer from "./pages/MultiPlayer"
import Perfil from "./pages/Perfil"
import Ranking from "./pages/Ranking"

import './styles/global.css'

function ProtectedRoute({ usuario, children }) {
  if (!usuario) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  const [usuario, setUsuario] = useState(null)
  const [fundoAtual, setFundoAtual] = useState("fundoAzul");

  return (
    <BrowserRouter>
      <div className={`app ${fundoAtual}`}>
        <Navbar usuario={usuario} setUsuario={setUsuario} />

        <main className="content">
          <Routes>
            <Route path="/" element={<Home usuario={usuario} />} />
            <Route path="/login" element={<Login setUsuario={setUsuario} />} />
            <Route path="/register" element={<Register setUsuario={setUsuario} />} />
            <Route path="/about" element={<About />} />

            <Route
              path="/play"
              element={
                <ProtectedRoute usuario={usuario}>
                <Play usuario={usuario} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/singleplayer"
              element={
                <ProtectedRoute usuario={usuario}>
                <SinglePlayer usuario={usuario} />
                </ProtectedRoute>
            }
            />

            <Route
              path="/multiplayer"
              element={
                <ProtectedRoute usuario={usuario}>
                <MultiPlayer usuario={usuario} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute usuario={usuario}>
                <Perfil usuario={usuario} setFundoAtual={setFundoAtual} />
                </ProtectedRoute>
              }
            />

            <Route path="/ranking" element={<Ranking usuario={usuario} />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App