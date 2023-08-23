import express from 'express';
import {registerUser, loginUser, getUserProfile, updateShippingAddress} from '../controllers/users.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/profile', isLoggedIn, getUserProfile);
userRoutes.put('/update/shipping', isLoggedIn, updateShippingAddress);

export default userRoutes;