const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization") || req.header("authorization");
    if (!authHeader) {
        const error = appError.create("Token is Required", 401, httpStatusText.ERROR);
        return next(error);
    }
    const token = authHeader.split(" ")[1];
    try {
        // decoded user
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    } catch (err) {
        const error = appError.create("Invalid Token", 401, httpStatusText.ERROR);
        return next(error);
    }

};

module.exports = verifyToken;