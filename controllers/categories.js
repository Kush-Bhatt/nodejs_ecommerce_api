import Category from "../models/Category.js";
import asyncHandler from 'express-async-handler';

/**
 * @desc Create new category
 * @route POST /api/v1/categories
 * @access Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const categoryFound = await Category.findOne({ name });

    if (categoryFound) {
        throw new Error('Category already exist');
    }

    const category = await Category.create({
        name: name.toLowerCase(),
        user: req.userAuthId
    });

    res.json({
        status: 'Success',
        message: 'Category created successfully',
        category
    })
});

/**
 * @desc Get all categories
 * @route GET /api/v1/categories
 * @access Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    res.json({
        status: 'Success',
        message: 'Categories fetched successfully',
        categories
    })
});

/**
 * @desc Get single category
 * @route GET /api/v1/category/:id
 * @access Public
 */
export const getSingleCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.json({
            status: 'Success',
            message: 'Category does not exist'
        })
    } else {
        res.json({
            status: 'Success',
            message: 'Category fetched successfully',
            category
        })
    }
});

/**
 * @desc Update single category
 * @route PUT /api/v1/categories/:id
 * @access Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            name
        },
        {
            new: true
        }
    );

    if (!category) {
        throw new Error("Category not found");
    }

    res.json({
        status: 'Success',
        message: 'Category updated successfully',
        category
    })
});

/**
 * @desc Delete a category
 * @route DELETE /api/v1/categories/id
 * @access Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {

    /**
    * @TODO Delete products related to the respective Category
    */

    await Category.findByIdAndDelete(req.params.id);

    res.json({
        status: "Success",
        message: "Category deleted successfully"
    })
});