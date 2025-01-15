import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsById,
  updateProduct,
} from "../controllers/products.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProductsById);
productsRouter.post("/", createProduct);
productsRouter.put("/:id", updateProduct);
productsRouter.put("/:id", deleteProduct);

export { productsRouter };
