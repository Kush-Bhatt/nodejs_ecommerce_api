import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler';

/*
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

/*
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
            userFound
        })
    }else{
        throw new Error("Invalid Credentials");
    }
});



