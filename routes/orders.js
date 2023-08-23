import express from "express";
import { createOrder} from "../controllers/orders.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRoutes = express.Router();

orderRoutes.post('/', isLoggedIn, createOrder);

export default orderRoutes;