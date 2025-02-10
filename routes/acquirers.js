import express from "express";
import Acquirer from "../models/Acquirer.js";

const router = express.Router();

// Rota para criar um novo adquirente
router.post("/", async (req, res) => {
  try {
    const { name, secretKey, publicKey, token, tax } = req.body;

    // Validação: Nome e taxa são obrigatórios
    if (!name || tax === undefined) {
      return res.status(400).json({ error: "Nome e taxa são obrigatórios." });
    }

    // Verifica se a taxa é um número válido
    if (isNaN(parseFloat(tax))) {
      return res
        .status(400)
        .json({ error: "A taxa deve ser um número decimal válido." });
    }

    const newAcquirer = new Acquirer({
      name,
      secretKey: secretKey || null,
      publicKey: publicKey || null,
      token: token || null, // Token opcional
      tax: parseFloat(tax), // Converte para decimal
    });

    await newAcquirer.save();

    res.json({
      message: "Adquirente cadastrada com sucesso!",
      acquirer: newAcquirer,
    });
  } catch (error) {
    console.error("Erro ao cadastrar adquirente:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
