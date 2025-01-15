import {CartModel} from '../models/carts.js';
import {ProductModel} from '../models/products.js';

export const getCarts = async (req, res) => {
    try {
        const carts = await CartModel.find();
        res.status(200).json(carts);
    } catch (error) {
        throw error;
    }
}

export const getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await CartModel.findById(id);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        throw error;
    }
}

export const createCart = async (req, res) => {
    try {
        const cart = await CartModel.create({products: []});
        res.status(201).json(cart);
    } catch (error) {
        throw error;
    }
}

export const addProductToCart = async (req, res) => {
    try {
        const { cid,pid } = req.params;
        const { quantity } = req.body;
        const cart = await CartModel.findById(cid).lean();
        if (!cart) { 
            throw new Error('El carrito no existe'); 
        }

        
        const product = await ProductModel.findById(pid).lean

        if (!product) {
            throw new Error('El producto no existe');
        }

        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a 0');
        }

        const productInCart = cart.products.find(p => p.productId == pid);

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({productId: pid, quantity});
        }

        const updatedCart = await CartModel.findByIdAndUpdate(cid, cart, { new: true });
        res.status(200).json(updatedCart);

    } catch (error) {
        throw error;
    }
}

