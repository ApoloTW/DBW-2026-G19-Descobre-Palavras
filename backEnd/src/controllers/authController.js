import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Preenche todos os campos"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Email inválido"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "A palavra-passe deve ter pelo menos 6 caracteres"
      });
    }

    const userExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.trim() }
      ]
    });

    if (userExists) {
      return res.status(400).json({
        message: "Email ou nome de utilizador já existe"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "Conta criada com sucesso",
      token,
      user: userResponse(user)
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar conta",
      error: error.message
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Preenche o email e a palavra-passe"
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Credenciais inválidas"
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Credenciais inválidas"
      });
    }

    const token = createToken(user._id);

    return res.json({
      message: "Login feito com sucesso",
      token,
      user: userResponse(user)
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao iniciar sessão",
      error: error.message
    });
  }
}