import { CartDao } from "../dao/repositories/cart.dao.js";
import { ProductDao } from "../dao/repositories/product.dao.js";
import { Ticket } from "../dao/models/ticket.model.js";

const cartDao = new CartDao();
const productDao = new ProductDao();

export class CartController {
  async getAll(req, res) {
    const userId = req.user._id;
    try {
      const cart = await cartDao.getAll(userId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
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
    const { products } = req.body;  
    const quantity = products?.[0]?.quantity; // 🔥 Extraer la cantidad correctamente
  
    try {
      console.log("REQ.BODY:", req.body);
      console.log("Extracted Quantity:", quantity);
  
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
  
      const cart = await cartDao.getById(id);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const product = await productDao.getById(pid);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      cart.products = cart.products || []; // Asegurar que el array existe
      console.log("Productos en el carrito:", cart.products);
  
      const productInCart = cart.products.find((p) => p._id == pid);
  
      if (productInCart) {
        productInCart.quantity += quantity;
        console.log("Nueva cantidad:", productInCart.quantity);
  
        await cartDao.update(cart._id, cart);
        return res.send({ status: "success", data: "Product added", cart });
      }
  
      cart.products.push({ _id: pid, quantity });
      await cartDao.update(cart._id, cart);
  
      res.status(201).send({ status: "success", data: "Product added", cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;
      const user = req.user;
  
      console.log("🛒 ID del carrito recibido:", cid);
  
      const cart = await cartDao.getById(cid);
  
      console.log("📦 Carrito obtenido:", cart);
  
      if (!cart || !cart.products || cart.products.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío o no existe" });
      }
  
      let total = 0;
      let products = [];
      let unAvailableProducts = [];
  
      for (let i of cart.products) {
        const product = await productDao.getById(i._id);
        if (!product) {
          unAvailableProducts.push(i._id);
          continue;
        }
  
        if (product.stock < i.quantity) { // Aquí estaba mal la condición
          unAvailableProducts.push(i._id);
          continue;
        }
  
        product.stock -= i.quantity;
        await productDao.update(i._id, { stock: product.stock });
        total += product.price * i.quantity;
        products.push({ product: product._id, quantity: i.quantity });
      }
  
      if (products.length === 0) {
        return res.status(400).json({
          message: "No hay suficiente stock para completar la compra",
        });
      }
  
      const ticket = await Ticket.create({
        amount: total,
        purchaser: user.email,
      });
  
      await cartDao.removePurchasedProducts(cid, products);
  
      res.status(201).json({
        status: "success",
        message: "Compra finalizada",
        ticket,
        unAvailableProducts,
      });
    } catch (error) {
      console.error("❌ Error en purchaseCart:", error);
      res.status(500).json({ message: error.message });
    }
  }
}  
