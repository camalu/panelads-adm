import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Visitante from "../models/Visitante.js";

const router = express.Router();

// Rota do dashboard para calcular valores dinâmicos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const revendedorToken = req.user.userId; // Obtém o token do usuário autenticado

    // Filtra apenas os visitantes do revendedor logado
    const visitantes = await Visitante.find({ revendedorToken });

    // Calcula os valores dinâmicos
    const pedidos = visitantes.filter(
      (v) => v.statusPagamento === "gerado"
    ).length;
    const pagamentos = visitantes.filter(
      (v) => v.statusPagamento === "pago"
    ).length;
    const totalVendas = visitantes.reduce(
      (acc, v) => acc + (v.valorGerado || 0),
      0
    );

    res.json({
      pedidos,
      pagamentos,
      totalVendas: parseFloat(totalVendas.toFixed(2)), // Formata como decimal
    });
  } catch (error) {
    console.error("Erro ao calcular dados do dashboard:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
