import mongoose from "mongoose";

const VisitanteSchema = new mongoose.Schema({
  revendedorToken: { type: String, required: true },
  idFatura: { type: String, default: null },
  nome: { type: String, required: true },
  renavam: { type: String, required: true },
  estado: { type: String, required: true },
  adquirente: { type: String, default: null },
  ip: String,
  userAgent: String,
  navegador: String,
  dispositivo: String,
  valorGerado: { type: Number, default: 0 },
  parcelasSelecionadas: { type: [Number], default: [] },
  statusPagamento: {
    type: String,
    enum: ["não gerado", "gerado", "pago"],
    default: "não gerado", // 🔥 Opção padrão adicionada
  },
  dataAcesso: { type: Date, default: Date.now },
});

const Visitante = mongoose.model("MKVisitante", VisitanteSchema);
export default Visitante;
