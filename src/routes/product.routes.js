 import {Router} from 'express';
import {ProductController} from '../controllers/product.controller.js';
import { isAdmin } from '../middlewares/validateRole.js';
import { validate } from '../middlewares/validate.js';
import { productDto } from '../dto/product.dto.js';

export const productRouter = Router();
const productController = new ProductController();

productRouter.get('/', productController.getAll);
productRouter.get('/:pid', productController.getById);
productRouter.post('/',validate(productDto), isAdmin, productController.create);
productRouter.put('/:pid', isAdmin, productController.update);
productRouter.delete('/:pid', isAdmin, productController.delete);
