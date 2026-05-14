import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  mainWord: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },

  validWords: {
    type: [String],
    required: true
  }

}, {
  timestamps: true
});

export default mongoose.model("Word", wordSchema);