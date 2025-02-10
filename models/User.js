import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nome do usuário obrigatório
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pixKey: { type: String, required: true }, // Chave PIX obrigatória
    acquirer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Acquirer",
      default: null,
    }, // Adquirente vinculado (opcional)
    paymentPreference: {
      type: String,
      enum: ["pix", "acquirer"],
      required: true,
      default: "pix",
    }, // Preferência de recebimento
  },
  { timestamps: true }
);

const User = mongoose.model("MKUser", UserSchema);
export default User;
