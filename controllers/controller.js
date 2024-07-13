const asyncHandler = require('express-async-handler')
const bcrypt = require("bcryptjs");
const User = require('../models/userModel')
const { generateToken } = require("../utils/jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username: username,
        password: passwordHash,
    });

    res.status(200).json({ message: "registration successfull" });
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new Error("Fill all fields");
    }

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            message: "Login Successful",
            token: generateToken(user.id),
            _id: user.id,
            savedPasswords: user.savedPasswords
        });
    } else {
        res.status(400);
        throw new Error("Invalid Credentials");
    }
})

const savePassword = asyncHandler(async (req, res) => {
    const { userId, title, password } = req.body;

    if (!userId || !password || !title) {
        throw new Error("Fill all fields");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("something happened");
    }

    const existingPassword = user.savedPasswords.find(savedPassword => savedPassword.title === title);
    if (existingPassword) {
        throw new Error("title already exists");
    }

    user.savedPasswords.push({ title, password });
    await user.save();

    res.json({
        message: "password saved successfully",
        token: generateToken(user.id),
        _id: user.id,
        savedPasswords: user.savedPasswords
    });
})

const deletePassword = asyncHandler(async (req, res) => {
    const { userId, title } = req.body;

    const result = await User.updateOne(
        { _id: userId },
        { $pull: { savedPasswords: { title } } }
    );

    if (result) {
        const user = await User.findById(userId);
        res.json({
            message: "password deleted",
            token: generateToken(user.id),
            _id: user.id,
            savedPasswords: user.savedPasswords
        });
    } else {
        throw new Error("password not found");
    }
})

module.exports = {
    registerUser,
    loginUser,
    savePassword,
    deletePassword
}