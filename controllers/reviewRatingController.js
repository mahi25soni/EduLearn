const { Course } = require("../models/courseModel");
const {TempRating, CourseRating, CourseReview } = require("../models/reviewRatingModel")
const mongoose = require("mongoose")

const postRating = async (req, res) => {
    try{    
        const course_id = req.params.course_id
        const new_rating = await CourseRating.create(
            {
                course_id : course_id,
                ...req.body
            }
        )

        const the_course = await Course.findOne({_id : course_id})

        let total_rating_yet = the_course.rating*the_course.raters
        total_rating_yet += new_rating.rating
        let total_raters = the_course.raters + 1;
        let final_average_rating = total_rating_yet/total_raters


        // const updated_course = await Course.findOneAndUpdate({_id : course_id}, {
        //     rating : final_average_rating,
        //     raters : total_raters
        // }, {new : true})


        res.status(200).json({
            success : true,
            message : "New rating added!",
            data : updated_course
        })

    }
    catch(err) {
        console.log(err.message)
        if(err.code == 11000){
            return res.status(500).json({
                success : false,
                message : "You already rated this course, can't rate it again"
            })
        }
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const createReview = async (req, res) => {
    try{
        const course_id = req.params.course_id

        const new_review = await CourseReview.create({
            course_id : course_id,
            ...req.body
        })
        await Course.findByIdAndUpdate({_id : course_id}, {$push :{reviews : new_review._id}}, {new : true})

        res.status(200).json({
            success : true,
            message : "New reviews added!",
            data : new_review
        })
    }
    catch(err) {
        console.log(err.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const getAllReviews = async (req, res) => {
    try{
        const course_id = req.params.course_id
        const allReviews = await CourseReview.find({ course_id }).sort({ createdAt: -1 });

        res.status(200).json({
            success : true,
            message : "New reviews added!",
            data : allReviews
        })

    }
    catch(err) {
        console.log(err.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const deleteReview = async (req, res) => {
    try{
        const review_id = req.params.review_id
        await CourseReview.delete({_id : review_id})

        res.status(200).json({
            success : true,
            message : "Review Deleted!",
        })

    }
    catch(err) {
        console.log(err.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}




module.exports = {
    postRating,
    createReview,
    getAllReviews,
    deleteReview
}