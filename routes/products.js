import express from 'express';
import {createProduct, getProducts, getSingleProduct, updateProduct, deleteProduct, deleteProductsByCategory} from '../controllers/products.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRoutes = express.Router();

productRoutes.post('/', isLoggedIn, createProduct);
productRoutes.get('/', getProducts);
productRoutes.get('/:id', getSingleProduct);
productRoutes.put('/:id', isLoggedIn, updateProduct);
productRoutes.delete('/:id', isLoggedIn, deleteProduct);
productRoutes.delete('/bycategory/:id', isLoggedIn, deleteProductsByCategory);

export default productRoutes;