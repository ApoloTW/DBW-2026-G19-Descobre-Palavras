import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import Home from "./pages/Home"
import About from "./pages/About"
import './styles/global.css'

function App() {
  return (
    <BrowserRouter>

      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      

      <Footer />

    </BrowserRouter>
  )
}

export default App