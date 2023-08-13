import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Color from '../models/Color.js';

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

    //find the category
    const categoryFound = await Category.findOne({name : category.toLowerCase()});
    if(!categoryFound) {
        throw new Error('Category not found, please create category first or check category name"');
    }

    //find the brand
    const brandFound = await Brand.findOne({
        name: brand.toLowerCase()
    });
    if (!brandFound) {
        throw new Error("Brand not found, please create brand first or check brand name");
    }

    //find the brand
    const colorFound = await Color.findOne({
        name: colors.toLowerCase()
    });
    if (!colorFound) {
        throw new Error("Color not found, please create color first or check color name");
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

    //Add the product to the category
    categoryFound.products.push(product._id);
    await categoryFound.save();

    // Add product to the brand
    brandFound.products.push(product._id);
    await brandFound.save();

    // Add product to the color
    colorFound.products.push(product._id);
    await colorFound.save();

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
 * @route GET /api/v1/products/:id
 * @access Public
 */
export const getSingleProduct = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const product = await Product.findById(req.params.id);
    if (!category) {
        res.json({
            status: 'Success',
            message: 'Product does not exist'
        })
    } else {
        res.json({
            status: 'Success',
            message: 'Product fetched successfully',
            product
        })
    }
})

/**
 * @desc update product
 * @route PUT /api/v1/products/:id/update
 * @access Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
    const updateFields = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
        new: true
    });

    if(!product) {
        throw new Error("Product not found");
    }

    res.json({
        status: 'Success',
        message: 'Product updated successfully',
        product
    });
})

/**
 * @desc delete product
 * @route DELETE /api/v1/products/:id
 * @access Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
        status: 'Success',
        message: 'Product deleted successfully',
    });
})

/**
 * @desc delete product related to category
 * @route DELETE /api/v1/products/bycategory/:id
 * @access Private/Admin
 */
export const deleteProductsByCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    // const products = category.products;
    console.log(category);

    await Product.deleteMany({category : { $regex: category.name, $options: "i" }});

    res.json({
        status: 'Success',
        message: 'Product deleted successfully',
    });
});