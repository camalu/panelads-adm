import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import loginRoutes from "./routes/login.js";
import registerRoutes from "./routes/register.js";
import dashboardRoutes from "./routes/dashboard.js";
import visitantesRoutes from "./routes/visitantes.js";
import authMiddleware from "./middlewares/authMiddleware.js"; // 🔥 Importando middleware

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

app.use("/api", loginRoutes);
app.use("/api", registerRoutes);
app.use("/api", authMiddleware, dashboardRoutes);
app.use("/api", visitantesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
