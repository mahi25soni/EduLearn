const { populate } = require("dotenv")
const {Course, Chapter, Content} = require("../models/courseModel")
const { Users } = require("../models/userModel")
const { deleteContentFunc } = require("./contentContoller")
const cloudinary = require('cloudinary').v2


const createCourse = async (req, res) => {
    try{
        const {instructor}  = req.body

        const new_course = await Course.create(req.body)

        // udpate user
        await Users.findByIdAndUpdate({_id : instructor}, {$push : {your_courses : new_course._id}}, {new : true} )

        res.status(200).json({
            success : true,
            message : "Your course info has been setted up!",
            data : new_course
        })
    }   
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const addChapter = async (req, res) => {
    try{
        const course_id = req.params._id

        const new_chapter = await Chapter.create({
            course_id : course_id, name : req.body.name
        })
        await Course.findByIdAndUpdate({_id : course_id}, {$push : {chapters : new_chapter._id}})

        res.status(200).json({
            success : true,
            message : "New chapter added!",
            data : new_chapter
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const updateCourse = async(req,res) => {
    try{
        const _id = req.params._id
        const updated_course = await Course.findByIdAndUpdate(_id , req.body, {new:true})

        res.status(200).json({
            success : true,
            message : "Course Updated!",
            data : updated_course
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}



const updateChapter = async(req,res) => {
    try{
        const _id = req.params._id
        const updated_chapter = await Chapter.findByIdAndUpdate(_id , req.body, {new:true})

        res.status(200).json({
            success : true,
            message : "Chapter Updated!",
            data : updated_chapter
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}




const deleteCourse = async(req,res) => {
    try{
        const _id = req.params._id

        const your_course = await Course.findOneAndDelete({_id : _id})

        //deleting all chapters of this course
        your_course.chapters.forEach(async (chapter_id) => {
            const chapter = await Chapter.findOneAndDelete({_id : chapter_id})

            // deleting content of each chapter
            let x;
            chapter.contentList.forEach(async (content_id) => {
                x = await deleteContentFunc(content_id)
            })


        })

        // deleting course id from students
        your_course.students.forEach(async (student_id) => {
            await Users.findByIdAndUpdate(student_id, {$pull : {your_courses : _id}}, {new : true})
        })

        // deleting course from instructors
        await Users.findByIdAndUpdate(your_course.instructor,  {$pull : {your_courses : _id}}, {new : true})

        // Enrollment and reviews wale bhi baaki hai abhi
        res.status(200).json({
            success : true,
            message : `${your_course.course_name} has been deleted!`,
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}


const deleteChapter = async(req,res) => {
    try{

        const _id = req.params._id

        const the_chapter = await Chapter.findOneAndDelete({_id : _id})

        // delete all content
        the_chapter.contentList.forEach(async (content_id) => {
            deleteContentFunc(content_id)

        })

        // delete chapter from course
        await Course.findByIdAndUpdate({_id : the_chapter.course_id}, {$pull : {chapters : _id}})


        res.status(200).json({
            success : true,
            message : `${the_chapter.name} has been deleted!`,
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}


const getCourseById = async(req, res) => {
    try{
        const course_id = req.params._id

        const the_course = await Course.findOne({_id : course_id}).populate({
            path : "chapters",
            populate : {
                path : "contentList"
            }
        })

        console.log("the course is " , the_course)
        res.status(200).json({
            success : true,
            data : the_course,
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}


module.exports = {
    createCourse,
    addChapter,
    updateCourse,
    updateChapter,
    deleteCourse,
    deleteChapter,
    getCourseById
}