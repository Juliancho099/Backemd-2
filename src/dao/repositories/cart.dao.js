import { CartModel } from '../models/cart.model.js';

export class CartDao {
  async getAll(userId) {
    return await CartModel.find({ user: userId }).populate("products.product");
}

  

    async getById(id){
        return await CartModel.findById(id).populate("products.product");
    }

    async getByUserId(userId) {
      return await CartModel.findOne({ user: userId }).populate("products.product");
    }
    

    async create(cart){
        return await CartModel.create(cart);
    }

    async update(id, cart){
        return await CartModel.findByIdAndUpdate(id, cart, {new: true});
    }

    async delete(id){
        return await CartModel.findByIdAndDelete(id);
    }

    async removePurchasedProducts(cartId, purchasedProducts) {
      try {
          console.log("🔹 Eliminando productos comprados del carrito:", cartId, purchasedProducts);
  
          const cart = await CartModel.findById(cartId);
          if (!cart) {
              throw new Error("Carrito no encontrado");
          }
          cart.products = cart.products.filter(product => 
              purchasedProducts.some(purchased => purchased.product.toString() !== product.product.toString())
          );

  
          await cart.save();
          return cart;
      } catch (error) {
          console.error("❌ Error en removePurchasedProducts:", error);
          throw new Error("Error al eliminar productos comprados del carrito");
      }
  }
  
  
  
      
}