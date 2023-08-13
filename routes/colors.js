import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createColor, deleteColor, getAllColors, getSingleColor, updateColor } from '../controllers/colors.js';

const colorRoutes = express.Router();

colorRoutes.post('/', isLoggedIn, createColor);
colorRoutes.get('/', getAllColors);
colorRoutes.get('/:id', getSingleColor);
colorRoutes.put('/:id', isLoggedIn, updateColor);
colorRoutes.delete('/:id', isLoggedIn, deleteColor);

export default colorRoutes;