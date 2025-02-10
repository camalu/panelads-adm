import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gerar token JWT com mais informações do usuário
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        pixKey: user.pixKey,
        acquirer: user.acquirer, // Pode ser `null` se o usuário não tiver um adquirente
        paymentPreference: user.paymentPreference, // 🔥 Adicionando a preferência de pagamento ao token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
