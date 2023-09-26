let User = require("../models/users.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");



const getAllUsers = asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const users = await User.find({}, {
            "__v": false,
            "password": false
        }).limit(limit).skip(skip);

        res.json({status: httpStatusText.SUCCESS, data: {users}});
    }
);

const register = asyncWrapper(
    async (req, res, next) => {
        const {firstName, lastName, email, password, role} = req.body;
        // const fileName = req.file; // from multer

        const oldUser = await User.findOne({email});
        if (oldUser) {
            const error = appError.create("user already exists", 400, httpStatusText.FAIL);
            return next(error);
        }
        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        });
        await newUser.save();

        // generate JWT Token
        const token = await generateJWT({email: newUser.email, id: newUser._id, role: newUser.role});
        newUser.token = token;
        res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}});

    }
);

const login = asyncWrapper(
    async (req, res, next) => {
        const {email, password} = req.body;

        if (!email && !password) {
            const error = appError.create("email and password are required", 400, httpStatusText.FAIL);
            return next(error);
        }
        const user = await User.findOne({email});

        if (!user) {
            const error = appError.create("User Not Found", 400, httpStatusText.FAIL);
            return next(error);
        }
        const matchedPassword = await bcrypt.compare(password, user.password);

        // Logged in Successful
        if (user && matchedPassword) {
            const token = await generateJWT({email: user.email, id: user._id, role: user.role});
            res.status(200).json({status: httpStatusText.SUCCESS, data: {token}});
        } else {
            const error = appError.create("Something Wrong", 500, httpStatusText.FAIL);
            return next(error);
        }
    }
);

module.exports = {
    getAllUsers,
    register,
    login
};