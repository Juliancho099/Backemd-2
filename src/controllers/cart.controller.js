import { CartDao } from "../dao/repositories/cart.dao.js";
import { ProductDao } from "../dao/repositories/product.dao.js";
import { Ticket } from "../dao/models/ticket.model.js";



const cartDao = new CartDao();
const productDao = new ProductDao();

export class CartController {
  async getAll(req, res) {
    const userId = req.user.id;
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
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).json({ message: "User not found" });
      }
      const newCart = {
        user: userId,
        products: [],
      };
      const cart = await cartDao.create(newCart);
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
    const userid = req.user.id;
    const quantity = products?.[0]?.quantity;
  
    try {
      console.log("REQ.PARAMS:", req.params);
      console.log("REQ.BODY:", req.body);
      console.log("Extracted Quantity:", quantity);
  
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

  
      const cart = await cartDao.getById(id);
      console.log("Carrito obtenido:", cart);
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const product = await productDao.getById(pid);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      cart.products = cart.products || [];
      console.log("Productos en el carrito:", cart.products);
  
      const productInCart = cart.products.find((p) => p.product.toString() === pid);
  
      if (productInCart) {
        productInCart.quantity += quantity;
        console.log("Nueva cantidad:", productInCart.quantity);
      } else {
        cart.products.push({ product: pid, quantity });
      }
  
      await cartDao.update(cart._id, cart);
  
      res.status(201).send({ status: "success", data: "Product added", cart });
  
    } catch (error) {
      console.error("❌ Error en addProduct:", error);
      res.status(500).json({ message: error.message });
    }
  }
  

  async purchaseCart(req, res) {
    try {
      const { cid } = req.params;
      const user = req.user;

      const cart = await cartDao.getById(cid);

      if (!cart || !cart.products || cart.products.length === 0) {
        return res
          .status(400)
          .json({ message: "El carrito está vacío o no existe" });
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

        if (product.stock < i.quantity) {
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
