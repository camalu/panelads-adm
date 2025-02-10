import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Importação das rotas
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import dashboardRoutes from "./routes/dashboard.js";
import visitantesRoutes from "./routes/visitantes.js";
import userRoutes from "./routes/user.js"; // Nova rota de atualização de usuário
import acquirersRoutes from "./routes/acquirers.js"; // Nova rota de adquirentes

// Middleware de autenticação
import authMiddleware from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => {
    console.error("❌ Erro ao conectar no MongoDB Atlas:", err);
    process.exit(1); // Para evitar que a API continue rodando sem banco de dados
  });

// Definição das rotas da API
app.use("/api/login", loginRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/visitantes", authMiddleware, visitantesRoutes);
app.use("/api/user", authMiddleware, userRoutes); // Nova rota para atualizar usuário
app.use("/api/acquirers", acquirersRoutes); // Nova rota para gerenciar adquirentes

// Configuração da porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
