const {validationResult} = require("express-validator");
let Course = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const getAllCourse = asyncWrapper(async (req, res) => {
    // find({},{}) => query filter , projection => optional fields to return
    // const courses = await Course.find({price:{$gt: 800}},{});

    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS, data: {courses}});

});


const getCourse = asyncWrapper(
    async (req, res, next) => {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId, {
            "__v": false
        });
        if (!course) {
            const error = appError.create("course not found", 404, httpStatusText.FAIL);
            return next(error);
            // return res.status(404).json({status: httpStatusText.FAIL, data: {course: "course not found"}});
        }
        res.json({status: httpStatusText.SUCCESS, data: {course}});
        //     try {
        // } catch (error) {
        //     return res.status(400).json({status: httpStatusText.ERROR, data: null, message: error.message, code: 400});
        // }
    }
);


const addCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error);
        // return res.status(400).json({status: httpStatusText.FAIL, data: errors.array()});
    }
    const newCourse = new Course(req.body);

    await newCourse.save();

    res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
});


const updateCourse = asyncWrapper(async (req, res) => {
    // let course = courses.find((course) => course.id === courseId);
    // if (!course) {
    //     return res.status(404).json({msg: "Course is not found"});
    // }
    // course = {...course, ...req.body};
    const courseId = req.params.courseId;
    // const updatedCourse = await Course.findByIdAndUpdate(courseId, {$set: {...req.body}});
    const updatedCourse = await Course.updateOne({_id: courseId}, {$set: {...req.body}});
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}});
    // try {
    // } catch (error) {
    //     return res.status(400).json({status: httpStatusText.ERROR, message: error.message});
    // }

});


const deleteCourse = asyncWrapper(async (req, res) => {
    const courseId = req.params.courseId;
    await Course.deleteOne({_id: courseId});
    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
});


module.exports = {
    getAllCourse,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
};