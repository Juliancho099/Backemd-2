// modulos importados
import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";

// importando modulos de configuracion
import { initializePassport } from "./config/passport.js";
import { connectDb } from "./config/db.js";
import { CONFIG } from "./config/config.js"
import { authRouter } from "./routes/sessions.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(express.static("public"));

//routes

app.use("/api/auth", authRouter);
app.use("/api/products", passport.authenticate("jwt", {session:false}), productRouter);
app.use("/api/carts", passport.authenticate("jwt", {session:false}), cartRouter);
app.use("/api/current", passport.authenticate("jwt", {session:false}), async (req, res) => {
  try {
    const user = req.user;
    if(!user) return res.status(404).json({message: 'User not found'});

    res.status(200).json(user);
} catch (error) {
    console.error(error);
}
});

app.listen(CONFIG.PORT, () => {
    console.log(`Server running on port ${CONFIG.PORT}`);
  });
  
  // Connect to DB
  
  connectDb(CONFIG.DB_URI, CONFIG.DB_NAME);