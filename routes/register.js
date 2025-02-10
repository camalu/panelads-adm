import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Acquirer from "../models/Acquirer.js";

const router = express.Router();

// Rota de cadastro de usuário
router.post("/", async (req, res) => {
  try {
    const { name, email, password, pixKey, acquirer, paymentPreference } =
      req.body;

    // Verifica se os campos obrigatórios foram preenchidos
    if (!name || !email || !password || !pixKey) {
      return res
        .status(400)
        .json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // Verifica se o email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já cadastrado." });
    }

    // Verifica se o adquirente existe (caso tenha sido enviado)
    let selectedAcquirer = null;
    if (acquirer) {
      selectedAcquirer = await Acquirer.findById(acquirer);
      if (!selectedAcquirer) {
        return res.status(400).json({ error: "Adquirente inválido." });
      }
    }

    // Valida a preferência de pagamento
    if (paymentPreference && !["pix", "acquirer"].includes(paymentPreference)) {
      return res
        .status(400)
        .json({ error: "Preferência de pagamento inválida." });
    }

    // Se a preferência for "acquirer" e o usuário não tiver um adquirente, retorna erro
    if (paymentPreference === "acquirer" && !selectedAcquirer) {
      return res
        .status(400)
        .json({ error: "Para usar um adquirente, você deve selecionar um." });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pixKey,
      acquirer: selectedAcquirer ? selectedAcquirer._id : null,
      paymentPreference: paymentPreference || "pix", // Define o padrão como "pix"
    });

    await newUser.save();

    res.json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
