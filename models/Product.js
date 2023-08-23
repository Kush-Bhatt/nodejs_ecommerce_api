import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        category: {
            type: String,
            ref: 'Category',
            required: true
        },
        sizes: {
            type: [String],
            enum: ["S", "M", "L", "XL", "XXL"],
            required: true
        },
        colors: {
            type: [String],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        price: {
            type: Number,
            required: true
        },
        totalQty: {
            type: Number,
            required: true
        },
        totalSold: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);

// Adding virtual properties
ProductSchema.virtual('totalReviews').get(function () {
    const product = this;
    return product?.reviews.length;
});
ProductSchema.virtual('averageRatings').get(function () {
    const product = this;
    if (!product.reviews || !product.reviews.length) {
        return "Not rated yet";
    }
    let totalRating = 0;
    product?.reviews.forEach(review => {
        totalRating += review.rating;
    });
    const averageRatings = Number(totalRating / product?.totalReviews).toFixed(1);
    return averageRatings;
});
ProductSchema.virtual('qtyLeft').get(function() {
    const product = this;
    return product.totalQty - product.totalSold;
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;