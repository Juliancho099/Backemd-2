import { model, Schema } from "mongoose";
import { hashPassword } from "../utils/passworUtils.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // Asegura que el email esté en minúsculas
    trim: true,       // Elimina espacios innecesarios
  },
  age: {
    type: Number,
    required: true,
  },
  carts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'carts',
    },
  ],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware para validaciones y hash de contraseña
userSchema.pre("save", async function (next) {
  const user = this;

  // Validación de correo electrónico mejorada
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return next(new Error("Invalid email format"));
  }

  // Si la contraseña no ha sido modificada, continuar
  if (!user.isModified("password")) return next();

  try {
    // Hashear la contraseña antes de guardarla
    user.password = await hashPassword(user.password);
    next();
  } catch (error) {
    next(error);
  }
});

const User = model("User", userSchema);

export { User };
