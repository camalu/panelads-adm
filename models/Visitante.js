import mongoose from "mongoose";

const VisitanteSchema = new mongoose.Schema({
  revendedorToken: { type: String, required: true }, // 🔥 Identifica o revendedor
  idFatura: { type: String, default: null }, // 🔥 Agora é opcional
  nome: { type: String, required: true }, // 🔥 Nome do visitante (obrigatório)
  renavam: { type: String, required: true }, // 🔥 Agora é obrigatório
  estado: { type: String, required: true }, // 🔥 Agora é obrigatório
  adquirente: { type: String, default: null }, // 🔥 Agora é opcional
  ip: String,
  userAgent: String,
  navegador: String,
  dispositivo: String,
  valorGerado: { type: Number, default: 0 }, // 🔥 Agora é opcional
  parcelasSelecionadas: { type: [Number], default: [] }, // 🔥 Agora é opcional
  statusPagamento: {
    type: String,
    enum: ["não gerado", "gerado", "pago"],
    default: "não gerado", // 🔥 Opção padrão adicionada
  },
  dataAcesso: { type: Date, default: Date.now },
});

const Visitante = mongoose.model("MKVisitante", VisitanteSchema);
export default Visitante;
