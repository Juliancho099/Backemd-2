import Joi from "joi";

export const productDto = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(100).required(),
    code: Joi.string().min(3).max(30).required(),
    price: Joi.number().required(),
    status: Joi.boolean().required(),
    stock: Joi.number().required(),
    category: Joi.string().min(4).max(30).required(),
    thumbnail: Joi.array().items(Joi.string()),
})