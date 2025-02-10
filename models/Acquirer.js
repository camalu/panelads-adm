import mongoose from "mongoose";

const AcquirerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nome do adquirente (obrigatório)
    secretKey: { type: String, default: null }, // Chave secreta (opcional)
    publicKey: { type: String, default: null }, // Chave pública (opcional)
    token: { type: String, default: null }, // Token a ser cadastrado na adquirente (opcional)
    tax: { type: mongoose.Types.Decimal128, required: true }, // Taxa do adquirente (decimal e obrigatória)
  },
  { timestamps: true }
);

const Acquirer = mongoose.model("MKAcquirer", AcquirerSchema);
export default Acquirer;
