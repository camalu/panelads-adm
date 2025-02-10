import express from "express";
import Visitante from "../models/Visitante.js";

const router = express.Router();

router.post("/visitantes", async (req, res) => {
  try {
    const {
      revendedorToken, // 🔥 Agora é enviado no corpo da requisição
      idFatura = null, // 🔥 Valor opcional
      nome, // 🔥 Nome do visitante (obrigatório)
      renavam, // 🔥 Agora é obrigatório
      estado, // 🔥 Agora é obrigatório
      adquirente = null, // 🔥 Agora é opcional
      valorGerado = 0, // 🔥 Valor opcional
      parcelasSelecionadas = [], // 🔥 Valor opcional
      statusPagamento = "não gerado", // 🔥 Valor padrão
      userAgent: userAgentBody,
      ip: ipBody,
      dispositivo: dispositivoBody,
      navegador: navegadorBody,
    } = req.body;

    // 🔥 Verifica se os campos obrigatórios foram enviados
    if (!revendedorToken || !nome || !renavam || !estado) {
      return res
        .status(400)
        .json({
          error:
            "Os campos revendedorToken, nome, renavam e estado são obrigatórios",
        });
    }

    // 🔥 Se os dados do navegador não forem enviados, usamos os valores padrões
    const userAgent = userAgentBody || req.headers["user-agent"];
    const ip =
      ipBody || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const navegador =
      navegadorBody || (userAgent ? userAgent.split(" ")[0] : "Desconhecido");
    const dispositivo =
      dispositivoBody || (/mobile/i.test(userAgent) ? "Mobile" : "Desktop");

    // 🔥 Criação do visitante no banco de dados
    const novoVisitante = new Visitante({
      revendedorToken, // 🔥 Vincula ao revendedor recebido no corpo
      idFatura,
      nome,
      renavam,
      estado, // 🔥 Agora é obrigatório
      adquirente, // 🔥 Agora é opcional
      ip,
      userAgent,
      navegador,
      dispositivo,
      valorGerado,
      parcelasSelecionadas,
      statusPagamento,
    });

    await novoVisitante.save();
    res.status(201).json({ message: "Visitante cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar visitante" });
  }
});

export default router;
