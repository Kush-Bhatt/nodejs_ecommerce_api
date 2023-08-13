import asyncHandler from 'express-async-handler';
import Color from '../models/Color.js';

/**
 * @desc Create new Color
 * @route POST /api/v1/colors
 * @access Private/Admin
 */
export const createColor = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const colorFound = await Color.findOne({ name });
    if (colorFound) {
        throw new Error("Color already exists.");
    }

    const color = await Color.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    });

    res.json({
        status: 'Success',
        message: 'Color created successfully.',
        color
    });
});

/**
 * @desc Get All Colors
 * @route GET /api/v1/colors
 * @access Public
 */
export const getAllColors = asyncHandler(async (req, res) => {
    const colors = await Color.find();
    res.json({
        status: 'Success',
        message: 'Colors fetched successfully.',
        colors
    });
});

/**
 * @desc Get Single Color
 * @route GET /api/v1/colors/:id
 * @access Public
 */
export const getSingleColor = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);

    if (!color) {
        res.json({
            status: 'Success',
            message: 'Color does not exist'
        });
    } else {
        res.json({
            status: 'Success',
            message: 'Color fetched successfully',
            color
        });
    }
});

/**
 * @desc Update single color
 * @route PUT /api/v1/colors/:id
 * @access Private/admin
 */
export const updateColor = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const color = await Color.findByIdAndUpdate(req.params.id,
        {
            name : name.toLowerCase()
        },
        {
            new: true
        }
    );

    res.json({
        status: 'Success',
        message: 'Color updated successfully',
        color
    });
});

/**
 * @desc Delete a color
 * @route DELETE /api/v1/colors/:id
 * @access Private/Admin
 */
export const deleteColor = asyncHandler(async (req, res) => {
    await Color.findByIdAndDelete(req.params.id);

    res.json({
        status:"Success",
        message: "Color deleted successfully"
    })
})