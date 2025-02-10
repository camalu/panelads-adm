import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Rota de login do usuário
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gera o token JWT com mais informações do usuário
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        pixKey: user.pixKey,
        acquirer: user.acquirer, // Pode ser `null` se o usuário não tiver um adquirente associado
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
