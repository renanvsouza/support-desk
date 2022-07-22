const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

//Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!username || !password) {
        throw new Error('Please provide the username and password');
    }

    //Check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists.');
    }

    //Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const newUser = await User.create({
        email,
        username,
        password: hashedPassword
    })

    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser._id)
        });
    } else {
        res.status(400);
        throw new error('Invalid user data');
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Error('Please provide the username and password');
    }

    //Check if there is a user with the given email
    const user = await User.findOne({ email: email });

    //Check if the password provided matches with the stored hash
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username
    }

    res.status(200).json(user);
})


module.exports = {
    registerUser,
    loginUser,
    getMe
}