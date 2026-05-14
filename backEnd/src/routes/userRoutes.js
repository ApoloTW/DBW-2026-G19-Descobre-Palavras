import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const allowedAvatars = [
  "avatar1",
  "avatar2",
  "avatar3",
  "avatar4",
  "avatar5",
  "avatar6"
];

const allowedBackgrounds = [
  "fundoAzul",
  "fundoVermelho",
  "fundoPurpura",
  "fundoVerde"
];

function userResponse(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    background: user.background,
    stats: user.stats,
    personalRecord: user.personalRecord
  };
}

router.get("/me", protect, (req, res) => {
  res.json({
    user: userResponse(req.user)
  });
});

router.patch("/profile", protect, async (req, res) => {
  try {
    const { username, avatar, background } = req.body;

    const updates = {};

    if (username !== undefined) {
      const cleanUsername = username.trim();

      if (!cleanUsername) {
        return res.status(400).json({
          message: "O nome de utilizador não pode estar vazio"
        });
      }

      const usernameExists = await User.findOne({
        username: cleanUsername,
        _id: { $ne: req.user._id }
      });

      if (usernameExists) {
        return res.status(400).json({
          message: "Esse nome de utilizador já existe"
        });
      }

      updates.username = cleanUsername;
    }

    if (avatar !== undefined) {
      if (!allowedAvatars.includes(avatar)) {
        return res.status(400).json({
          message: "Avatar inválido"
        });
      }

      updates.avatar = avatar;
    }

    if (background !== undefined) {
      if (!allowedBackgrounds.includes(background)) {
        return res.status(400).json({
          message: "Fundo inválido"
        });
      }

      updates.background = background;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.json({
      message: "Perfil atualizado com sucesso",
      user: userResponse(updatedUser)
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar perfil",
      error: error.message
    });
  }
});

router.patch("/stats", protect, async (req, res) => {
  try {
    const {
      score = 0,
      gamesPlayed = 1,
      correctWords = 0,
      wrongWords = 0,
      totalTime = 0
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "Utilizador não encontrado"
      });
    }

    user.stats.today.score += score;
    user.stats.today.gamesPlayed += gamesPlayed;
    user.stats.today.correctWords += correctWords;
    user.stats.today.wrongWords += wrongWords;
    user.stats.today.totalTime += totalTime;

    user.stats.weekly.score += score;
    user.stats.weekly.gamesPlayed += gamesPlayed;
    user.stats.weekly.correctWords += correctWords;
    user.stats.weekly.wrongWords += wrongWords;
    user.stats.weekly.totalTime += totalTime;

    user.stats.monthly.score += score;
    user.stats.monthly.gamesPlayed += gamesPlayed;
    user.stats.monthly.correctWords += correctWords;
    user.stats.monthly.wrongWords += wrongWords;
    user.stats.monthly.totalTime += totalTime;

    user.stats.total.score += score;
    user.stats.total.gamesPlayed += gamesPlayed;
    user.stats.total.correctWords += correctWords;
    user.stats.total.wrongWords += wrongWords;
    user.stats.total.totalTime += totalTime;

    if (score > user.personalRecord) {
      user.personalRecord = score;
    }

    await user.save();

    res.json({
      message: "Estatísticas atualizadas com sucesso",
      user: userResponse(user)
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao atualizar estatísticas",
      error: error.message
    });
  }
});

router.get("/ranking", async (req, res) => {
  try {
    const period = req.query.period || "semanal";

    let scoreField = "stats.weekly.score";

    if (period === "mensal") {
      scoreField = "stats.monthly.score";
    }

    const users = await User.find({})
      .select("username avatar background stats personalRecord")
      .sort({ [scoreField]: -1 })
      .limit(10);

    const ranking = users.map((user, index) => {
      const stats = period === "mensal"
        ? user.stats.monthly
        : user.stats.weekly;

      return {
        position: index + 1,
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        background: user.background,
        score: stats.score,
        gamesPlayed: stats.gamesPlayed,
        correctWords: stats.correctWords,
        wrongWords: stats.wrongWords,
        totalTime: stats.totalTime,
        personalRecord: user.personalRecord
      };
    });

    res.json({
      period,
      ranking
    });

  } catch (error) {
    res.status(500).json({
      message: "Erro ao carregar ranking",
      error: error.message
    });
  }
});

export default router;