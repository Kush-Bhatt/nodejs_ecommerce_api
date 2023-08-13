import express from 'express';
import dbConnect from '../config/dbConnect.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRoutes from '../routes/users.js'; 
import productRoutes from '../routes/products.js'; 
import categoryRoutes from '../routes/categories.js'; 
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';

dotenv.config();
dbConnect();
const app = express();

app.use(express.json());
app.use(morgan('dev'));

//Routes Middlewares
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/products',productRoutes);
app.use('/api/v1/categories',categoryRoutes);

//Err Middlewares
app.use(notFound);
app.use(globalErrHandler);

export default app;