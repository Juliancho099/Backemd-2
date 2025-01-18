import { Router } from "express";
import { User } from "../models/userModels.js";

const userRouter= Router();

userRouter.get('/', async (req, res )=>{
    try {
        const user = req.user;
        if(!user) return res.status(404).json({message: 'User not found'});

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
    }
})

export {userRouter}