import express from 'express';
import { createBrand, deleteBrand, getAllBrands, getSingleBrand, updateBrand } from '../controllers/brands.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const brandRoutes = express.Router();

brandRoutes.post('/', isLoggedIn, createBrand);
brandRoutes.get('/', getAllBrands);
brandRoutes.get('/:id', getSingleBrand);
brandRoutes.put('/:id', isLoggedIn, updateBrand);
brandRoutes.delete('/:id', isLoggedIn, deleteBrand);

export default brandRoutes;