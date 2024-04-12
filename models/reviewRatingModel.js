const mongoose = require("mongoose")

const courseReviewSchema = new mongoose.Schema({
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    review : String
},
{
    timestamps : true
})

const CourseReview = new mongoose.model("CourseReview", courseReviewSchema)

const courseRatingSchema = new mongoose.Schema({
    course_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Courses"
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users",
    },
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

courseRatingSchema.index({ course_id: 1, user_id: 1 }, { unique: true });
const CourseRating = new mongoose.model("CourseRating", courseRatingSchema)

module.exports = {
    CourseReview,
    CourseRating
}
