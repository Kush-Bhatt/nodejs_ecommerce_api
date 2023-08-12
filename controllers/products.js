import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

/**
 * @desc Create new Product
 * @route POST /api/v1/products
 * @access Private/Admin
*/
export const createProduct = asyncHandler(async (req, res) => {
    const { name,
        description,
        brand,
        category,
        sizes,
        colors,
        reviews,
        price,
        totalQty,
        totalSold } = req.body;

    const productExists = await Product.findOne({ name });
    if (productExists) {
        throw new Error('Product Already Exists');
        // res.json({
        //     status: 'Failure',
        //     msg: 'Product Already Existed',
        // })
    }

    //Create new Product
    const product = await Product.create({
        name,
        description,
        brand,
        category,
        sizes,
        colors,
        user: req.userAuthId,
        price,
        totalQty
    });

    //Push the product into category

    res.json({
        status: 'Success',
        msg: 'Product Created Successfully',
        product,
    });
});

/**
 * @desc Get all Products
 * @route GET /api/v1/products
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    let productQuery = Product.find();

    //filter by name
    if (req.query.name) {
        productQuery = productQuery.find({ name: { $regex: req.query.name, $options: 'i' } });
    }

    //filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" },
        });
    }

    //filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: "i" },
        });
    }

    //filter by color
    if (req.query.color) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.color, $options: "i" },
        });
    }

    //filter by size
    if (req.query.size) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.size, $options: "i" },
        });
    }

    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-");
        //gte: greater or equal
        //lte: less than or equal to
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] },
        });
    }

    // Pagination
    const page = parseInt(req.query.page ? req.query.page : 1);
    const limit = parseInt(req.query.limit ? req.query.limit : 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    //pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    const products = await productQuery;
    console.log(products);

    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: 'Products fetched successfully',
        products,
    });
});

/**
 * @desc Get single product
 * @route GET /api/products/:id
 * @access Public
 */
export const getProduct = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: 'Success',
        message: 'Product fetched successfully',
        product
    });
})

/**
 * @desc update product
 * @route PUT /api/products/:id/update
 * @access Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
    const updateFields = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
        new: true
    })

    res.json({
        status: 'Success',
        message: 'Product updated successfully',
        product
    });
})

/**
 * @desc delete product
 * @route DELETE /api/products/:id/delete
 * @access Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
        status: 'Success',
        message: 'Product deleted successfully',
    });
})