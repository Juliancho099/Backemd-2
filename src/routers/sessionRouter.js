import { Router } from "express";
import passport from "passport";
import { login, register } from "../controllers/authController.js";

const sessionRouter = Router();

sessionRouter.post('/login', passport.authenticate('login', {session: false}) ,login)
sessionRouter.post('/register',passport.authenticate('register', {session: false}), register)

export { sessionRouter };