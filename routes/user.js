import express from "express";
import User from "../models/User.js";
import Acquirer from "../models/Acquirer.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Atualizar os dados do usuário autenticado
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Obtém o ID do usuário autenticado pelo middleware
    const { name, pixKey, acquirer, paymentPreference } = req.body;

    // Busca o usuário no banco de dados
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Atualiza os campos enviados
    if (name) user.name = name;
    if (pixKey) user.pixKey = pixKey;

    // Se o usuário quiser trocar o adquirente, verifica se ele existe
    if (acquirer) {
      const selectedAcquirer = await Acquirer.findById(acquirer);
      if (!selectedAcquirer) {
        return res.status(400).json({ error: "Adquirente inválido." });
      }
      user.acquirer = selectedAcquirer._id;
    }

    // Valida a preferência de pagamento
    if (paymentPreference) {
      if (!["pix", "acquirer"].includes(paymentPreference)) {
        return res
          .status(400)
          .json({ error: "Preferência de pagamento inválida." });
      }

      // Se o usuário quiser receber via adquirente, ele precisa ter um adquirente cadastrado
      if (paymentPreference === "acquirer" && !user.acquirer) {
        return res
          .status(400)
          .json({ error: "Para usar um adquirente, você deve selecionar um." });
      }

      user.paymentPreference = paymentPreference;
    }

    await user.save();

    res.json({ message: "Usuário atualizado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
