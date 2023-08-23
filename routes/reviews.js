import express from "express";
import { createReview } from "../controllers/reviews.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const reviewRoutes = express.Router();

reviewRoutes.post('/:productId', isLoggedIn, createReview);

export default reviewRoutes;