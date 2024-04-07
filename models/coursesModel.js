const mongoose = require("mongoose")

const coursesSchema = new mongoose.Schema({
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    course_name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    launch_date : {
        type : Date,
        default : Date.now()
    },
    expriry_data : {
        type : Date
    },
    description : {
        type : String
    },
    students : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Users"
        }
    ],
},
{
    timestamps : true
})

const Courses  = new mongoose.model("Courses", coursesSchema)


const courseReviewRatingSchema = new mongoose.Schema({
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    reviews : [{type : String}],
    rating : {
        type : Number,
        min : 0,
        mix : 5,
        required : true
    },
},
{
    timestamps : true
})
