import asyncHandler from 'express-async-handler';
import Brand from '../models/Brand.js';

/**
 * @desc Create new Brand
 * @route POST /api/v1/brands
 * @access Private/Admin
 */
export const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const brandFound = await Brand.findOne({ name });
    if (brandFound) {
        throw new Error("Brand already exists.");
    }

    const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: 'Success',
        message: 'Brand created successfully.',
        brand
    });
});

/**
 * @desc Get All Brand
 * @route GET /api/v1/brands
 * @access Public
 */
export const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    res.json({
        status: 'Success',
        message: 'Brands fetched successfully.',
        brands
    });
});

/**
 * @desc Get Single Brand
 * @route GET /api/v1/brands/:id
 * @access Public
 */
export const getSingleBrand = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        res.json({
            status: 'Success',
            message: 'Brand does not exist'
        });
    } else {
        res.json({
            status: 'Success',
            message: 'Brand fetched successfully',
            brand
        });
    }
});

/**
 * @desc Update single brand
 * @route PUT /api/v1/brands/:id
 * @access Private/admin
 */
export const updateBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id,
        {
            name : name.toLowerCase()
        },
        {
            new: true
        }
    );

    if (!brand) {
        throw new Error("Brand not found");
    }

    res.json({
        status: 'Success',
        message: 'Brand updated successfully',
        brand
    });
});

/**
 * @desc Delete a brand
 * @route DELETE /api/v1/brands/:id
 * @access Private/Admin
 */
export const deleteBrand = asyncHandler(async (req, res) => {
    await Brand.findByIdAndDelete(req.params.id);

    res.json({
        status:"Success",
        message: "Brand deleted successfully"
    })
})