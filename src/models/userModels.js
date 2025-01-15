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
  },
  age: {
    type: Number,
    required: true,
  },
  cartId:{
    type: Schema.Types.ObjectId,
    ref: 'carts',
    default: null
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', function(next){
  const user = this;

  //validate email

  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const emailIsValid = emailRegex.test(user.email);

  if(!emailIsValid){
    return next(new Error('Invalid email'));
  }

  next();
})

userSchema.pre('save', async function(next){
  const user = this;

  if(!user.isModified('password')) return next();

  //hash password
  const hashedPassword = await hashPassword(user.password);
  user.password = hashedPassword;

  next();
})

const User = model("User", userSchema)

export { User };