const {body} = require("express-validator");

const validationSchema = () => {
    return [
        body('title').notEmpty().withMessage("Title is Required").isLength({min: 2}).withMessage("Title at least is 2 letters"),
        body('price').notEmpty().withMessage("Price is Required"),
    ];
};

module.exports = {
    validationSchema
};