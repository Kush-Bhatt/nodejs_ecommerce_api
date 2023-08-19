import express from "express";
import { createReview } from "../controllers/reviews.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const reviewRoutes = express.Router();

reviewRoutes.post('/:productID', isLoggedIn, createReview);

export default reviewRoutes;