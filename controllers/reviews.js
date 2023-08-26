import Product from "../models/Product.js";
import Review from "../models/Review.js";
import asyncHandler from 'express-async-handler';

/**
 * @desc Create new review
 * @route POST /api/v1/reviews/product
 * @access Public
 */
export const createReview = asyncHandler(async (req, res) => {
    const {message, rating} = req.body;
    const {productId} = req.params;

    //product exist exit
    const productFound = await Product.findById(productId).populate('reviews');
    if(!productFound) {
        throw new Error('Product Not Found');
    }

    // product already reviewed by user check
    const hasReviewed = productFound.reviews?.find((review) => {
        return String(review?.user) === req.userAuthId;
    })
    if(hasReviewed) {
        throw new Error('You have already reviewed this product.');
    }

    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user: req.userAuthId
    });

    //push review in productFound
    productFound.reviews.push(review?._id);
    await productFound.save();

    res.status(201).json({
        success: true,
        msg: 'Review Created Successfully',
        review
    });
});