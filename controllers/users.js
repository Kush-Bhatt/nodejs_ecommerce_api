import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

/**
 * @desc Register user
 * @route POST /api/v1/users/register
 * @access Private/Admin
*/
export const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password} = req.body;
    console.log(fullName, email, password);
    const userExits = await User.findOne({ email });
    
    if(userExits)
    {
        throw new Error("User already registered")
    }else{       
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        
        //Create the user
        const user = await User.create({
            fullName,
            email,
            password : hashPassword,
        });
        res.status(201).json({
            status : 'success',
            message : "User Registered successfully",
            data : user
        });
    }
});

/**
 * @desc Login user
 * @route POST /api/v1/users/login
 * @access Public
*/
export const loginUser = asyncHandler(async (req, res) => {
    const {email,password} = req.body;
    const userFound = await User.findOne({email});
    if(userFound && await bcrypt.compare(password,userFound.password)){
        res.json({
            status : 'success',
            msg : "Login is Successfull",
            userFound,
            token : generateToken(userFound?._id)
        })
    }else{
        throw new Error("Invalid Credentials");
    }
});

/**
 * @desc Get User Profile
 * @route GET /api/v1/users/profile
 * @access Private
*/
export const getUserProfile = asyncHandler(async (req,res) => {
    console.log(req);
    const user = await User.findById(req.userAuthId);
    res.json({
        status: 'Success',
        message: 'User profile fetched successfully',
        user
    })
});

/**
 * @desc Update user shipping address
 * @route PUT /api/v1/users/update/shipping
 * @access Private
 */
export const updateShippingAddress = asyncHandler(async (req, res) => {
    const { firstname, lastname, address, city, postalCode, province, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(req.userAuthId,
        {
            shippingAddress: {
                firstname, lastname, address, city, postalCode, province, phoneNumber
            },
            hasShippingAddress: true
        },
        {
            new: true
        }
    );

    res.json({
        status: 'Success',
        message: 'User shipping address updated successfully.',
        user
    });
});



