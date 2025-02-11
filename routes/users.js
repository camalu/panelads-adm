import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Busca todos os usuários, excluindo a senha
    const users = await User.find().select("-password");

    res.json({ users });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o usuário pelo ID, excluindo a senha do retorno
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
