import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Gera um UUID único

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: { type: String, default: uuidv4 }, // Token único para cada revendedor
});

const User = mongoose.model("MKUser", UserSchema);

export default User;
