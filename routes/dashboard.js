import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Visitante from "../models/Visitante.js";

const router = express.Router();

// Rota do dashboard para calcular valores dinâmicos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Obtendo o ID do usuário autenticado

    // Filtra apenas os visitantes relacionados ao usuário logado
    const visitantes = await Visitante.find({ revendedorToken: userId });

    // Contagem de pedidos e pagamentos
    const pedidos = visitantes.filter(
      (v) => v.statusPagamento === "gerado"
    ).length;
    const pagamentos = visitantes.filter(
      (v) => v.statusPagamento === "pago"
    ).length;

    // Cálculo dos valores financeiros
    const totalVendas = visitantes
      .filter((v) => v.statusPagamento === "pago")
      .reduce((acc, v) => acc + (v.valorGerado || 0), 0);

    const totalPendentes = visitantes
      .filter((v) => v.statusPagamento === "gerado")
      .reduce((acc, v) => acc + (v.valorGerado || 0), 0);

    const totalGerados = visitantes.reduce(
      (acc, v) => acc + (v.valorGerado || 0),
      0
    );

    // Calculando o rate de conversão de pagamentos
    const rate =
      pedidos > 0 ? ((pagamentos / pedidos) * 100).toFixed(2) : "0.00";

    res.json({
      pedidos,
      pagamentos,
      totalVendas: parseFloat(totalVendas.toFixed(2)), // Formata como decimal
      totalPendentes: parseFloat(totalPendentes.toFixed(2)), // Formata como decimal
      totalGerados: parseFloat(totalGerados.toFixed(2)), // Formata como decimal
      rate: `${rate}%`, // Rate formatado com símbolo de porcentagem
    });
  } catch (error) {
    console.error("Erro ao calcular dados do dashboard:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

export default router;
