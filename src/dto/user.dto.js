import joi from 'joi';

export const userDto = joi.object({
    first_name: joi.string().min(4).max(30).required(),
    last_name: joi.string().min(4).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(30).required(),
    role: joi.string().valid('admin', 'user').required(),
    age: joi.number().integer().min(18).max(100).required()
});