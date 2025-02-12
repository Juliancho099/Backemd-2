import { UserDao } from "../dao/repositories/user.dao.js";

const userDao = new UserDao();

export class UserController {
    async getAll(req, res){
        try {
            const users = await userDao.getAll();
            res.send({status: "success", data: users});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async getById(req, res){
        const {uid} = req.params;
        try {
            const user = await userDao.getById(uid);
            res.send({status: "success", data: user});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async getByEmail(req, res){
        const {email} = req.params;
        try {
            const user = await userDao.getByEmail(email);
            res.send({status: "success", data: user});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async create(req, res){
        const user = req.body;
        try {
            const newUser = await userDao.create(user);
            res.send({status: "success", data: newUser});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async update(req, res){
        const {uid} = req.params;
        const user = req.body;
        try {
            const updatedUser = await userDao.update(uid, user);
            res.send({status: "success", data: updatedUser});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async delete(req, res){
        const {uid} = req.params;
        try {
            await userDao.delete(uid);
            res.send({status: "success", message: "User deleted"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}