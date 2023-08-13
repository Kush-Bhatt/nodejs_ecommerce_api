import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/categories.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const categoryRoutes = express.Router();

categoryRoutes.post('/', isLoggedIn, createCategory);
categoryRoutes.get('/', getAllCategories);
categoryRoutes.get('/:id', getSingleCategory);
categoryRoutes.put('/:id', isLoggedIn, updateCategory);
categoryRoutes.delete('/:id', isLoggedIn, deleteCategory);

export default categoryRoutes;