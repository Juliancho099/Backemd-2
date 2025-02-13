import Joi from "joi";

export const cartDto = Joi.object({
    products: Joi.array().items(Joi.object({
        quantity: Joi.number().required(),
    })).required(),
})