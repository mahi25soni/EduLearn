const {Course, Chapter, Content} = require("../models/courseModel")

const createCourse = async (req, res) => {
    try{

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

    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const addContent = async (req, res) => {
    try{

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
    addContent
}