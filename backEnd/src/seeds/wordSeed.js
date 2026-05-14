import mongoose from "mongoose";
import dotenv from "dotenv";
import Word from "../models/Word.js";

dotenv.config()

const palabras = [
  { mainWord: "ARMARIO",  validWords: ["ARMA", "RIO", "MAR", "MARIO"] },
  { mainWord: "PLANETA",  validWords: ["PLAN", "ANTE", "LANA", "NETA", "PALA", "TELA"] },
  { mainWord: "CASTILLO", validWords: ["TILO", "LISO", "CAST", "SAIL", "COLA", "CALLO"] },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB conectado")

    await Word.deleteMany({})
    console.log("Palabras anteriores eliminadas")

    await Word.insertMany(palabras)
    console.log(`${palabras.length} palabras insertadas`)

    await mongoose.disconnect()
    console.log("Listo")

  } catch (error) {
    console.error("Error:", error.message)
    process.exit(1)
  }
}

seed()