import mongoose from "mongoose";

const statsSchema = {
  score: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  correctWords: {
    type: Number,
    default: 0
  },
  wrongWords: {
    type: Number,
    default: 0
  },
  totalTime: {
    type: Number,
    default: 0
  }
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
    default: "avatar1"
  },

  background: {
    type: String,
    default: "fundoAzul"
  },

  stats: {
    today: {
      type: statsSchema,
      default: () => ({})
    },

    weekly: {
      type: statsSchema,
      default: () => ({})
    },

    monthly: {
      type: statsSchema,
      default: () => ({})
    },

    total: {
      type: statsSchema,
      default: () => ({})
    }
  },

  personalRecord: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);