import { Router } from "express";

import { CartController } from "../controllers/cart.controller.js";
import { isUser } from "../middlewares/validateRole.js";

export const cartRouter = Router();
const cartController = new CartController();

cartRouter.get("/", cartController.getAll);
cartRouter.get("/:id", cartController.getById);
cartRouter.post("/", cartController.create);
cartRouter.post("/:id/product/:pid", isUser, cartController.addProduct)
cartRouter.put("/:id", cartController.update);
cartRouter.delete("/:id", cartController.delete);
