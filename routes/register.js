import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Verifica se o email já existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  // Hash da senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criação do usuário
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.json({ message: "Usuário cadastrado com sucesso!" });
});

export default router;
