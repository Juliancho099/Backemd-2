import { ProductDao } from "../dao/repositories/product.dao.js";

const productDao = new ProductDao();
export class ProductController { 

    async getAll(req, res){
        let { limit, page, sort} = req.query;

        try {
            const products = await productDao.getAll(limit, page, sort);
            res.send({status: "success", data: products});
        } catch (error) {
            res.status(500).json({message: error.message});

        }
    }

    async getById(req, res){
        const {pid} = req.params;
        try {
            const product = await productDao.getById(pid);
            res.send({status: "success", data: product});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async create(req, res){
        const product = req.body;
        try {
            const newProduct = await productDao.create(product);
            res.send({status: "success", data: newProduct});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async update(req, res){
        const {pid} = req.params;
        const product = req.body;
        try {
            const updatedProduct = await productDao.update(pid, product);
            res.send({status: "success", data: updatedProduct});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async delete(req, res){
        const {pid} = req.params;
        try {
            await productDao.delete(pid);
            res.send({status: "success", message: "Product deleted"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    

}