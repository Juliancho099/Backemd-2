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
}