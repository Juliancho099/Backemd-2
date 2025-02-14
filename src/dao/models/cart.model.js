import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ]
},{
    timestamps: true
});

cartSchema.pre(['find', 'findOne', 'findById'], function () {
    this.populate('products.product');
});
export const CartModel= mongoose.model('carts', cartSchema);