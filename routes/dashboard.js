import express from "express";
import Dashboard from "../models/Dashboard.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const dashboardData = (await Dashboard.findOne()) || {
      pedidos: 0,
      pagamentos: 0,
      totalVendas: 0,
    };

    res.json({
      pedidos: dashboardData.pedidos,
      pagamentos: dashboardData.pagamentos,
      totalVendas: dashboardData.totalVendas,
      usuarioToken: user.token,
      email: user.email,
      nome: user.nome || "Usuário sem nome",
    });
  } catch (err) {
    console.error("Erro ao buscar dados do dashboard:", err);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard." });
  }
});

export default router;
