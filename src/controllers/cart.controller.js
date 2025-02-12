import { CartDao } from "../dao/repositories/cart.dao.mjs";
import { ProductDao } from "../dao/repositories/product.dao.js";

const cartDao = new CartDao();
const productDao = new ProductDao();

export class CartController {
  async getAll(req, res) {
    const userId = req.user._id;
    try {
      const cart = await cartDao.getAll(userId);
      res.send({ status: "success", data: cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req, res) {
    const { id } = req.params;
    try {
      const cart = await cartDao.getById(id);
      res.send({ status: "success", data: cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async create(req, res) {
    const userId = req.user._id;
    try {
      const cart = await cartDao.create({ userId, products: [] });
      res.send({ status: "success", data: cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    try {
      const cart = await cartDao.update(id, data);
      res.send({ status: "success", data: cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      await cartDao.delete(id);
      res.send({ status: "success", data: "Cart deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addProduct(req, res) {
    const { id, pid } = req.params;
    const { quantity } = req.body;
    try {
      const cart = await cartDao.getById(id);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const product = await productDao.getById(pid);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const productInCart = cart.products.find((p) => p._id == pid);

      if (productInCart) {
        productInCart.quantity += quantity;
        await cartDao.update(cart._id, cart);
        return res.send({ status: "success", data: "Product added" });
      }

      cart.products.push({ _id: pid, quantity });
      await cartDao.update(cart._id, cart);
      res.send({ status: "success", data: "Product added" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
