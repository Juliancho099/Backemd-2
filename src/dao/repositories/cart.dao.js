import { CartModel } from '../models/cart.model.js';

export class CartDao {
    async getAll (id){
        const cart = await CartModel.find({id});
        return cart;
    }

    async getById(id){
        return await CartModel.findById(id);
    }

    async getByUserId(userId){
        return await CartModel.findOne({userId});
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

    async removePurchasedProducts(cartId, products) {
        console.log("🛒 Eliminando productos comprados del carrito...");
        console.log("📌 ID del carrito:", cartId);
        console.log("📌 Productos a eliminar:", products);
      
        try {
          // Verifica que el carrito exista
          const cart = await CartModel.findById(cartId);
          if (!cart) {
            throw new Error("Carrito no encontrado");
          }
      
          // Filtra los productos comprados y elimina solo esos
          cart.products = cart.products.filter(p => 
            !products.some(purchased => purchased.product.toString() === p._id.toString())
          );
      
          console.log("✅ Productos restantes en el carrito:", cart.products);
          
          await cart.save();
          return cart;
        } catch (error) {
          console.error("❌ Error en removePurchasedProducts:", error);
          throw new Error("Error al eliminar productos comprados del carrito");
        }
      }
      
}