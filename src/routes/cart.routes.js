import { Router } from "express";

import { CartController } from "../controllers/cart.controller.js";
import { isUser } from "../middlewares/validateRole.js";
import { validate } from "../middlewares/validate.js";
import { cartDto } from "../dto/cart.dto.js";

export const cartRouter = Router();
const cartController = new CartController();

cartRouter.get("/", cartController.getAll);
cartRouter.get("/:cid", cartController.getById);
cartRouter.post("/", cartController.create);
cartRouter.post("/:cid/product/:pid", validate(cartDto), isUser, cartController.addProduct)
cartRouter.put("/:cid", cartController.update);
cartRouter.delete("/:cid", cartController.delete);
cartRouter.post("/purchase/:cid", isUser, cartController.purchaseCart);
