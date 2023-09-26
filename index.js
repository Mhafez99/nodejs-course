// CRUD Operations (Create | Read | Update | Delete)
// Controller -> Control on resource what it do and deal with data
// Route → Resource  | handler    



// Express-validator || Joijs || zod
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const httpStatusText = require("./utils/httpStatusText");
const path = require("path");

const mongoose = require("mongoose");

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log("mongodb server started");
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
 
const coursesRouter = require("./routes/courses.route");
const usersRouter = require("./routes/users.route");

app.use("/api/courses", coursesRouter); // /api/courses
app.use("/api/users", usersRouter); // /api/users

// Global middleware for not found router
app.all("*", (req, res) => {
    return res.status(404).json({status: httpStatusText.ERROR, message: "This resourse is not available"});
});

// global error handler
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});
});


app.listen(process.env.PORT, () => {
    console.log("Listening on port 5000");
}); 
