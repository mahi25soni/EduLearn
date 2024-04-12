const { Course } = require("../models/courseModel");
const { CourseRating } = require("../models/reviewRatingModel")
const mongoose = require("mongoose")

const postRating = async (req, res) => {
    const session  = await mongoose.startSession()
    try{
        session.startTransaction();
    
        const course_id = req.params.course_id
        const new_rating = await CourseRating.create([
            {
                course_id : course_id,
                ...req.body
            }
        ], {session})

        const the_course = await Course.findOne({_id : course_id}, {session})

        const total_rating_yet = the_course.rating*the_course.raters
        total_rating_yet += new_rating.rating
        const total_raters = the_course.raters + 1;
        const final_average_rating = total_rating_yet/ratters

        await Course.findOneAndUpdate({_id : course_id}, {
            rating : final_average_rating,
            raters : total_raters
        }, {new : true}, {session})

        await session.commitTransaction()

    }
    catch(err) {
        console.log(err.message)
        await session.commitTransaction()
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
    session.endSession();
}

module.exports = {
    postRating
}