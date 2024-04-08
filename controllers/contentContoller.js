const {Course, Chapter, Content}  = require("../models/courseModel")

const addContent = async (req, res) => {
    try{
        const chapter_id = req.params._id
        new_content = await Content.create({
            chapter_id : chapter_id ,
            ...req.body
        });

        // Append content id to chapter
        await Chapter.findByIdAndUpdate({_id : chapter_id}, {$push : {contentList : new_content._id}})

        res.status(200).json({
            success : true,
            message : "New Content added!",
            data : new_content
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
    addContent
}