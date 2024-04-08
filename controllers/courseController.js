const {Course, Chapter, Content} = require("../models/courseModel")
const { Users } = require("../models/userModel")


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
        const course_id = req.params.course_id

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
        const course_id = req.params.course_id
        const your_course = await Course. 
        res.status(200).json({
            success : true,
            message : "Course Updated!",
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


const updateChapter = async(req,res) => {
    try{

        res.status(200).json({
            success : true,
            message : "Chapter Updated!",
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


const deleteCourse = async(req,res) => {
    try{

        res.status(200).json({
            success : true,
            message : "Course deleted!",
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


const deleteChapter = async(req,res) => {
    try{

        res.status(200).json({
            success : true,
            message : "Chapter deeleted!",
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


module.exports = {
    createCourse,
    addChapter,
    updateCourse,
    updateChapter,
    deleteCourse,
    deleteChapter
}